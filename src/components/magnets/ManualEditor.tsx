import type { Units } from "../../lib/units";
import { Field, Num } from "../ui/Fields";

import type { ManualInput } from "../../lib/manual";

export function ManualEditor({
  value,
  onChange,
  units,
}: {
  value: ManualInput;
  onChange: (value: ManualInput) => void;
  units: Units;
}) {
  return (
    <>
      <Field label="Profile name">
        <input
          value={value.name}
          maxLength={120}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </Field>
      <div className="mt-[17px] mb-[6px]">
        <div className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_26px] items-center gap-[7px] [&_input]:min-h-[38px] [&_input]:px-2 [&_input]:py-[7px] [&_input]:text-xs mb-[7px] text-[11px] font-semibold text-muted">
          <span>Distance ({units.distance})</span>
          <span>Field (Gauss)</span>
          <span />
        </div>
        {value.points.map((point, i) => (
          <div
            className="mb-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_26px] items-center gap-[7px] [&_input]:min-h-[38px] [&_input]:px-2 [&_input]:py-[7px] [&_input]:text-xs"
            key={i}
          >
            <input
              aria-label={`Distance row ${i + 1}`}
              type="number"
              min={0}
              step="any"
              value={Number((point[0] * units.factor).toFixed(4))}
              onChange={(e) =>
                onChange({
                  ...value,
                  points: value.points.map((p, j) =>
                    j === i ? [Number(e.target.value) / units.factor, p[1]] : p,
                  ),
                })
              }
            />
            <input
              aria-label={`Gauss row ${i + 1}`}
              type="number"
              min={0}
              step="any"
              value={point[1]}
              onChange={(e) =>
                onChange({
                  ...value,
                  points: value.points.map((p, j) =>
                    j === i ? [p[0], Number(e.target.value)] : p,
                  ),
                })
              }
            />
            <button
              title="Remove row"
              aria-label={`Remove row ${i + 1}`}
              className="h-[33px] w-[26px] rounded-md text-xl text-muted hover:bg-red-600/10 hover:text-red-600"
              onClick={() =>
                onChange({
                  ...value,
                  points: value.points.filter((_, j) => j !== i),
                })
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        className="inline-flex items-center gap-[5px] px-[3px] py-2 text-xs font-semibold text-eriez-hover hover:underline"
        onClick={() =>
          onChange({
            ...value,
            points: [
              ...value.points,
              [
                value.points.length
                  ? value.points[value.points.length - 1][0] + 100
                  : 0,
                0,
              ],
            ],
          })
        }
      >
        + Add data row
      </button>
      <Field label="Field curve">
        <select
          value={value.bestFit ? "best" : "exp"}
          onChange={(e) =>
            onChange({ ...value, bestFit: e.target.value === "best" })
          }
        >
          <option value="exp">Exponential trend</option>
          <option value="best">Best fit to data (connected points)</option>
        </select>
      </Field>
      <Num
        label={`Hide curve below (${units.distance})`}
        value={Number((value.exclude * units.factor).toFixed(4))}
        onChange={(v) => onChange({ ...value, exclude: v / units.factor })}
      />
      <p className="text-xs leading-[1.7] text-muted">
        Enter at least four measured points. Force and lift always use the
        exponential fit. Hiding the near-surface curve does not change the fit
        or lift calculation.
      </p>
    </>
  );
}