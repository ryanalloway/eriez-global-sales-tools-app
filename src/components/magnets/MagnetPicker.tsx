import { useState } from "react";
import type { Dataset } from "../../api/client";
import { Field } from "../ui/Fields";

export default function MagnetPicker({
  datasets,
  value,
  onChange,
}: {
  datasets: Dataset[];
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = datasets.find((d) => String(d.id) === value);
  
  const [range, setRange] = useState("");
  const [model, setModel] = useState("");

  const effectiveRange = selected?.range ?? range;
  const effectiveModel = selected?.model ?? model;

  const models = [
    ...new Set(
      datasets.filter((d) => d.range === effectiveRange).map((d) => d.model),
    ),
  ];

  return (
    <div className="w-full">
      <Field label="Product range">
        <select
          value={effectiveRange}
          onChange={(e) => {
            setRange(e.target.value);
            setModel("");
            onChange("");
          }}
        >
          <option value="">Choose range</option>
          {[...new Set(datasets.map((d) => d.range))].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-[11px] max-[380px]:grid-cols-1">
        <Field label="Model">
          <select
            value={effectiveModel}
            onChange={(e) => {
              setModel(e.target.value);
              onChange("");
            }}
          >
            <option value="">Choose model</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Temperature">
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Choose</option>
            {datasets
              .filter(
                (d) => d.range === effectiveRange && d.model === effectiveModel,
              )
              .map((d) => (
                <option value={String(d.id)} key={d.id}>
                  {d.temperature.charAt(0).toUpperCase() +
                    d.temperature.slice(1)}{" "}
                </option>
              ))}
          </select>
        </Field>
      </div>
    </div>
  );
}
