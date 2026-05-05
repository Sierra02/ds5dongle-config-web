interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleControl({ label, value, onChange }: ToggleControlProps) {
  return (
    <div className="control-row toggle-row">
      <strong>{label}</strong>
      <button
        type="button"
        className={`switch ${value ? "on" : ""}`}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        title={value ? "Enabled" : "Disabled"}
      >
        <span />
      </button>
    </div>
  );
}
