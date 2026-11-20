import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { forceUnits } from "../../lib/units";
import { Field } from "../ui/Fields";

type Props = {
  distance: string;
  onDistanceChange: (value: string) => void;
  force: string;
  onForceChange: (value: string) => void;
};

export default function AnalysisUnitsBar({
  distance,
  onDistanceChange,
  force,
  onForceChange,
}: Props) {
  return (
    <section
      className="mb-[22px] flex items-center justify-between gap-5 rounded-xl border border-line bg-white px-5 py-4 shadow-sm max-[980px]:flex-col max-[980px]:items-stretch max-[980px]:gap-[13px] max-[560px]:p-[17px]"
      aria-label="Analysis units"
    >
      <div className="flex min-w-0 items-center gap-3 [&_h2]:m-0 [&_h2]:text-sm [&_p]:m-0 [&_p]:text-xs [&_p]:leading-normal">
        <span
          className="grid size-[38px] shrink-0 place-items-center rounded-lg bg-ember text-eriez-hover"
          aria-hidden="true"
        >
          <TuneRoundedIcon fontSize="small" />
        </span>
        <div>
          <h2>Analysis Units</h2>
          <p>Set the units used in plots, results, and data exports.</p>
        </div>
      </div>
      <div className="flex items-end gap-3 max-[980px]:w-full max-[560px]:flex-col max-[560px]:items-stretch [&_label]:mb-0 [&_label]:min-w-[155px] max-[980px]:[&_label]:min-w-0 max-[980px]:[&_label]:flex-1 max-[560px]:[&_label]:w-full [&_select]:min-h-[38px] [&_select]:text-xs">
        <Field label="Distance unit">
          <select
            aria-label="Distance unit"
            value={distance}
            onChange={(e) => onDistanceChange(e.target.value)}
          >
            <option value="mm">Millimeters (mm)</option>
            <option value="inches">Inches (in)</option>
          </select>
        </Field>
        <Field label="Force index unit">
          <select
            aria-label="Force index unit"
            value={force}
            onChange={(e) => onForceChange(e.target.value)}
          >
            {Object.keys(forceUnits).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </section>
  );
}