import { POLLING_RATE_OPTIONS, PollingRateMode } from "../../protocol/config";

interface PollingRateControlProps {
  value: PollingRateMode;
  onChange: (value: PollingRateMode) => void;
}

export function PollingRateControl({ value, onChange }: PollingRateControlProps) {
  return (
    <div className="control-row">
      <strong>Polling rate mode</strong>
      <div className="segmented-control" role="group" aria-label="Polling rate mode">
        {POLLING_RATE_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.value}
            className={option.value === value ? "selected" : ""}
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
