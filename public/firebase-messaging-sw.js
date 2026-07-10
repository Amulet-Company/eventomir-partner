importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

// 1. Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEFVxhBdqjvecjA_aj5TAD8lI30NPFglU",
  authDomain: "zepo-c03d7.firebaseapp.com",
  projectId: "zepo-c03d7",
  storageBucket: "zepo-c03d7.firebasestorage.app",
  messagingSenderId: "465436463784",
  appId: "1:465436463784:web:d663dcaf80d8a84d29289d",
  measurementId: "G-5NCKNW2SR4",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 2. Handle Background Messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // If the backend sent a 'notification' block, Firebase SDK handles the UI automatically.
  if (payload.notification) {
    return;
  }

  // Handle DATA-ONLY payloads manually
  const notificationTitle = payload.data?.title || "Новое уведомление";

  const notificationOptions = {
    body: payload.data?.body || "",
    icon: "/icons/icon-192.png", // Make sure this exists in your public folder
    badge: "/icons/badge.png", // Make sure this exists in your public folder
    data: { url: payload.data?.click_action || payload.data?.url || "/" },
  };

  // You MUST return this promise, otherwise Android thinks the Service Worker failed
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// 3. Handle Notification Click (Smart Tab Focusing)
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // 🚨 CRITICAL FIX: When Firebase auto-generates the notification, it hides the data inside FCM_MSG
  let urlToOpen = "/";
  if (event.notification.data?.url) {
    urlToOpen = event.notification.data.url;
  } else if (event.notification.data?.FCM_MSG?.data?.url) {
    urlToOpen = event.notification.data.FCM_MSG.data.url;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // 1. Check if there is already a window/tab open with the app
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];

          if (client.url.includes(self.location.origin) && "focus" in client) {
            // Navigate the existing tab to the correct URL and focus it
            client.navigate(urlToOpen);
            return client.focus();
          }
        }

        // 2. If no window is open, launch a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
