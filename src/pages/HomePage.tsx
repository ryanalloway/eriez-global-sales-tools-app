import { useNavigate } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { tools } from "../lib/navigation";
import { ToolIcon } from "../components/layout/ToolIcon";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <section
        className="grid grid-cols-1 items-stretch overflow-hidden rounded-xl border border-line bg-white shadow-sm"
        aria-labelledby="welcome-title"
      >
        <div className="px-9 py-[34px] max-[760px]:px-6 max-[760px]:py-[25px] max-[380px]:px-[18px] max-[380px]:py-[23px] [&_h2]:my-[11px] [&_h2]:text-[clamp(22px,2.2vw,29px)] [&_h2]:tracking-tight [&_p]:mt-0 [&_p]:mb-[22px] [&_p]:max-w-[605px] [&_p]:text-[13px]">
          <h2 id="welcome-title">Magnetic Performance Analysis</h2>
          <p>
            Analyze measured field readings, compare Eriez magnet models, and
            review estimated static lift.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 max-[560px]:[&_button]:w-full">
            <button
              className="inline-flex min-h-10 items-center justify-center gap-[9px] rounded-lg border border-eriez bg-eriez px-[18px] py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
              onClick={() => navigate("/magnet-profiles")}
            >
              Compare magnet profiles{" "}
              <ArrowForwardRoundedIcon fontSize="small" />
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
              onClick={() => navigate("/gauss-force")}
            >
              Use measured data
            </button>
          </div>
        </div>
      </section>
      <div className="my-7 mb-[15px] flex items-center justify-between gap-4 [&_h2]:mb-[3px] [&_h2]:text-lg [&_p]:m-0 [&_p]:text-xs">
        <div>
          <h2>Analysis tools</h2>
          <p>Select a tool to get started.</p>
        </div>
        <span className="whitespace-nowrap text-xs text-slate-400 max-[560px]:hidden">
          3 available tools
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[1041px]:grid-cols-3 max-[1200px]:gap-3">
        {[
          {
            id: "manual",
            label: "MEASURED DATA",
            title: "Gauss & Force Plotter",
            text: "Enter measured Gauss readings to compare field strength, force index, and estimated lift distances.",
          },
          {
            id: "profiles",
            label: "MODEL COMPARISON",
            title: "Magnet Profiles",
            text: "Compare Eriez magnetic field profiles and estimated static lift at selected offsets.",
          },
          {
            id: "contours",
            label: "FIELD VISUALIZATION",
            title: "Contour Plots",
            text: "See magnetic-field coverage and lift thresholds beneath one or two magnets.",
          },
        ].map((t) => (
          <button
            className="flex min-w-0 w-full flex-col items-stretch rounded-xl border border-line bg-white px-[22px] pt-[21px] pb-[18px] text-left shadow-sm transition-[border-color,box-shadow] hover:border-eriez/50 hover:shadow-md max-[1200px]:p-[18px] max-[560px]:p-[19px] [&_h3]:my-2 [&_h3]:text-base [&_p]:mb-[21px] [&_p]:mt-0 [&_p]:flex-1 [&_p]:text-xs [&_p]:leading-relaxed"
            key={t.id}
            onClick={() =>
              navigate(tools.find((tool) => tool.id === t.id)!.path)
            }
          >
            <span className="mb-[18px] flex items-start justify-between">
              <span className="grid size-[41px] place-items-center rounded-[9px] bg-ember text-eriez">
                <ToolIcon id={t.id} />
              </span>
              <ArrowForwardRoundedIcon
                className="text-slate-400"
                fontSize="small"
              />
            </span>
            <span className="inline-block text-[10px] font-bold tracking-[0.9px] text-muted">
              {t.label}
            </span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
            <span className="flex items-center justify-between border-t border-line pt-[13px] text-xs font-semibold text-eriez-hover [&_svg]:size-[17px]">
              Open tool <ArrowForwardRoundedIcon fontSize="small" />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}