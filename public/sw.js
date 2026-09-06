self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let data = {}; try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = data.title || 'IRAAP Notification';
  const options = { body: data.body || '', icon: data.icon || '/irap-logo.png', tag: data.tag || 'iraap-notification', data: { url: data.url || '/dashboard' } };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const existing = list.find(client => 'focus' in client);
    if (existing) { existing.navigate(url); return existing.focus(); }
    return clients.openWindow(url);
  }));
});
