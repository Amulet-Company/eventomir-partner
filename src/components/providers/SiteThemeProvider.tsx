"use client";

import React, { createContext, useContext } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { type SiteSettings } from "@/services/settings";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme-registry";

export const SettingsContext = createContext<SiteSettings | null>(null);

export const useSiteSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteThemeProvider");
  }
  return context;
};

export function SiteThemeProvider({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: React.ReactNode;
}) {
  // Extract theme values with safe defaults
  const presetKey = (settings?.theme?.preset || "classic") as ThemePreset;
  const radius = settings?.theme?.radius || "0.5rem";
  const fontFamily = settings?.fontFamily || "Arial, Helvetica, sans-serif";

  const selectedTheme = THEME_PRESETS[presetKey] || THEME_PRESETS["classic"];

  // Inject dynamic CSS into the document <head>
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              ${selectedTheme.light}
              --radius: ${radius};
              --font-main: ${fontFamily};
            }
            .dark {
              ${selectedTheme.dark}
            }
            body {
              font-family: var(--font-main) !important;
            }
          `,
        }}
      />
    );
  });

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
