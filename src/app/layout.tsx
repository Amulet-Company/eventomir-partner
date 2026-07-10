import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { getSiteSettings } from "@/services/settings";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Critical for Native App Feel (prevents zoom on input focus)
  colorScheme: "light dark",
};

// --- SEO & OPEN GRAPH METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // 🚨 FIX 1: Safely handle undefined settings without printing "undefined Партнер"
  const baseSiteName = settings?.siteName || "Eventomir";
  const siteName = `${baseSiteName} Партнер`;
  const defaultDescription = `Найдите лучших фотографов, диджеев, ведущих, поваров, транспорт и других профессионалов для вашего мероприятия в России на ${siteName}.`;

  // 🚨 FIX 2: Ensure clean domain without trailing slashes
  const rawDomain =
    process.env.NEXT_PUBLIC_BASE_URL || "https://partner.eventomir.ru";
  const appDomain = rawDomain.endsWith("/")
    ? rawDomain.slice(0, -1)
    : rawDomain;

  const favicon = settings?.faviconUrl || "/favicon.ico";

  // 🚨 FIX 3: FORCE Absolute URL for the Open Graph Image
  let ogImage = settings?.logoUrl || "/images/og-image.png";
  // If the image is a relative path (starts with '/'), prepend the absolute domain
  if (ogImage.startsWith("/")) {
    ogImage = `${appDomain}${ogImage}`;
  }

  return {
    metadataBase: new URL(appDomain),
    title: {
      default: `${siteName} — Платформа для поиска исполнителей на мероприятия`,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    applicationName: siteName,
    authors: [{ name: `${baseSiteName} Team`, url: appDomain }],
    generator: "Next.js",
    keywords: [
      "организация мероприятий",
      "поиск исполнителей",
      "фотограф на свадьбу",
      "DJ на праздник",
      "ведущий на корпоратив",
      "аренда транспорта",
      baseSiteName,
    ],
    creator: `${baseSiteName} Team`,
    publisher: siteName,
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },

    // --- OPEN GRAPH (Facebook, WhatsApp, LinkedIn, VK, Telegram) ---
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: appDomain, // Use absolute domain here too
      title: `${siteName} — Ваш гид в мире событий`,
      description: defaultDescription,
      siteName: siteName,
      images: [
        {
          url: ogImage, // Now guaranteed to be absolute (e.g., https://...)
          width: 1200,
          height: 630,
          alt: `Логотип и баннер ${siteName}`,
          type: "image/png",
        },
      ],
    },

    // --- TWITTER CARDS ---
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — Поиск профи для мероприятий`,
      description: defaultDescription,
      images: [ogImage], // Guaranteed absolute
      creator: "@eventomir",
    },

    // --- ICONS & PWA ---
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    manifest: "/manifest.json",

    // --- ROBOTS & SEARCH ENGINES ---
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // --- VERIFICATION ---
    verification: {
      google: "ВАШ_КОД_ВЕРИФИКАЦИИ_GOOGLE", // Replace in production
      yandex: "ВАШ_КОД_ВЕРИФИКАЦИИ_ЯНДЕКС", // Replace in production
    },

    alternates: {
      canonical: "/",
      languages: {
        "ru-RU": "/",
      },
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="ru"
      translate="no"
      className="notranslate"
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      {/* 🚨 EDGE BROWSER FIX: Added max-w-[100vw] overflow-x-hidden */}
      <body className="antialiased flex flex-col min-h-screen font-sans max-w-[100vw] overflow-x-hidden">
        <Providers initialSettings={settings}>{children}</Providers>
      </body>
    </html>
  );
}
