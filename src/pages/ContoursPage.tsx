import { lazy, useState } from "react";
import type { Data, Layout } from "plotly.js";
import { api } from "../api/client";
import type { Contour } from "../api/client";
import { useAppContext } from "../app/AppContext";
import MagnetPicker from "../components/magnets/MagnetPicker";
import { ErrorBox, Empty, Num } from "../components/ui/Fields";
import {
  LIFT_THRESHOLDS,
  traceIsoline,
  pickIsolineLabel,
  forceFillScale,
} from "../components/charts/forceContours";
const Chart = lazy(() => import("../components/charts/ContourPlot"));

export default function ContoursPage() {
  const { units, datasets } = useAppContext();

  const [ids, setIds] = useState(["", ""]);
  const [bounds, setBounds] = useState({
    xMin: 0,
    xMax: 600,
    yMin: 0,
    yMax: 600,
  });
  const [gauss, setGauss] = useState({ min: 0, max: 2100, step: 100 });
  const [results, setResults] = useState<{ name: string; data: Contour }[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate() {
    setBusy(true);
    setError("");
    setResults([]);
    try {
      if (!ids.some(Boolean)) throw new Error("Select a magnet first.");
      if (gauss.step <= 0 || gauss.max <= gauss.min)
        throw new Error(
          "Choose positive contour spacing and an increasing gauss range.",
        );
      setResults(
        await Promise.all(
          ids.filter(Boolean).map(async (id) => ({
            name: datasets
              .find((d) => String(d.id) === id)!
              .file.replace(".csv", ""),
            data: await api<Contour>("contours", { dataset: id, ...bounds }),
          })),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  
  return (
    <div className="grid grid-cols-1 items-start gap-[22px] min-[1041px]:grid-cols-[minmax(265px,295px)_minmax(0,1fr)] min-[1201px]:grid-cols-[minmax(305px,340px)_minmax(0,1fr)] max-[1200px]:gap-4 [&>section]:min-w-0">
      <section className="rounded-xl border border-line bg-white shadow-sm h-fit p-[23px] max-[1200px]:p-[18px] [&>.card-header]:pb-[11px] [&>.card-header]:pt-0 [&>.card-header]:px-0 [&>h3]:mb-2 [&>h4]:border-t [&>h4]:border-line [&>h4]:pt-4">
        <h3>Contour Comparison</h3>
        <p className="mt-0 mb-[22px] text-xs leading-[1.65] text-muted">
          Select one or two magnets, choose the area to display, and generate
          the contour maps.
        </p>
        {!datasets.length && (
          <p className="mb-[18px] rounded-lg border border-amber-600/25 bg-amber-600/7 px-4 py-[14px] text-xs leading-relaxed text-amber-700">
            Magnet models are unavailable right now. Please try again later or
            contact your support team.
          </p>
        )}
        {ids.map((id, i) => (
          <div
            className="border-t border-line py-[14px] pb-3 first:border-t-0 [&_h4]:my-0 [&_h4]:mb-[14px]"
            key={i}
          >
            <div className="flex items-center justify-between gap-2">
              <h4>
                Magnet {i + 1}
                {i === 1 ? " (optional)" : ""}
              </h4>
              <button
                className="inline-flex items-center gap-[5px] px-[3px] py-2 text-xs font-semibold text-eriez-hover hover:underline"
                onClick={() => setIds(ids.map((v, j) => (i === j ? "" : v)))}
              >
                Clear
              </button>
            </div>
            <MagnetPicker
              datasets={datasets}
              value={id}
              onChange={(v) => setIds(ids.map((x, j) => (i === j ? v : x)))}
            />
          </div>
        ))}
        <h4>Plot bounds ({units.distance})</h4>
        <div className="grid grid-cols-2 gap-[11px] max-[380px]:grid-cols-1">
          {(Object.keys(bounds) as (keyof typeof bounds)[]).map((key) => (
            <Num
              key={key}
              label={
                {
                  xMin: "Offset start",
                  xMax: "Offset end",
                  yMin: "Distance start",
                  yMax: "Distance end",
                }[key]
              }
              value={Number((bounds[key] * units.factor).toFixed(4))}
              onChange={(v) =>
                setBounds({ ...bounds, [key]: v / units.factor })
              }
            />
          ))}
        </div>
        <h4>Gauss contours</h4>
        <div className="grid grid-cols-2 gap-[11px] max-[380px]:grid-cols-1">
          <Num
            label="Minimum"
            value={gauss.min}
            onChange={(min) => setGauss({ ...gauss, min })}
          />
          <Num
            label="Maximum"
            value={gauss.max}
            onChange={(max) => setGauss({ ...gauss, max })}
          />
        </div>
        <Num
          label="Spacing (Gauss)"
          min={1}
          value={gauss.step}
          onChange={(step) => setGauss({ ...gauss, step })}
        />
        <button
          className="inline-flex min-h-10 items-center justify-center gap-[9px] rounded-lg border border-eriez bg-eriez px-[18px] py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] mt-[13px] w-full"
          disabled={busy}
          aria-busy={busy}
          onClick={calculate}
        >
          {busy ? "Calculating…" : "Generate Contours →"}
        </button>
        <ErrorBox message={error} />
      </section>
      <section>
        {!results.length ? (
          <Empty title="Explore the magnetic field">
            View the field below the magnet face and the static lift threshold
            contours for common objects.
          </Empty>
        ) : (
          <>
            <h3 className="my-[17px] mb-[11px] text-[15px]">
              Field strength (Gauss)
            </h3>
            <div
              className={`mb-[23px] grid grid-cols-1 gap-4 ${results.length === 1 ? "" : "min-[1461px]:grid-cols-2"}`}
            >
              {results.map(({ name, data }) => {
                const x = data.x.map((v) => v * units.factor);
                const y = data.y.map((v) => v * units.factor);
                return (
                  <div
                    className="rounded-xl border border-line bg-white shadow-sm mb-5 overflow-hidden min-w-0 px-1 pt-2.5 pb-0 [&>h4]:m-0 [&>h4]:px-4 [&>h4]:pt-[5px]"
                    key={`gauss-${name}`}
                  >
                    <h4>{name.replaceAll("_", " / ").toUpperCase()}</h4>
                    <Chart
                      title="Gauss"
                      xTitle={`Offset (${units.distance})`}
                      yTitle={`Distance (${units.distance})`}
                      data={[
                        {
                          type: "contour",
                          x,
                          y,
                          z: data.gauss,
                          colorscale: "Jet",
                          autocontour: false,
                          contours: {
                            start: gauss.min,
                            end: gauss.max,
                            size: gauss.step,
                            coloring: "fill",
                            showlabels: true,
                            labelfont: { size: 11, color: "#151a22" },
                          },
                          colorbar: { title: { text: "Gauss" }, thickness: 14 },
                          hovertemplate:
                            "Offset %{x:.0f}<br>Distance %{y:.0f}<br>Gauss %{z:.0f}<extra></extra>",
                        } as Data,
                      ]}
                      extra={{
                        height: 430,
                        margin: { l: 64, r: 20, t: 55, b: 60 },
                        xaxis: {
                          range: [x[0], x[x.length - 1]],
                          dtick: 100 * units.factor,
                        },
                        yaxis: {
                          range: [y[y.length - 1], y[0]],
                          dtick: 100 * units.factor,
                        },
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <h3 className="my-[17px] mb-[11px] text-[15px]">
              Force Index — Static Lift Thresholds
            </h3>
            <div
              className={`mb-[23px] grid grid-cols-1 gap-4 ${results.length === 1 ? "" : "min-[1461px]:grid-cols-2"}`}
            >
              {results.map(({ name, data }) => {
                const x = data.x.map((v) => v * units.factor);
                const y = data.y.map((v) => v * units.factor);
                const annotations: NonNullable<Layout["annotations"]> = [];
                const labelXs = [0.64, 0.81, 0.72, 0.85, 0.58, 0.76];
                const lines: Data[] = LIFT_THRESHOLDS.map(
                  ([object, threshold], i) => {
                    const points = traceIsoline(x, y, data.force, threshold);
                    const location = pickIsolineLabel(
                      points,
                      [x[0], x[x.length - 1]],
                      [y[0], y[y.length - 1]],
                      labelXs[i],
                    );
                    if (location)
                      annotations.push({
                        x: location.x,
                        y: location.y,
                        xref: "x",
                        yref: "y",
                        text: object,
                        showarrow: false,
                        font: { size: 10, color: "#241c1c" },
                        bgcolor: "rgba(255,255,255,0.72)",
                        borderpad: 1,
                      });
                    return {
                      type: "scatter",
                      mode: "lines",
                      x: points.x,
                      y: points.y,
                      connectgaps: false,
                      showlegend: true,
                      name: object,
                      line: { color: "#312121", width: 1.3 },
                      hovertemplate: `${object} · ${threshold.toFixed(6)} T²/m<br>Offset %{x:.1f}<br>Distance %{y:.1f}<extra></extra>`,
                    } as Data;
                  },
                );
                return (
                  <div
                    className="rounded-xl border border-line bg-white shadow-sm mb-5 overflow-hidden min-w-0 px-1 pt-2.5 pb-0 [&>h4]:m-0 [&>h4]:px-4 [&>h4]:pt-[5px]"
                    key={`force-${name}`}
                  >
                    <h4>{name.replaceAll("_", " / ").toUpperCase()}</h4>
                    <Chart
                      title="Force Index"
                      xTitle={`Offset (${units.distance})`}
                      yTitle={`Distance (${units.distance})`}
                      data={[
                        {
                          type: "heatmap",
                          x,
                          y,
                          z: data.force,
                          zmin: 0,
                          zmax: 0.034232,
                          colorscale: forceFillScale(),
                          zsmooth: "best",
                          showscale: false,
                          showlegend: false,
                          hovertemplate:
                            "Offset %{x:.0f}<br>Distance %{y:.0f}<br>Force Index %{z:.6f} T²/m<extra></extra>",
                        } as Data,
                        ...lines,
                      ]}
                      extra={{
                        height: 430,
                        margin: { l: 64, r: 20, t: 55, b: 78 },
                        legend: {
                          orientation: "h",
                          y: -0.24,
                          font: { size: 10 },
                        },
                        annotations,
                        xaxis: {
                          range: [x[0], x[x.length - 1]],
                          dtick: 100 * units.factor,
                        },
                        yaxis: {
                          range: [y[y.length - 1], y[0]],
                          dtick: 100 * units.factor,
                        },
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
        <p className="text-xs leading-[1.7] text-muted">
          Shows the right half below the magnet; the opposite half is mirrored.
          Static lift contours are estimates in air and do not include burden.
        </p>
      </section>
    </div>
  );
}