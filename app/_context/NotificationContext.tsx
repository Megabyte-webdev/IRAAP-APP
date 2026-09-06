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
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authDetails } = useAuth();
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
        console.log("Notification permission:", permission);
        if (permission !== "granted") return;

        // 4. Get the active registration (guaranteed after ready + controller check)
        const activeReg = await navigator.serviceWorker.ready;

        // 5. Check for existing subscription
        const existing = await activeReg.pushManager.getSubscription();

        if (existing) {
          // Re-sync with server in case the server lost the subscription
          await api.post("/push/subscribe", {
            userId: authUserId,
            subscription: existing,
          });
          return;
        }

        // 6. Create new subscription
        const subscription = await activeReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        // 7. Send to server
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

  return <>{children}</>;
}
