"use client";

import { useEffect } from "react";
import { useAuth } from "../_context/AuthContext";
import { requestNotificationPermission } from "@/app/_services/chatNotification";
import { api } from "../_lib/api-client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}


export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authDetails, refreshOrganizationContext } = useAuth();
  const authUserId = authDetails?.user?.id;

  useEffect(() => {
    if (!authUserId) return;

    const setupPush = async () => {
      try {
        // 1. Register SW (safe to call multiple times — browser deduplicates)
        if (!("serviceWorker" in navigator)) return;

        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("SW registered:", registration.scope);

        // 2. Wait for the SW to be active and controlling this page
        await navigator.serviceWorker.ready;

        // If the SW just installed, claim() in the SW activate handler will
        // take control — but we may need to wait one tick for controller to
        // be populated before proceeding.
        if (!navigator.serviceWorker.controller) {
          await new Promise<void>((resolve) => {
            const onControllerChange = () => {
              navigator.serviceWorker.removeEventListener(
                "controllerchange",
                onControllerChange,
              );
              resolve();
            };
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              onControllerChange,
            );
          });
        }

        // 3. Request notification permission
        const permission = await requestNotificationPermission();
        if (permission !== "granted") return;

        const { data: keyResponse } = await api.get("/notifications/push/public-key");
        const vapidKey = String(keyResponse?.publicKey || "").trim();
        if (!vapidKey) return;

        const activeReg = await navigator.serviceWorker.ready;

        // Check for existing subscription
        const existing = await activeReg.pushManager.getSubscription();

        if (existing) {
          // Re-sync with server in case the server lost the subscription
          await api.post("/push/subscribe", {
            userId: authUserId,
            subscription: existing,
          });
          return;
        }

        // Create new subscription
        const subscription = await activeReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // Send to server
        await api.post("/push/subscribe", {
          userId: authUserId,
          subscription,
        });

        console.log("Push subscription registered successfully");
      } catch (err) {
        console.error("Push setup failed:", err);
      }
    };

    setupPush();
  }, [authUserId]);

  useEffect(() => {
    if (!authUserId) return;

    const refresh = () => {
      if (document.visibilityState === "visible") {
        void refreshOrganizationContext();
      }
    };

    refresh();
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [authUserId, refreshOrganizationContext]);

  return <>{children}</>;
}
