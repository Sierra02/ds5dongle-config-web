import { ActionsPanel } from "./components/ActionsPanel";
import { AppHeader } from "./components/AppHeader";
import { ConfigPanel } from "./components/ConfigPanel";
import { DeviceStrip } from "./components/DeviceStrip";
import { NoticeList } from "./components/NoticeList";
import { useDs5Bridge } from "./hooks/useDs5Bridge";

export default function App() {
  const bridge = useDs5Bridge();
  const isBusy = bridge.operation !== null;
  const hasIssues = bridge.issues.length > 0;

  return (
    <main className="app-shell">
      <AppHeader isConnected={bridge.isConnected} statusText={bridge.statusText} />
      <NoticeList error={bridge.error} supported={bridge.supported} onClearError={bridge.clearError} />
      <DeviceStrip
        authorizedDevices={bridge.authorizedDevices}
        client={bridge.client}
        deviceLabel={bridge.deviceLabel}
        isBusy={isBusy}
        supported={bridge.supported}
        onConnect={bridge.connect}
        onConnectAuthorized={bridge.connectAuthorized}
      />

      <div className="content-grid">
        <ConfigPanel bridge={bridge} />
        <ActionsPanel bridge={bridge} hasIssues={hasIssues} isBusy={isBusy} />
      </div>
    </main>
  );
}
