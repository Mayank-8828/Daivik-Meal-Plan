/* firebase-messaging-sw.js
   Background push handler for FCM (Firebase Cloud Messaging).
   This file must live at the root of the site so it has the right scope.
   It is registered automatically by Firebase Messaging when getToken() is called.

   Because this SW cannot import ES modules, it uses the compat libraries. */

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDaqo8lcbFVQB-sCmyMY--XJhGI1crwhsw",
  authDomain: "daivik-meal-plan.firebaseapp.com",
  projectId: "daivik-meal-plan",
  storageBucket: "daivik-meal-plan.firebasestorage.app",
  messagingSenderId: "197581914517",
  appId: "1:197581914517:web:298337cfe85ab6358ff69c"
});

const messaging = firebase.messaging();

/* Show a notification when a push arrives and the app is in the background
   (closed tab or minimised). The payload shape matches what /api/notify sends. */
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || "Daivik's Food Journey";
  const body  = payload.notification?.body  || '';
  self.registration.showNotification(title, {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'daivik-push',
    renotify: true
  });
});
