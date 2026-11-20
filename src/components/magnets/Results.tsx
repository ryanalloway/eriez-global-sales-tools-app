import { lazy } from "react";
import type { Data } from "plotly.js";
import type { Profile } from "../../api/client";
import { forceUnits, type Units } from "../../lib/units";
import { download } from "../../lib/csv";
import { isExtrapolatedLift, measuredDistanceRange } from "../../lib/accuracy";
import { Empty } from "../ui/Fields";
const Chart = lazy(() => import("../charts/ContourPlot"));
const colors = ["#F37021", "#2563EB", "#159A83", "#8B5CF6", "#DB477A"];

export default function Results({
  profiles,
  units,
  bestFit = [],
  exclusions = [],
  combined = false,
}: {
  profiles: Profile[];
  units: Units;
  bestFit?: boolean[];
  exclusions?: number[];
  combined?: boolean;
}) {
  if (!profiles.length)
    return (
      <Empty title="Your analysis starts here">
        Choose your inputs and calculate to view field strength, force, and
        static lift distances.
      </Empty>
    );
  const traces = (force: boolean): Data[] =>
    profiles.map((p, i) => {
      const useInput = !force && bestFit[i] && p.inputDistance;
      const x = useInput ? p.inputDistance! : p.distance;
      const y = force ? p.force : useInput ? p.inputGauss! : p.gauss;
      const points = x
        .map((d, index) => ({ d, v: y[index] }))
        .filter((v) => v.d >= (exclusions[i] ?? 0));
      return {
        type: "scatter",
        mode: useInput ? "lines+markers" : "lines",
        name: p.name + (combined ? (force ? " · force" : " · gauss") : ""),
        x: points.map((v) => v.d * units.factor),
        y: points.map((v) =>
          v.v === null ? null : force ? v.v * forceUnits[units.force] : v.v,
        ),
        line: {
          color: colors[i],
          width: 2.5,
          dash: force && combined ? "dash" : "solid",
        },
        ...(force && combined ? { yaxis: "y2" } : {}),
      } as Data;
    });
  const baseline = profiles[0].lift.Nut;
  const extrapolated = profiles.flatMap((profile) =>
    Object.entries(profile.lift)
      .filter(([, distance]) => isExtrapolatedLift(profile, distance))
      .map(([object]) => ({ name: profile.name, object })),
  );
  return (
    <>
      <div className="mb-[13px] flex min-h-[41px] items-center justify-between gap-3 max-[560px]:flex-wrap ">
        <span className="inline-block text-[10px] font-bold tracking-[0.9px] text-muted">ANALYSIS RESULTS</span>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
          onClick={() =>
            download("eriez-profiles.csv", [
              [
                "Magnet",
                "Distance (" + units.distance + ")",
                "Gauss",
                "Force (" + units.force + ")",
              ],
              ...profiles.flatMap((p) =>
                p.distance.map((d, i) => [
                  p.name,
                  d * units.factor,
                  p.gauss[i],
                  p.force[i] === null
                    ? ""
                    : p.force[i]! * forceUnits[units.force],
                ]),
              ),
            ])
          }
        >
          ↓ Export CSV
        </button>
      </div>
      <div className="rounded-xl border border-line bg-white shadow-sm mb-5 overflow-hidden">
        <Chart
          data={combined ? [...traces(false), ...traces(true)] : traces(false)}
          title={combined ? "Field Strength & Force Index" : "Field Strength"}
          xTitle={"Distance (" + units.distance + ")"}
          yTitle="Field Strength (Gauss)"
          extra={
            combined
              ? {
                  yaxis2: {
                    title: { text: units.force },
                    overlaying: "y",
                    side: "right",
                    showgrid: false,
                  },
                  margin: { l: 75, r: 85, t: 55, b: 85 },
                  xaxis: {
                    title: { text: "Distance (" + units.distance + ")" },
                    range: [
                      0,
                      Math.max(...profiles.map((p) => p.maxInput ?? 600)) *
                        units.factor,
                    ],
                  },
                }
              : {
                  height: 650,
                  xaxis: {
                    range: [0, units.distance === "mm" ? 600 : 20],
                    nticks: 50,
                  },
                  yaxis: { nticks: 25 },
                }
          }
        />
      </div>
      {!combined && (
        <div className="rounded-xl border border-line bg-white shadow-sm mb-5 overflow-hidden">
          <Chart
            data={traces(true)}
            title="Force Index"
            xTitle={"Distance (" + units.distance + ")"}
            yTitle={units.force}
            extra={{
              height: 650,
              xaxis: {
                range: [0, units.distance === "mm" ? 600 : 20],
                nticks: 50,
              },
              yaxis: { nticks: 25 },
            }}
          />
        </div>
      )}
      {extrapolated.length > 0 && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"
        >
          <strong>Extrapolated lift estimates:</strong> {extrapolated.length} result{extrapolated.length === 1 ? "" : "s"} fall outside the entered Gauss measurement range. These values come from extending the fitted model, not from measurements at those distances. Take additional measurements through the predicted lift range before relying on them for engineering decisions.
        </div>
      )}
      <h3>Estimated Nut Lift Distance</h3>
      <div className="mb-[21px] grid grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-3 max-[560px]:grid-cols-2 max-[380px]:grid-cols-1">
        {profiles.map((p, i) => (
          <div
            className="rounded-xl border border-line bg-white shadow-sm border-t-[3px] p-[18px] [&>span]:text-[11px] [&>span]:font-semibold [&>span]:text-muted [&_strong]:mt-3 [&_strong]:block [&_strong]:text-[26px] [&_strong]:font-semibold [&_small]:text-xs [&_small]:font-normal [&_small]:text-muted [&_p]:mb-0 [&_p]:mt-2 [&_p]:text-[11px]"
            key={i}
            style={{ borderTopColor: colors[i] }}
          >
            <span>{p.name}</span>
            <strong>
              {p.lift.Nut === null
                ? "—"
                : (p.lift.Nut * units.factor).toFixed(1)}{" "}
              <small>{units.distance}</small>
            </strong>
            <p>
              {i && baseline && p.lift.Nut !== null
                ? `${((p.lift.Nut / baseline - 1) * 100).toFixed(1)}% vs first magnet`
                : i === 0
                  ? "Comparison baseline"
                  : "No comparable lift value"}
            </p>
            {isExtrapolatedLift(p, p.lift.Nut) && (
              <p className="font-semibold text-amber-800">Outside measured range</p>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-line bg-white shadow-sm max-w-full overflow-x-auto">
        <div className="flex items-center justify-between gap-3 px-[22px] py-5 [&_h3]:m-0 [&_input]:max-w-[280px]">
          <h3>Static Lift Distances</h3>
        </div>
        <table className="w-full border-collapse text-left text-xs [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-line [&_th]:bg-slate-100 [&_th]:px-[17px] [&_th]:py-[13px] [&_th]:text-[11px] [&_th]:font-semibold [&_th]:text-muted [&_td]:whitespace-nowrap [&_td]:border-b [&_td]:border-line [&_td]:px-[17px] [&_td]:py-[13px] [&_td]:text-ink [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-slate-100">
          <thead>
            <tr>
              <th>Object</th>
              {profiles.map((p, i) => (
                <th key={i}>
                  {p.name} ({units.distance})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(profiles[0].lift).map((object) => (
              <tr key={object}>
                <td>{object}</td>
                {profiles.map((p, i) => (
                  <td key={i}>
                    {p.lift[object] === null
                      ? "Not reached"
                      : (p.lift[object]! * units.factor).toFixed(1)}
                    {isExtrapolatedLift(p, p.lift[object]) && (
                      <span className="ml-2 whitespace-nowrap font-semibold text-amber-800" title={`Outside measured distance range: ${measuredDistanceRange(p)?.min}–${measuredDistanceRange(p)?.max} mm`}>
                        (extrapolated)
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs leading-[1.7] text-muted">
        Static lift in air, measured to the object centre. No allowance for
        burden. Bar ratios indicate length relative to diameter. Results are
        estimates, not customer performance guarantees. “Not reached” means the
        threshold was not met within the calculated range.
      </p>
    </>
  );
}
