import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ConfigVersionWarning } from "../protocol/ds5BridgeHid";

interface NoticeListProps {
  supported: boolean;
  configVersionWarning: ConfigVersionWarning | null;
}

export function NoticeList({ supported, configVersionWarning }: NoticeListProps) {
  const { t } = useTranslation();

  return (
    <>
      {!supported && (
        <div className="notice warning">
          <AlertCircle size={18} />
          <span>{t("notice.webHidUnsupported")}</span>
        </div>
      )}
      {configVersionWarning && (
        <div className="notice warning">
          <AlertCircle size={18} />
          <span>
            {t("notice.configVersionMismatch", {
              actual: configVersionWarning.actual,
              expected: configVersionWarning.expected,
            })}
          </span>
        </div>
      )}
    </>
  );
}
