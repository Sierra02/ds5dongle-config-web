import { CONTROLLER_MODE_OPTIONS, ControllerMode } from "../../protocol/config";

interface ControllerModeControlProps {
  value: ControllerMode;
  onChange: (value: ControllerMode) => void;
}

export function ControllerModeControl({ value, onChange }: ControllerModeControlProps) {
  return (
    <div className="control-row">
      <strong>Controller mode</strong>
      <div className="segmented-control two-options" role="group" aria-label="Controller mode">
        {CONTROLLER_MODE_OPTIONS.map((option) => (
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
