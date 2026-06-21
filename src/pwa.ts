import toast from "react-hot-toast";
import { registerSW } from "virtual:pwa-register";
import i18n from "./i18n";

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;
const AUTO_REFRESH_TOAST_ID = "pwa-cache-refresh";
const MANUAL_REFRESH_TOAST_ID = "pwa-manual-cache-refresh";
const MANUAL_REFRESH_RELOAD_DELAY = 450;

let updatePrompt: Promise<boolean> | null = null;
let manualRefreshInProgress = false;

function t(key: string) {
  return i18n.t(key);
}

function assignStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(element.style, styles);
}

function createButton(label: string, variant: "primary" | "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;

  assignStyles(button, {
    minWidth: "76px",
    border: variant === "primary" ? "1px solid var(--primary)" : "1px solid var(--border)",
    borderRadius: "calc(var(--radius) - 2px)",
    padding: "8px 16px",
    color: variant === "primary" ? "var(--primary-foreground)" : "var(--foreground)",
    background: variant === "primary" ? "var(--primary)" : "var(--card)",
    boxShadow: "none",
  });

  return button;
}

function createUpdateDialog() {
  return new Promise<boolean>((resolve) => {
    if (!document.body) {
      resolve(window.confirm(t("pwa.updatePromptMessage")));
      return;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const backdrop = document.createElement("div");
    const panel = document.createElement("section");
    const title = document.createElement("h2");
    const message = document.createElement("p");
    const actions = document.createElement("div");
    const cancelButton = createButton(t("pwa.updatePromptCancel"), "secondary");
    const confirmButton = createButton(t("pwa.updatePromptConfirm"), "primary");

    title.id = "pwa-update-dialog-title";
    title.textContent = t("pwa.updatePromptTitle");
    message.textContent = t("pwa.updatePromptMessage");

    backdrop.setAttribute("role", "presentation");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", title.id);

    assignStyles(backdrop, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "rgb(15 23 42 / 52%)",
    });

    assignStyles(panel, {
      width: "min(420px, 100%)",
      padding: "22px",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      color: "var(--card-foreground)",
      background: "var(--card)",
      boxShadow: "0 24px 70px rgb(15 23 42 / 26%)",
    });

    assignStyles(title, {
      margin: "0 0 10px",
      color: "var(--app-heading)",
      fontSize: "1rem",
      fontWeight: "750",
      lineHeight: "1.35",
    });

    assignStyles(message, {
      margin: "0",
      color: "var(--muted-foreground)",
      fontSize: "0.95rem",
      lineHeight: "1.65",
      whiteSpace: "pre-wrap",
    });

    assignStyles(actions, {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "20px",
    });

    const close = (shouldUpdate: boolean) => {
      document.removeEventListener("keydown", handleKeyDown);
      backdrop.remove();
      previousActiveElement?.focus();
      resolve(shouldUpdate);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      if (event.shiftKey && document.activeElement === cancelButton) {
        event.preventDefault();
        confirmButton.focus();
      } else if (!event.shiftKey && document.activeElement === confirmButton) {
        event.preventDefault();
        cancelButton.focus();
      }
    };

    cancelButton.addEventListener("click", () => close(false));
    confirmButton.addEventListener("click", () => close(true));
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        close(false);
      }
    });

    actions.append(cancelButton, confirmButton);
    panel.append(title, message, actions);
    backdrop.append(panel);
    document.body.append(backdrop);
    document.addEventListener("keydown", handleKeyDown);
    cancelButton.focus();
  });
}

function confirmWebUpdate() {
  if (!updatePrompt) {
    updatePrompt = createUpdateDialog().finally(() => {
      updatePrompt = null;
    });
  }

  return updatePrompt;
}

async function promptForWebUpdate() {
  try {
    const shouldUpdate = await confirmWebUpdate();

    if (!shouldUpdate) {
      toast(t("pwa.cacheRefreshDeclined"), { id: AUTO_REFRESH_TOAST_ID });
      return;
    }

    toast.loading(t("pwa.cacheRefreshing"), { id: AUTO_REFRESH_TOAST_ID });
    await updateServiceWorker(true);
  } catch (error) {
    console.error("PWA cache refresh failed", error);
    toast.error(t("pwa.cacheRefreshFailed"), { id: AUTO_REFRESH_TOAST_ID });
  }
}

async function updateRegisteredServiceWorkers() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.update()));
}

async function clearCacheStorage() {
  if (!("caches" in window)) {
    return;
  }

  const cacheNames = await window.caches.keys();
  await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
}

export async function refreshWebCache() {
  if (!navigator.onLine) {
    toast.error(t("pwa.cacheRefreshOffline"), { id: MANUAL_REFRESH_TOAST_ID });
    return;
  }

  manualRefreshInProgress = true;
  let reloadScheduled = false;
  toast.loading(t("pwa.cacheRefreshing"), { id: MANUAL_REFRESH_TOAST_ID });

  try {
    await updateRegisteredServiceWorkers();
    await clearCacheStorage();
    await updateServiceWorker(true);

    toast.success(t("pwa.cacheRefreshed"), { id: MANUAL_REFRESH_TOAST_ID });
    reloadScheduled = true;
    window.setTimeout(() => {
      window.location.reload();
    }, MANUAL_REFRESH_RELOAD_DELAY);
  } catch (error) {
    console.error("PWA cache refresh failed", error);
    toast.error(t("pwa.cacheRefreshFailed"), { id: MANUAL_REFRESH_TOAST_ID });
  } finally {
    if (!reloadScheduled) {
      manualRefreshInProgress = false;
    }
  }
}

const updateServiceWorker = registerSW({
  immediate: true,
  onOfflineReady() {
    toast.success(t("pwa.offlineReady"), { id: "pwa-offline-ready" });
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) {
      return;
    }

    window.addEventListener("online", () => {
      void registration.update();
    });

    window.setInterval(() => {
      if (navigator.onLine) {
        void registration.update();
      }
    }, UPDATE_CHECK_INTERVAL);
  },
  onNeedRefresh() {
    if (manualRefreshInProgress) {
      return;
    }

    void promptForWebUpdate();
  },
  onNeedReload() {
    if (manualRefreshInProgress) {
      return;
    }

    toast.success(t("pwa.cacheRefreshed"), { id: AUTO_REFRESH_TOAST_ID });
    window.setTimeout(() => {
      window.location.reload();
    }, MANUAL_REFRESH_RELOAD_DELAY);
  },
  onRegisterError(error) {
    console.error("PWA service worker registration failed", error);
  },
});
