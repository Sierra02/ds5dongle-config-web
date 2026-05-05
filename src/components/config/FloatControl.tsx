import { ChangeEvent } from "react";
import { ConfigValidationIssue } from "../../protocol/config";

interface FloatControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  issue?: ConfigValidationIssue;
  onChange: (value: number) => void;
}

export function FloatControl({ label, value, min, max, step, issue, onChange }: FloatControlProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.currentTarget.value);
    if (Number.isFinite(next)) {
      onChange(next);
    }
  };

  return (
    <label className={`control-row ${issue ? "invalid" : ""}`}>
      <span>
        <strong>{label}</strong>
        {issue && <small>{issue.message}</small>}
      </span>
      <div className="range-inputs">
        <input type="range" min={min} max={max} step={step} value={value} onChange={handleChange} />
        <input type="number" min={min} max={max} step={step} value={value.toFixed(2)} onChange={handleChange} />
      </div>
    </label>
  );
}
