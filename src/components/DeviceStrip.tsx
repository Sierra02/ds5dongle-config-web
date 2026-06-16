import { Power, Usb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SignalStatus } from "@/protocol/ds5BridgeHid";

interface DeviceStripProps {
  authorizedDevices: HIDDevice[];
  client: unknown | null;
  deviceLabel: string;
  firmwareVersion: string | null;
  signalStrengthRssi: number | null;
  signalStatus: SignalStatus;
  isBusy: boolean;
  supported: boolean;
  onConnect: () => void;
  onConnectAuthorized: (device: HIDDevice) => void;
}

export function DeviceStrip({
  authorizedDevices,
  client,
  deviceLabel,
  firmwareVersion,
  signalStrengthRssi,
  signalStatus,
  isBusy,
  supported,
  onConnect,
  onConnectAuthorized,
}: DeviceStripProps) {
  const { t } = useTranslation();
  const connected = Boolean(client);

  return (
    <Card className="device-strip-card">
      <CardContent className="device-strip">
        <div className="device-main">
          <div className="device-icon">
            <Usb size={22} />
          </div>
          <div>
            <div className="label">{t("device.label")}</div>
            <strong>{deviceLabel}</strong>
            {connected && (
              <div className="device-metadata">
                <span className="device-metadata-item">
                  <span>{t("device.firmwareVersion")}</span>
                  <code>{firmwareVersion || t("device.firmwareUnknown")}</code>
                </span>
                <span className="device-metadata-item" title={t("device.signalStrengthTitle")}>
                  <span>{t("device.signalStrength")}</span>
                  <code>{formatSignalStrength(signalStrengthRssi, t)}</code>
                </span>
                <span className="device-metadata-item" title={t("device.audioActivityTitle")}>
                  <span>{t("device.audioActivity")}</span>
                  <code>{formatAudioActivity(signalStatus, t)}</code>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="device-actions">
          {authorizedDevices.length > 0 && !connected && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onConnectAuthorized(authorizedDevices[0])}
              disabled={isBusy}
              title={t("device.openTitle")}
            >
              <Power size={17} />
              {t("device.open")}
            </Button>
          )}
          <Button
            type="button"
            onClick={onConnect}
            disabled={!supported || isBusy}
            title={t("device.connectTitle")}
          >
            <Usb size={17} />
            {t("device.connect")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatSignalStrength(
  signalStrengthRssi: number | null,
  t: (key: string) => string,
): string {
  return signalStrengthRssi === null ? t("device.signalStrengthUnknown") : `${signalStrengthRssi} dBm`;
}

function formatAudioActivity(signalStatus: SignalStatus, t: (key: string) => string): string {
  if (signalStatus.micActive === null || signalStatus.speakerActive === null) {
    return t("device.audioActivityUnknown");
  }

  return [
    `${t("device.micLabel")} ${formatActiveState(signalStatus.micActive, t)}`,
    `${t("device.speakerLabel")} ${formatActiveState(signalStatus.speakerActive, t)}`,
  ].join(" · ");
}

function formatActiveState(active: boolean, t: (key: string) => string): string {
  return active ? t("device.active") : t("device.inactive");
}
