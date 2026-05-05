import { CheckCircle2, Usb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AppHeaderProps {
  isConnected: boolean;
  statusText: string;
}

export function AppHeader({ isConnected, statusText }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div>
        <div className="eyebrow">{t("app.eyebrow")}</div>
        <h1>{t("app.title")}</h1>
      </div>
      <div className="header-actions">
        <LanguageSwitcher />
        <div className={`status-pill ${isConnected ? "connected" : ""}`}>
          {isConnected ? <CheckCircle2 size={16} /> : <Usb size={16} />}
          <span>{statusText}</span>
        </div>
      </div>
    </header>
  );
}
