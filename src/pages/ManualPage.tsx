import { useState } from "react";
import { api } from "../api/client";
import type { Profile } from "../api/client";
import { useAppContext } from "../app/AppContext";
import { ManualEditor } from "../components/magnets/ManualEditor";
import { newManual, type ManualInput } from "../lib/manual";
import Results from "../components/magnets/Results";
import { ErrorBox } from "../components/ui/Fields";

export default function ManualPage() {
  const { units } = useAppContext();
  const [inputs, setInputs] = useState<ManualInput[]>([newManual(1)]);
  const [results, setResults] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<ManualInput[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate() {
    setBusy(true);
    setError("");
    setResults([]);
    try {
      setResults(
        await Promise.all(inputs.map((v) => api<Profile>("manual", v))),
      );
      setSettings(inputs);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }
  
  return (
    <div className="grid grid-cols-1 items-start gap-[22px] min-[1041px]:grid-cols-[minmax(265px,295px)_minmax(0,1fr)] min-[1201px]:grid-cols-[minmax(305px,340px)_minmax(0,1fr)] max-[1200px]:gap-4 [&>section]:min-w-0">
      <section>
        <div className="rounded-xl border border-line bg-white shadow-sm h-fit p-[23px] max-[1200px]:p-[18px] [&>.card-header]:pb-[11px] [&>.card-header]:pt-0 [&>.card-header]:px-0 [&>h3]:mb-2 [&>h4]:border-t [&>h4]:border-line [&>h4]:pt-4">
          <div className="flex items-center justify-between gap-3 px-[22px] py-5 [&_h3]:m-0 [&_input]:max-w-[280px]">
            <h3>Measured profiles</h3>
            <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full border border-line bg-slate-100 px-[9px] py-[5px] text-[11px] font-semibold text-muted">
              {inputs.length} / 2
            </span>
          </div>
          <p className="mt-0 mb-[22px] text-xs leading-[1.65] text-muted">
            Enter at least four measured distances and Gauss readings for each
            magnet, then select Calculate profiles to view your results.
          </p>
          {inputs.map((input, i) => (
            <div
              className="border-t border-line py-[14px] pb-3 first:border-t-0 [&_h4]:my-0 [&_h4]:mb-[14px]"
              key={i}
            >
              <div className="flex items-center justify-between gap-2">
                <h4>Magnet {i + 1}</h4>
                {i > 0 && (
                  <button
                    className="inline-flex items-center gap-[5px] px-[3px] py-2 text-xs font-semibold text-eriez-hover hover:underline"
                    onClick={() => setInputs(inputs.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                )}
              </div>
              <ManualEditor
                value={input}
                onChange={(v) =>
                  setInputs(inputs.map((p, j) => (i === j ? v : p)))
                }
                units={units}
              />
            </div>
          ))}
          {inputs.length < 2 && (
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] mt-[13px] w-full"
              onClick={() => setInputs([...inputs, newManual(2)])}
            >
              + Compare another magnet
            </button>
          )}
          <button
            className="inline-flex min-h-10 items-center justify-center gap-[9px] rounded-lg border border-eriez bg-eriez px-[18px] py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] mt-[13px] w-full"
            disabled={busy}
            aria-busy={busy}
            onClick={calculate}
          >
            {busy ? "Calculating…" : "Calculate Profiles →"}
          </button>
          <ErrorBox message={error} />
        </div>
      </section>
      <section>
        <Results
          profiles={results}
          units={units}
          combined
          bestFit={settings.map((v) => v.bestFit)}
          exclusions={settings.map((v) => v.exclude)}
        />
      </section>
    </div>
  );
}