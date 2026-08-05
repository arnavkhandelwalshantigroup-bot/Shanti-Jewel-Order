// sw.js

self.addEventListener('push', function(event) {
  const currentHour = parseInt(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false
    }),
    10
  );

  // Quiet hours: 9:00 PM to 8:59 AM
  if (currentHour >= 21 || currentHour < 9) {
    console.log('Quiet hours active. Notification suppressed.');
    return;
  }

  let payload = {};
  if (event.data) {
    payload = event.data.json();
  }

  const title = payload.title || payload.notification?.title || 'Shanti Jewel Order';
  
  // Extract photo URL sent from your backend / Firebase
  const photoUrl = payload.image || payload.notification?.image || payload.data?.imageUrl;

  const options = {
    body: payload.body || payload.notification?.body || 'New order update available',
    icon: '/icon-192.png',          // Small logo icon
    badge: '/badge.png',         // Small status bar icon
    image: photoUrl,             // <--- THIS SHOWS THE FULL ORDER PHOTO
    data: payload.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
