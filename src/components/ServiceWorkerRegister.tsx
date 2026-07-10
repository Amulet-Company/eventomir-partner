"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. Ensure we are in the browser and the browser supports Service Workers
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // 2. Define the registration logic
      const registerSW = () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log(
              "✅ PWA: Service Worker registered successfully.",
              registration.scope,
            );
          })
          .catch((error) => {
            console.error("❌ PWA: Service Worker registration failed:", error);
          });
      };

      // 3. Defer registration until the page fully loads
      // This prevents the SW from stealing CPU cycles during React's initial hydration
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);

        // Cleanup listener if the component unmounts before the window loads
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  // This is a strictly logical component, so it renders nothing visually
  return null;
}
