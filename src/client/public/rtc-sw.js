self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  return self.clients.claim()
})

/*
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request))
})
*/

self.addEventListener('notificationclick', e => {
  const tradeNotification = e.notification.data
  if (e.action === 'highlight-trade') {
    self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    }).then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: "highlight-trade",
          payload: tradeNotification
        });
      }
    });
  }
})