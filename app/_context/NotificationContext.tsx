"use client";

import { useEffect } from "react";
import { useAuth } from "../_context/AuthContext";
import { requestNotificationPermission } from "@/app/_services/chatNotification";
import { api } from "../_lib/api-client";

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
      console.log("setting up notification");

      const permission = await requestNotificationPermission();
      console.log("permission", permission);
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();
      if (existing) return;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      await api.post("/push/subscribe", {
        userId: authUserId,
        subscription,
      });
    };

    setupPush();
  }, [authUserId]);

  return <>{children}</>;
}
