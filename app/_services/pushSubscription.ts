import { api } from "../_lib/api-client";

export async function disablePushForCurrentDevice() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return;

    const endpoint = subscription.endpoint;

    // Remove the server record while the current access token is still valid.
    try {
      await api.delete("/push/subscribe", { data: { endpoint } });
    } catch (error) {
      // Local unsubscribe below is the important fallback. If the server row
      // remains, the next push attempt will be rejected and cleaned up there.
      console.warn("[PUSH] server unsubscribe failed during logout:", error);
    }

    try {
      await subscription.unsubscribe();
    } catch (error) {
      console.warn("[PUSH] browser unsubscribe failed during logout:", error);
    }
  } catch (error) {
    console.warn("[PUSH] unable to clean up device subscription:", error);
  }
}
