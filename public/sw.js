self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  try {
    if (!event.data) return;

    const data = event.data.json();

    console.log("PUSH EVENT RECEIVED", data);

    return self.registration.showNotification(data.title ?? "New message", {
      body: data.body ?? "",
      icon: data.icon ?? "/irap-logo.png",
      data: { url: data.url },
      tag: data.tag,
    });
  } catch (err) {
    console.error("Push failed:", err);
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
