import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDs5BridgeResult } from "../hooks/useDs5Bridge";
import { fieldIssue } from "../protocol/config";
import { ControllerModeControl } from "./config/ControllerModeControl";
import { FloatControl } from "./config/FloatControl";
import { IntegerControl } from "./config/IntegerControl";
import { PollingRateControl } from "./config/PollingRateControl";
import { ToggleControl } from "./config/ToggleControl";

interface ConfigPanelProps {
  bridge: UseDs5BridgeResult;
}

export function ConfigPanel({ bridge }: ConfigPanelProps) {
  const { t } = useTranslation();

  return (
    <Card className="panel config-panel">
      <CardHeader className="p-0">
        <CardTitle className="panel-title">
          <SlidersHorizontal size={18} />
          <h2>{t("config.title")}</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="control-stack p-0">
        <FloatControl
          label={t("config.hapticsGain")}
          value={bridge.draft.hapticsGain}
          min={1}
          max={2}
          step={0.05}
          issue={fieldIssue(bridge.issues, "hapticsGain")}
          onChange={(value) => bridge.setDraftField("hapticsGain", value)}
        />
        <FloatControl
          label={t("config.speakerVolume")}
          value={bridge.draft.speakerVolume}
          min={1}
          max={2}
          step={0.05}
          issue={fieldIssue(bridge.issues, "speakerVolume")}
          onChange={(value) => bridge.setDraftField("speakerVolume", value)}
        />
        <IntegerControl
          label={`${t("config.inactiveTime")} (${t("config.inactiveTimeUnit")})`}
          value={bridge.draft.inactiveTime}
          min={10}
          max={60}
          issue={fieldIssue(bridge.issues, "inactiveTime")}
          onChange={(value) => bridge.setDraftField("inactiveTime", value)}
        />
        <ToggleControl
          label={t("config.disableInactiveDisconnect")}
          value={bridge.draft.disableInactiveDisconnect}
          onChange={(value) => bridge.setDraftField("disableInactiveDisconnect", value)}
        />
        <ToggleControl
          label={t("config.disablePicoLed")}
          value={bridge.draft.disablePicoLed}
          onChange={(value) => bridge.setDraftField("disablePicoLed", value)}
        />
        <PollingRateControl
          value={bridge.draft.pollingRateMode}
          onChange={(value) => bridge.setDraftField("pollingRateMode", value)}
        />
        <IntegerControl
          label={t("config.hapticsBufferLength")}
          value={bridge.draft.hapticsBufferLength}
          min={16}
          max={255}
          issue={fieldIssue(bridge.issues, "hapticsBufferLength")}
          onChange={(value) => bridge.setDraftField("hapticsBufferLength", value)}
        />
        <ControllerModeControl
          value={bridge.draft.controllerMode}
          onChange={(value) => bridge.setDraftField("controllerMode", value)}
        />
      </CardContent>
    </Card>
  );
}
