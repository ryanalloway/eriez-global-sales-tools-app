import { useState } from "react";
import { api } from "../api/client";
import type { Profile } from "../api/client";
import { useAppContext } from "../app/AppContext";
import MagnetPicker from "../components/magnets/MagnetPicker";
import { ManualEditor } from "../components/magnets/ManualEditor";
import { newManual } from "../lib/manual";
import Results from "../components/magnets/Results";
import { ErrorBox, Num } from "../components/ui/Fields";

export default function ProfilesPage() {
  const { units, datasets } = useAppContext();

  const [items, setItems] = useState([{ dataset: "", offset: 0 }]);
  const [include, setInclude] = useState(false);
  const [manual, setManual] = useState(newManual(5));
  const [results, setResults] = useState<Profile[]>([]);
  const [best, setBest] = useState<boolean[]>([]);
  const [exclude, setExclude] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate() {
    setError("");
    setBusy(true);
    setResults([]);
    try {
      const requests = items
        .filter((i) => i.dataset)
        .map((i) =>
          api<Profile>("profile", {
            ...i,
            name:
              datasets
                .find((d) => String(d.id) === i.dataset)
                ?.file.replace(".csv", "") + ` · ${i.offset} mm offset`,
          }),
        );
      if (include) requests.push(api<Profile>("manual", manual));
      if (!requests.length)
        throw new Error(
          "Select at least one magnet or enable a manual comparison.",
        );
      setResults(await Promise.all(requests));
      setBest(
        requests.map((_, i) =>
          include && i === requests.length - 1 ? manual.bestFit : false,
        ),
      );
      setExclude(
        requests.map((_, i) =>
          include && i === requests.length - 1 ? manual.exclude : 0,
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
        <div className="flex items-center justify-between gap-3 px-[22px] py-5 [&_h3]:m-0 [&_input]:max-w-[280px]">
          <h3>Compare magnets</h3>
          <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full border border-line bg-slate-100 px-[9px] py-[5px] text-[11px] font-semibold text-muted">
            {items.length} / 4
          </span>
        </div>
        <p className="mt-0 mb-[22px] text-xs leading-[1.65] text-muted">
          Select a magnet and its offset from the centreline. Add more magnets
          to compare their field strength and estimated static lift.
        </p>
        {!datasets.length && (
          <p className="mb-[18px] rounded-lg border border-amber-600/25 bg-amber-600/7 px-4 py-[14px] text-xs leading-relaxed text-amber-700">
            Magnet models are unavailable right now. You can still enter
            measured readings for a manual comparison, or try again later.
          </p>
        )}
        {items.map((item, i) => (
          <div
            className="border-t border-line py-[14px] pb-3 first:border-t-0 [&_h4]:my-0 [&_h4]:mb-[14px]"
            key={i}
          >
            <div className="flex items-center justify-between gap-2">
              <h4>Magnet {i + 1}</h4>
              {i > 0 && (
                <button
                  className="inline-flex items-center gap-[5px] px-[3px] py-2 text-xs font-semibold text-eriez-hover hover:underline"
                  onClick={() => setItems(items.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              )}
            </div>
            <MagnetPicker
              datasets={datasets}
              value={item.dataset}
              onChange={(dataset) =>
                setItems(items.map((v, j) => (j === i ? { ...v, dataset } : v)))
              }
            />
            <Num
              label={`Offset from centreline (${units.distance})`}
              value={Number((item.offset * units.factor).toFixed(4))}
              onChange={(v) =>
                setItems(
                  items.map((p, j) =>
                    i === j
                      ? { ...p, offset: Math.round(v / units.factor / 5) * 5 }
                      : p,
                  ),
                )
              }
              step={5 * units.factor}
            />
          </div>
        ))}
        {items.length < 4 && (
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] mt-[13px] w-full"
            onClick={() => setItems([...items, { dataset: "", offset: 0 }])}
          >
            + Add magnet
          </button>
        )}
        <label className="my-[21px] flex items-center gap-[11px] text-xs text-ink">
          <input
            type="checkbox"
            checked={include}
            onChange={(e) => setInclude(e.target.checked)}
          />
          Include a user / competitor profile
        </label>
        {include && (
          <ManualEditor value={manual} onChange={setManual} units={units} />
        )}
        <button
          disabled={busy}
          aria-busy={busy}
          className="inline-flex min-h-10 items-center justify-center gap-[9px] rounded-lg border border-eriez bg-eriez px-[18px] py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] mt-[13px] w-full"
          onClick={calculate}
        >
          {busy ? "Calculating…" : "Compare Profiles →"}
        </button>
        <ErrorBox message={error} />
        <p className="text-xs leading-[1.7] text-muted">
          Cold: ambient 20°C. Hot: stabilised operation, typically 12–36 hours.
          Offset snaps to the 5 mm calculation grid.
        </p>
      </section>
      <section>
        <Results
          profiles={results}
          units={units}
          bestFit={best}
          exclusions={exclude}
        />
      </section>
    </div>
  );
}