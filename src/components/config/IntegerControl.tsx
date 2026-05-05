import { ChangeEvent } from "react";
import { ConfigValidationIssue } from "../../protocol/config";

interface IntegerControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  issue?: ConfigValidationIssue;
  onChange: (value: number) => void;
}

export function IntegerControl({ label, value, min, max, issue, onChange }: IntegerControlProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.currentTarget.value);
    if (Number.isFinite(next)) {
      onChange(Math.round(next));
    }
  };

  return (
    <label className={`control-row ${issue ? "invalid" : ""}`}>
      <span>
        <strong>{label}</strong>
        {issue && <small>{issue.message}</small>}
      </span>
      <div className="range-inputs">
        <input type="range" min={min} max={max} step={1} value={value} onChange={handleChange} />
        <input type="number" min={min} max={max} step={1} value={value} onChange={handleChange} />
      </div>
    </label>
  );
}
