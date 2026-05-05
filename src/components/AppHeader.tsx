import { CheckCircle2, Usb } from "lucide-react";

interface AppHeaderProps {
  isConnected: boolean;
  statusText: string;
}

export function AppHeader({ isConnected, statusText }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <div className="eyebrow">WebHID</div>
        <h1>DS5 Bridge Config</h1>
      </div>
      <div className={`status-pill ${isConnected ? "connected" : ""}`}>
        {isConnected ? <CheckCircle2 size={16} /> : <Usb size={16} />}
        <span>{statusText}</span>
      </div>
    </header>
  );
}
