import { SlidersHorizontal } from "lucide-react";
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
  return (
    <section className="panel config-panel">
      <div className="panel-title">
        <SlidersHorizontal size={18} />
        <h2>Configuration</h2>
      </div>

      <div className="control-stack">
        <FloatControl
          label="Haptics gain"
          value={bridge.draft.hapticsGain}
          min={1}
          max={2}
          step={0.05}
          issue={fieldIssue(bridge.issues, "hapticsGain")}
          onChange={(value) => bridge.setDraftField("hapticsGain", value)}
        />
        <FloatControl
          label="Speaker volume"
          value={bridge.draft.speakerVolume}
          min={1}
          max={2}
          step={0.05}
          issue={fieldIssue(bridge.issues, "speakerVolume")}
          onChange={(value) => bridge.setDraftField("speakerVolume", value)}
        />
        <IntegerControl
          label="Inactive time"
          value={bridge.draft.inactiveTime}
          min={10}
          max={60}
          issue={fieldIssue(bridge.issues, "inactiveTime")}
          onChange={(value) => bridge.setDraftField("inactiveTime", value)}
        />
        <ToggleControl
          label="Disable inactive disconnect"
          value={bridge.draft.disableInactiveDisconnect}
          onChange={(value) => bridge.setDraftField("disableInactiveDisconnect", value)}
        />
        <ToggleControl
          label="Disable Pico LED"
          value={bridge.draft.disablePicoLed}
          onChange={(value) => bridge.setDraftField("disablePicoLed", value)}
        />
        <PollingRateControl
          value={bridge.draft.pollingRateMode}
          onChange={(value) => bridge.setDraftField("pollingRateMode", value)}
        />
        <IntegerControl
          label="Haptics buffer length"
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
      </div>
    </section>
  );
}
