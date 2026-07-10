"use client";

import * as React from "react";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type SiteSettings } from "@/services/settings";

import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/toaster";

// --- CONTEXT PROVIDERS ---
import { SocketProvider } from "@/components/providers/SocketProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { SiteThemeProvider } from "@/components/providers/SiteThemeProvider";

// --- BACKGROUND SERVICES & GLOBAL UI ---
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import FcmProvider from "@/components/providers/FcmProvider";
export { SettingsContext } from "@/components/providers/SiteThemeProvider";

//  a clean fallback UI component
const GlobalLoadingFallback = () => (
  <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Загрузка Eventomir...
      </p>
    </div>
  </div>
);

export function Providers({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: SiteSettings | null;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Prevents spamming APIs when returning to the PWA
            retry: 2,
          },
        },
      }),
  );
  if (!initialSettings) {
    return <GlobalLoadingFallback />;
  }

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* 1. Background Service Workers (Invisible) */}
        <ServiceWorkerRegister />
        <FcmProvider />

        {/* 2. Real-Time Data Contexts (Wrap the app to provide state) */}
        <SocketProvider>
          <NotificationProvider>
            {/* 3. Theming Engine (Injects CSS variables for everything below) */}
            <SiteThemeProvider settings={initialSettings}>
              {/* 4. Main Application Layout */}
              <ClientLayout>
                <Suspense fallback={<GlobalLoadingFallback />}>
                  {children}
                </Suspense>
              </ClientLayout>

              <Toaster />
            </SiteThemeProvider>
          </NotificationProvider>
        </SocketProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
