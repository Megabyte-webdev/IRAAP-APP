self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* IRAAP web push service worker */
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const data = payload.data || payload.notification || payload;
  const type = String(data.type || payload.type || "").toUpperCase();
  const organizationNotification = type.includes("ORGANIZATION");
  const targetUrl = organizationNotification
    ? "/organization"
    : data.link || data.url || payload.link || payload.url || "/";

  const title = data.title || payload.title || "IRAAP";
  const options = {
    body:
      data.message ||
      data.body ||
      payload.message ||
      payload.body ||
      "You have a new update in IRAAP.",
    icon: data.icon || payload.icon || "/iraap-mark-192x192.png",
    badge: data.badge || payload.badge || "/iraap-mark-192x192.png",
    data: { url: targetUrl },
    tag:
      data.tag ||
      payload.tag ||
      (organizationNotification ? "iraap-organization" : undefined),
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification?.data?.url || "/";
  const url = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            "focus" in client &&
            client.url.startsWith(self.location.origin)
          ) {
            return client.focus().then(() => client.navigate(url));
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
