importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBnvmQBPkJmJcjXf71vEUY91B2_2P9oAgU",
    databaseURL: "https://shanti-jewel-order-default-rtdb.firebaseio.com/",
    projectId: "shanti-jewel-order",
    storageBucket: "shanti-jewel-order.firebasestorage.app",
    messagingSenderId: "109312345678" // Optional: Replace with your actual FCM Messaging Sender ID if custom
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    const title = payload.notification ? payload.notification.title : (payload.data ? payload.data.title : "SHANTI JEWEL ALERT");
    const options = {
        body: payload.notification ? payload.notification.body : (payload.data ? payload.data.body : "You have an order due soon!"),
        icon: payload.notification && payload.notification.icon ? payload.notification.icon : "./manifest-icon.png",
        image: payload.notification && payload.notification.image ? payload.notification.image : (payload.data ? payload.data.image : null),
        badge: "./manifest-icon.png",
        vibrate: [200, 100, 200],
        data: {
            url: self.location.origin
        }
    };

    return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow(event.notification.data.url || '/');
        })
    );
});
