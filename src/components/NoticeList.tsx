import { AlertCircle } from "lucide-react";

interface NoticeListProps {
  error: string | null;
  supported: boolean;
  onClearError: () => void;
}

export function NoticeList({ error, supported, onClearError }: NoticeListProps) {
  return (
    <>
      {error && (
        <div className="notice error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" onClick={onClearError}>
            Dismiss
          </button>
        </div>
      )}

      {!supported && (
        <div className="notice warning">
          <AlertCircle size={18} />
          <span>WebHID is available in Chromium-based browsers on secure origins.</span>
        </div>
      )}
    </>
  );
}
