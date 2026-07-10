"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { VkontakteIcon, TelegramIcon } from "@/components/Icons";
import { useSiteSettings } from "@/components/providers/SiteThemeProvider";
import { Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const settings = useSiteSettings();
  const { status } = useSession();
  const currentYear = new Date().getFullYear();
  const isLoading = !settings;

  const contacts = settings?.contacts;
  const siteName = settings?.siteName || "Eventomir";
  const mainAppUrl =
    process.env.NEXT_PUBLIC_WEB_APP_URL || "https://app.eventomir.ru";

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200/60 pt-16 pb-8 mt-auto overflow-hidden text-slate-600">
      {/* --- Subtle Background Glows matching the Light Hero section --- */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-multiply pointer-events-none"></div>

      <div className="mx-auto px-5 md:px-8 relative z-10">
        {/* Main Footer Content: Flex layout instead of Grid */}
        <div className="flex flex-col items-center justify-between gap-4 text-center ">
          {/* 1. Brand & Info */}
          <div className="flex flex-col items-center  space-y-2 max-w-lg">
            <Link
              href="/"
              className="text-3xl font-semibold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400 transition-colors"
            >
              {siteName}{" "}
              <span className="opacity-80 text-2xl font-semibold tracking-tighter transition-colors text-primary/80">
                Партнер
              </span>
            </Link>
            <p className=" text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
              Программа ивент-бизнеса для партнеров. Привлекайте иполнителей и
              зарабатывайте вместе с eventomir.ru
            </p>
          </div>

          {/* 2. Single Row of Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm font-bold text-slate-600">
            <Link
              href={mainAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              Главная платформа{" "}
              <ExternalLink className="h-3.5 w-3.5 opacity-50" />
            </Link>
            <Link
              href={`${mainAppUrl}/pricing`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              Тарифы <ExternalLink className="h-3.5 w-3.5 opacity-50" />
            </Link>
            <Link
              href="/documents"
              className="hover:text-primary transition-colors"
            >
              Справка и Документы
            </Link>

            <Link
              href={`${mainAppUrl}/documents#privacy`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline font-semibold"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href={`${mainAppUrl}/documents#terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline font-semibold"
            >
              Условия использования
            </Link>
          </nav>

          {/* 3. Contacts & Socials */}
          {/* <div className="flex flex-col items-center md:items-end space-y-4">
            {isLoading ? (
              <div className="space-y-3 flex flex-col items-end">
                <Skeleton className="h-5 w-40 bg-slate-200" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-semibold text-slate-700">
                  {contacts?.phone && (
                    <a
                      href={`tel:${contacts.phone}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                      <Phone className="h-4 w-4 text-primary group-hover:text-orange-500 transition-colors" />
                      {contacts.phone}
                    </a>
                  )}
                  {contacts?.email && (
                    <a
                      href={`mailto:${contacts.email}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                      <Mail className="h-4 w-4 text-primary group-hover:text-orange-500 transition-colors" />
                      {contacts.email}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {contacts?.vkLink && (
                    <Link
                      href={contacts.vkLink}
                      aria-label="VK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:shadow hover:bg-primary hover:border-primary text-slate-500 hover:text-white transition-all duration-300"
                    >
                      <VkontakteIcon className="w-5 h-5" />
                    </Link>
                  )}
                  {contacts?.telegramLink && (
                    <Link
                      href={contacts.telegramLink}
                      aria-label="Telegram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:shadow hover:bg-blue-500 hover:border-blue-500 text-slate-500 hover:text-white transition-all duration-300"
                    >
                      <TelegramIcon className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </>
            )}
          </div> */}
        </div>

        <Separator className="my-8 bg-slate-200/80" />

        {/* Bottom Footer: Legal & Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          {/* <div className="flex flex-col items-center  space-y-2 max-w-lg">
            <small className="font-semibold">
              © eventomir.ru, 2026 ООО «АМУЛЕТ КОМПАНИ» осуществляет
              деятельность в области информационных технологий. Вид деятельности
              (код): 2.01. На информационном ресурсе применяются
              рекомендательные технологии.
            </small>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
