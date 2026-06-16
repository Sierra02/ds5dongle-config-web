import { GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CONFIG_BODY_VERSION } from "@/protocol/config";

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="app-footer" aria-label="Page footer">
      <div className="footer-copy">
        <strong>{t("footer.title")}</strong>
        <span>{t("footer.description")}</span>
      </div>
      <div className="footer-actions">
        <span className="footer-version" title={t("footer.configVersionTitle")}>
          {t("footer.configVersion", { version: CONFIG_BODY_VERSION })}
        </span>
        <a className="footer-link" href="https://github.com/awalol/DS5Dongle" target="_blank" rel="noopener noreferrer">
          <GitBranch size={16} />
          github.com/awalol/DS5Dongle
        </a>
      </div>
    </footer>
  );
}
