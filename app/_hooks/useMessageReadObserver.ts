"use client";

import { useEffect, useRef } from "react";
import { websocket } from "../_services/websocket";

/**
 * Observes message elements in the scroll container and emits chat:read:bulk
 * only when:
 *   1. The message bubble is ≥50% visible in the viewport
 *   2. The browser tab is focused (document.visibilityState === "visible")
 *   3. The message was sent by someone else (not us)
 *   4. The message is not already READ
 *
 * Uses a 600ms debounce to batch multiple visible messages into one WS emit,
 * exactly like WhatsApp — one bulk read per "reading session" rather than
 * one emit per message.
 */
export function useMessageReadObserver({
  containerRef,
  messages,
  authUserId,
  conversationId,
  recipientId,
  enabled,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  messages: Array<{ id: number; senderId: number; status: string }>;
  authUserId: number | undefined;
  conversationId: number | undefined;
  recipientId: number | undefined;
  enabled: boolean; // false when tab is hidden or chat is not mounted
}) {
  const pendingRef = useRef<Set<number>>(new Set()); // ids visible but not yet emitted
  const emittedRef = useRef<Set<number>>(new Set()); // ids already sent to server
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Build a lookup for fast status checks without scanning the array
  const messageMapRef = useRef<
    Map<number, { senderId: number; status: string }>
  >(new Map());
  useEffect(() => {
    const map = new Map<number, { senderId: number; status: string }>();
    for (const m of messages) map.set(m.id, m);
    messageMapRef.current = map;
  }, [messages]);

  // Reset emitted set when conversation changes
  useEffect(() => {
    emittedRef.current = new Set();
    pendingRef.current = new Set();
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [conversationId, recipientId]);

  useEffect(() => {
    if (!enabled || !authUserId || !conversationId || !recipientId) return;
    const container = containerRef.current;
    if (!container) return;

    const flush = () => {
      if (!document.hasFocus() || document.visibilityState !== "visible")
        return;
      if (pendingRef.current.size === 0) return;

      // Only emit ids that are still unread (status may have updated since observation)
      const toRead = [...pendingRef.current].filter((id) => {
        const m = messageMapRef.current.get(id);
        return m && m.senderId !== authUserId && m.status !== "READ";
      });

      pendingRef.current.clear();
      if (toRead.length === 0) return;

      toRead.forEach((id) => emittedRef.current.add(id));

      websocket.emit("chat:read:bulk", {
        conversationId,
        senderId: recipientId,
      });
    };

    const scheduleFlush = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 600);
    };

    // Visibility change — flush when user tabs back in
    const onVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        pendingRef.current.size > 0
      ) {
        scheduleFlush();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Focus — same as visibility
    const onFocus = () => {
      if (pendingRef.current.size > 0) scheduleFlush();
    };
    window.addEventListener("focus", onFocus);

    // Intersection observer — fires when message enters/leaves viewport
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let changed = false;

        for (const entry of entries) {
          const id = Number(entry.target.getAttribute("data-message-id"));
          if (!id) continue;

          const m = messageMapRef.current.get(id);
          if (!m) continue;

          // Skip own messages and already-read ones
          if (m.senderId === authUserId) continue;
          if (m.status === "READ") continue;
          if (emittedRef.current.has(id)) continue;

          if (entry.isIntersecting) {
            pendingRef.current.add(id);
            changed = true;
          } else {
            pendingRef.current.delete(id);
          }
        }

        if (
          changed &&
          document.visibilityState === "visible" &&
          document.hasFocus()
        ) {
          scheduleFlush();
        }
      },
      {
        root: container,
        threshold: 0.5, // message must be 50% visible — matches WhatsApp behaviour
      },
    );

    // Observe all current message elements
    const nodes = container.querySelectorAll("[data-message-id]");
    nodes.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, authUserId, conversationId, recipientId, containerRef]);

  // Re-observe whenever the message list changes (new messages rendered)
  useEffect(() => {
    const container = containerRef.current;
    const observer = observerRef.current;
    if (!container || !observer) return;

    // Observe any newly rendered elements not yet being watched
    const nodes = container.querySelectorAll("[data-message-id]");
    nodes.forEach((el) => observer.observe(el));
  }, [messages.length]);
}
