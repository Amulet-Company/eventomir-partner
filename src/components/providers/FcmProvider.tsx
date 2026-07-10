"use client";

import { useEffect, useState } from "react";
import useFCMToken from "@/hooks/useFCMToken";

export default function FcmProvider() {
  const [isSwReady, setIsSwReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => setIsSwReady(true));
    }
  }, []);

  if (isSwReady) {
    return <FcmTokenRunner />;
  }
  return null;
}

function FcmTokenRunner() {
  useFCMToken();
  return null;
}
