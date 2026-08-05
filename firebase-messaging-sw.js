// sw.js

self.addEventListener('push', function(event) {
  // 1. Get current hour in IST (Asia/Kolkata)
  const currentHour = parseInt(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false
    }),
    10
  );

  // 2. Quiet hours: 9:00 PM (21) to 8:59 AM (less than 9)
  const isQuietHours = currentHour >= 21 || currentHour < 9;

  if (isQuietHours) {
    console.log('Quiet hours active (9 PM - 9 AM). Notification suppressed.');
    return; // Stops the notification pop-up/sound completely
  }

  // 3. Extract notification payload
  let payload = { title: 'New Order Alert', body: 'You have a new order update.' };
  if (event.data) {
    payload = event.data.json();
  }

  const title = payload.title || payload.notification?.title || 'Shanti Jewel Order';
  const options = {
    body: payload.body || payload.notification?.body || 'New update available',
    icon: '/icon-192.png', // Replace with your icon path
    badge: '/badge.png',   // Replace with your badge path
    data: payload.data || {}
  };

  // 4. Display notification during active hours (9 AM - 9 PM)
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
