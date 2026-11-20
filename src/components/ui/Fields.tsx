import type { ReactNode } from "react";

export function ErrorBox({ message }: { message: string }) {
  return message ? (
    <div
      role="alert"
      className="my-[14px] rounded-lg border border-red-600/25 bg-red-600/7 px-[15px] py-[13px] text-xs leading-relaxed text-red-600"
    >
      {message}
    </div>
  ) : null;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-[17px] flex flex-col gap-[7px] [&>span]:text-[13px] [&>span]:font-medium [&>span]:text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Num({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = "any",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        required
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[335px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-9 text-center [&_h3]:my-1.5 [&_p]:m-0 [&_p]:max-w-[410px] [&_p]:text-[13px]">
      <div className="mb-[17px] grid size-12 place-items-center rounded-xl bg-ember text-[26px] text-eriez">
        ↗
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}