import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { api } from "../../api/client";
import type { Dataset } from "../../api/client";
import { makeUnits } from "../../lib/units";
import { tools, descriptions } from "../../lib/navigation";
import { ToolIcon } from "./ToolIcon";
import { AppContext } from "../../app/AppContext";
import AnalysisUnitsBar from "./AnalysisUnitsBar";

export default function AppLayout() {
  const [distance, setDistance] = useState("mm");
  const [force, setForce] = useState("G²/mm");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [menu, setMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const selected = tools.find((tool) => tool.path === location.pathname) ?? tools[0];
  const showAnalysisUnits = !["home", "help"].includes(selected.id);

  useEffect(() => {
    let active = true;
    api<Dataset[]>("magnets")
      .then((available) => {
        if (active) {
          setDatasets(available);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        console.error("Unable to load Eriez magnet data", reason);
        if (active) {
          setError(
            "Magnet data could not be loaded. Try again, or contact your support team if the problem continues.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [version]);
  
  return (
    <AppContext.Provider
      value={{ units: makeUnits(distance, force), datasets }}
    >
      <div className="flex min-h-screen bg-canvas text-ink">
        {menu && (
          <button
            className="fixed inset-0 z-[24] bg-slate-900/45 min-[761px]:hidden"
            aria-label="Close navigation"
            onClick={() => setMenu(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-[25] flex w-[252px] shrink-0 -translate-x-full flex-col border-r border-line bg-white px-[15px] pt-[27px] pb-[22px] shadow-[10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-200 min-[761px]:translate-x-0 min-[761px]:shadow-none min-[761px]:max-[1200px]:w-[220px] ${menu ? "max-[760px]:translate-x-0" : ""}`}
          aria-label="Primary navigation"
        >
          <div className="px-[13px] pt-1 pb-[31px] [&_img]:block [&_img]:h-auto [&_img]:w-[117px] [&_span]:text-[10px] [&_span]:font-bold [&_span]:tracking-[1.15px] [&_span]:text-muted">
            <img src="/ERIEZ_orange_logo.png" alt="Eriez" />
            <div className="mt-5 mb-[14px] h-px bg-line" />
            <span>GLOBAL SALES TOOLS</span>
          </div>
          <p className="mx-3 mb-3 text-[10px] font-bold tracking-[1.15px] text-slate-400">
            NAVIGATION
          </p>
          <nav aria-label="Analysis tools" className="grid gap-1">
            {tools.map((tool) => (
              <NavLink
                key={tool.id}
                to={tool.path}
                end={tool.path === "/"}
                onClick={() => setMenu(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-slate-100 ${isActive ? "border-eriez bg-ember font-semibold text-eriez-hover" : "border-transparent text-muted hover:text-ink"}`
                }
              >
                <span className="grid size-5 shrink-0 place-items-center [&_svg]:size-5">
                  <ToolIcon id={tool.id} />
                </span>
                <span>{tool.title}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col bg-canvas min-[761px]:ml-[252px] min-[761px]:max-[1200px]:ml-[220px]">
          <header className="flex min-h-[70px] items-center justify-between gap-5 border-b border-line bg-white px-8 py-2.5 max-[1460px]:px-6 max-[1040px]:justify-end max-[760px]:min-h-16 max-[760px]:px-4 max-[760px]:py-[9px]">
            <button
              className="mr-auto hidden items-center justify-center rounded-lg border border-line p-2 max-[760px]:inline-flex"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <MenuRoundedIcon fontSize="small" />
            </button>
            <div className="flex items-center gap-[11px] whitespace-nowrap text-xs text-muted max-[1040px]:hidden">
              <span>Global Sales Tools</span>
              <span className="text-slate-300">/</span>
              <strong>{selected.title}</strong>
            </div>
          </header>
          <div className="mx-auto flex w-full max-w-[1660px] flex-1 flex-col px-9 pt-8 pb-2 max-[1460px]:px-[25px] max-[1460px]:pt-7 max-[760px]:px-4 max-[760px]:pt-[23px] max-[760px]:pb-1.5">
            <div className="mb-[25px] flex items-center justify-between gap-5 max-[760px]:mb-5 [&_p]:m-0 [&_p]:text-[13px] [&_h1]:max-[560px]:text-[23px]">
              <div>
                <h1>
                  {selected.id !== "home"
                    ? selected.title
                    : null}
                </h1>
                <p>{selected.id !== "home" ? descriptions[selected.id] : null}</p>
              </div>
            </div>
            {error && (
              <div
                className="my-[14px] rounded-lg border border-red-600/25 bg-red-600/7 px-[15px] py-[13px] text-xs leading-relaxed text-red-600 flex items-center justify-between gap-[18px] max-[560px]:flex-col max-[560px]:items-start"
                role="alert"
              >
                {error}
                <button
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
                  onClick={() => setVersion((v) => v + 1)}
                >
                  Retry connection
                </button>
              </div>
            )}
            {showAnalysisUnits && (
              <AnalysisUnitsBar
                distance={distance}
                onDistanceChange={setDistance}
                force={force}
                onForceChange={setForce}
              />
            )}
            <Suspense
              fallback={
                <div className="flex min-h-[335px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-9 text-center [&_h3]:my-1.5 [&_p]:m-0 [&_p]:max-w-[410px] [&_p]:text-[13px]">
                  Loading visualization tools…
                </div>
              }
            >
              <Outlet />
            </Suspense>
            <footer className="mt-auto pt-9">
              <section
                className="flex items-center justify-between gap-[25px] rounded-xl border border-line bg-white px-7 py-6 shadow-sm max-[560px]:flex-col max-[560px]:items-stretch max-[560px]:gap-[18px] max-[560px]:px-[19px] max-[560px]:py-[21px]"
                aria-labelledby="footer-support-title"
              >
                <div className="min-w-0 [&_h2]:mb-[5px] [&_h2]:text-[15px] [&_p]:m-0 [&_p]:max-w-[670px] [&_p]:text-[13px]">
                  <h2 id="footer-support-title">Support &amp; Help Desk</h2>
                  <p>
                    Need help with Global Sales Tools or have a question about
                    an analysis? Browse the help guide or contact the Eriez
                    support team.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5 max-[560px]:flex-wrap [&_a]:min-h-[42px] [&_button]:min-h-[42px] [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap max-[560px]:[&_a]:flex-1 max-[560px]:[&_button]:flex-1">
                  <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-[14px] py-[9px] text-xs font-semibold text-ink no-underline transition-colors hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
                    onClick={() => {
                      navigate("/help");
                      window.scrollTo(0, 0);
                    }}
                  >
                    Open Help &amp; FAQs
                  </button>
                  <a
                    className="inline-flex min-h-10 items-center justify-center gap-[9px] rounded-lg border border-eriez bg-eriez px-[18px] py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px]"
                    href="https://helpdesk.eriez.net/Ticket/New/11?categoryId=1316"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Help Desk{" "}
                    <ArrowForwardRoundedIcon fontSize="small" />
                  </a>
                </div>
              </section>
              <div className="flex items-center justify-between gap-[18px] px-[3px] pt-[17px] pb-5 text-[11px] text-slate-400 max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-[5px]">
                <span>
                  © {new Date().getFullYear()} Eriez · Global Sales Tools
                </span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}
