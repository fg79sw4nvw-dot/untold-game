export function registerPwaServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(error => {
      console.error("UNTOLD service worker registration failed", error);
    });
  }, { once: true });
}
