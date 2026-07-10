// This file can be used to declare global types or augment existing ones.
// Этот файл можно использовать для объявления глобальных типов или расширения существующих.

export interface PageSEO {
  path: string;
  title: string;
  description: string;
  keywords: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  logoAltText: string;
  faviconUrl: string;
  theme: {
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
  };
  pageSpecificSEO: PageSEO[];
  fontFamily: string;
  siteCategories: { id: string; name: string; icon: any }[];
  partnershipConfig?: {
    commissionRate: number;
    cookieLifetime: number;
    minPayout: number;
  };
  contacts?: {
    email: string;
    phone: string;
    vkLink: string;
    telegramLink: string;
  };
}
