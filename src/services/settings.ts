import { cache } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api-client";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface SubCategory {
  id: string;
  name: string;
  link: string;
}

export interface SiteCategory {
  id: string;
  name: string;
  icon: string;
  link: string;
  subCategories?: SubCategory[];
}

export interface PageSEO {
  path: string;
  title: string;
  description: string;
  keywords: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  logoAltText?: string;
  faviconUrl?: string;
  fontFamily: string;
  contacts: {
    email?: string;
    phone?: string;
    vkLink?: string;
    telegramLink?: string;
  };
  theme: {
    preset?: string;
    radius?: string;
  };
  siteCategories: SiteCategory[];
  pageSpecificSEO: PageSEO[];
}

// ==========================================
// 2. CLIENT-SIDE (REACT QUERY)
// Used in "use client" components like Search Page
// ==========================================

/**
 * Fetches general settings via the configured axios client (includes interceptors).
 */
export const fetchGeneralSettings = async (): Promise<SiteSettings> => {
  return await apiRequest({
    method: "get",
    url: "/api/settings/general",
  });
};

/**
 * React Query Hook to automatically fetch, cache, and update settings on the client.
 */
export function useGeneralSettingsQuery() {
  return useQuery({
    queryKey: ["settings", "general"],
    queryFn: fetchGeneralSettings,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}

// ==========================================
// 3. SERVER-SIDE (NEXT.JS CACHE)
// Used in Server Components like app/layout.tsx for SEO/Metadata
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8800";

/**
 * Fetches the global site settings directly from the backend for SSR.
 * Uses Next.js data cache to revalidate every 60 seconds, preventing unnecessary API calls.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const res = await fetch(`${API_URL}/api/settings/general`, {
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
    });

    if (!res.ok) throw new Error("Failed to fetch settings");

    return res.json();
  } catch (error) {
    console.error("Error fetching site settings on server:", error);
    return null;
  }
});
