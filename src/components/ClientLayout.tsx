"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Define paths where the Header and Footer should NOT be shown

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password/");

  useEffect(() => {
    document.body.style.overscrollBehaviorY = "none";
    return () => {
      document.body.style.overscrollBehaviorY = "auto";
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background w-full overflow-x-hidden relative">
      {/* Conditionally render the Header */}
      {!isAuthPage && <ClientHeader />}

      {/* 
        If it's an auth page, we remove the bottom padding that was 
        originally intended for the mobile navigation/footer spacing 
      */}
      <main
        className={`flex-grow relative w-full ${
          !isAuthPage
            ? "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
            : ""
        }`}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;
