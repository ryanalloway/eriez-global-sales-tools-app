type AuthStatusProps = {
  state: "connecting" | "error";
};

export default function AuthStatus({ state }: AuthStatusProps) {
  const failed = state === "error";

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-ink">
      <div className="w-full max-w-[460px]">
        <div className="mb-7 flex flex-col items-center gap-4">
          <img
            src="/ERIEZ_orange_logo.png"
            alt="Eriez"
            className="h-auto w-[128px]"
          />
          <span className="text-[10px] font-bold uppercase tracking-[1.3px] text-muted">
            Global Sales Tools
          </span>
        </div>

        <section
          role={failed ? "alert" : "status"}
          aria-live={failed ? "assertive" : "polite"}
          className="overflow-hidden rounded-xl border border-line bg-white shadow-sm"
        >
          <div className="px-7 pb-8 pt-9 text-center max-[420px]:px-5">
            <div
              className={`mx-auto mb-5 grid size-[72px] place-items-center rounded-2xl ${
                failed ? "bg-red-50" : "bg-ember"
              }`}
              aria-hidden="true"
            >
              {failed ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-9 text-red-600"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7.5v5.5M12 16.5h.01" />
                </svg>
              ) : (
                <span className="grid size-10 place-items-center rounded-full border border-eriez/15 bg-white/70">
                  <span className="size-7 rounded-full border-[3px] border-eriez/20 border-t-eriez motion-safe:animate-spin" />
                </span>
              )}
            </div>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.1px] text-eriez-hover">
              {failed ? "Sign-in interrupted" : "Secure sign-in"}
            </p>
            <h1 className="mb-2 mt-1.5 text-[22px] tracking-tight">
              {failed ? "Unable to connect" : "Connecting to Eriez"}
            </h1>
            <p className="mx-auto mb-0 max-w-[340px] text-[13px] leading-relaxed text-muted">
              {failed
                ? "We couldn't verify your Eriez Microsoft session. Please try again or contact the IT Help Desk."
                : "We're securely signing you in to Global Sales Tools with Microsoft Entra ID."}
            </p>
          </div>

          {failed ? (
            <div className="flex flex-col gap-2.5 border-t border-line bg-slate-50 px-6 py-5 min-[420px]:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-ink hover:border-slate-400 hover:bg-slate-100"
              >
                Try again
              </button>
              <a
                href="https://helpdesk.eriez.net/Ticket/New/11?categoryId=1316"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-eriez bg-eriez px-4 py-2.5 text-xs font-semibold text-white no-underline transition-colors hover:border-eriez-hover hover:bg-eriez-hover"
              >
                Contact Help Desk
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-t border-line bg-slate-50 px-7 py-[17px] text-left max-[420px]:px-5">
              <span
                className="relative flex size-2.5 shrink-0"
                aria-hidden="true"
              >
                <span className="absolute inset-0 rounded-full bg-eriez/40 motion-safe:animate-ping" />
                <span className="relative size-2.5 rounded-full bg-eriez" />
              </span>
              <div>
                <p className="m-0 text-xs font-semibold text-ink">
                  Verifying your Microsoft session
                </p>
                <p className="mb-0 mt-1 text-[11px] text-muted">
                  This usually takes only a moment.
                </p>
              </div>
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-[11px] text-slate-400">
          Eriez · Global Sales Tools
        </p>
      </div>
    </main>
  );
}