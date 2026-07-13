"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  X,
  LogIn,
  Users,
} from "lucide-react";

interface ClientMenuProps {
  isLoggedIn: boolean;
  userRole: "customer" | "performer" | "partner" | null;
  userImage?: string | null;
  userName: string;
  useTransparentStyle: boolean;
}

const ClientMenu: React.FC<ClientMenuProps> = ({
  isLoggedIn,
  userRole,
  userImage,
  userName,
  useTransparentStyle,
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // 🚨 NEW FUNCTIONALITY: Disable background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to ensure scroll is restored if the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (!isClient) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    setIsMenuOpen(false);
  };

  const profileLink =
    userRole === "partner"
      ? { href: "/profile", label: "Настройки профиля" }
      : { href: "/complete-registration", label: "Завершить регистрацию" };

  // ==========================================
  // MOBILE MENU (Framer Motion Drawer)
  // ==========================================
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-all hover:scale-105 active:scale-95 ${
            useTransparentStyle
              ? "bg-primary/10 hover:bg-primary/20 text-primary"
              : "bg-primary/10 hover:bg-primary/20 text-primary"
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-sm bg-background shadow-2xl z-[110] flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <span className="font-bold text-lg text-foreground">
                    Eventomir партнер
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {!isLoggedIn ? (
                    <div className="flex flex-col gap-3 mt-4">
                      <p className="text-sm text-muted-foreground text-center mb-2">
                        Войдите, чтобы получить доступ к панели партнера
                      </p>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full font-bold h-12 rounded-xl text-md gap-2">
                          <LogIn className="w-5 h-5" /> Войти в аккаунт
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full font-bold h-12 rounded-xl text-md">
                          Стать партнером
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* User Info Block */}
                      <div className="flex items-center gap-3 p-3 mb-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                          {userImage ? (
                            <Image
                              src={userImage}
                              alt="User"
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-black truncate">
                            {userName || "Пользователь"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {userRole === "partner"
                              ? "Партнер"
                              : "Требует активации"}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        {userRole === "partner" && (
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium text-foreground transition-colors"
                          >
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                              <LayoutDashboard className="w-5 h-5" />
                            </div>
                            Кабинет партнера
                          </Link>
                        )}
                        <Link
                          href={profileLink.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted font-medium text-foreground transition-colors"
                        >
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Settings className="w-5 h-5" />
                          </div>
                          {profileLink.label}
                        </Link>
                      </div>

                      <div className="mt-auto pt-6">
                        <Button
                          variant="destructive"
                          className="w-full h-12 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5 mr-2" /> Выйти из аккаунта
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ==========================================
  // DESKTOP MENU
  // ==========================================
  return (
    <nav className="flex items-center gap-4">
      {!isLoggedIn ? (
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className={`font-semibold rounded-full  ${
                useTransparentStyle
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-700 hover:text-slate-900 hover:bg-primary/30"
              }`}
            >
              Войти
            </Button>
          </Link>
          <Link href="/register">
            <Button className="font-bold rounded-full transition-all hover:-translate-y-0.5">
              Стать партнером
            </Button>
          </Link>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`h-11 gap-2 pl-2 pr-4 rounded-full border-transparent transition-colors focus-visible:ring-0 ${
                useTransparentStyle
                  ? "bg-primary/10 hover:bg-primary/20 hover:text-primary"
                  : "bg-primary/10 hover:bg-primary/20 hover:text-primary"
              }`}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="profile"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User
                    className={`h-4 w-4 ${
                      useTransparentStyle ? "text-white" : "text-primary"
                    }`}
                  />
                )}
              </div>
              <span
                className={`max-w-[120px] truncate font-medium text-sm ${
                  useTransparentStyle
                    ? "hover:text-white"
                    : "hover:text-primary"
                }`}
              >
                {userName?.split(" ")[0] || "Профиль"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 p-2 rounded-2xl shadow-xl mt-2 border-border/50"
          >
            <DropdownMenuLabel className="px-3 pb-2 pt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Управление
            </DropdownMenuLabel>

            {userRole === "partner" && (
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-2 rounded-xl focus:bg-muted font-medium "
              >
                <Link href="/dashboard">
                  <div className="p-1.5 bg-primary/10 rounded-md mr-3">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  Дашборд
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              asChild
              className="cursor-pointer p-2 rounded-xl focus:bg-muted font-medium"
            >
              <Link href="/referrals">
                <div className="p-1.5 bg-primary/10 rounded-md mr-3">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Рекомендации
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer p-2 rounded-xl focus:bg-muted font-medium"
            >
              <Link href={profileLink.href}>
                <div className="p-1.5 bg-primary/10 rounded-md mr-3">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                Настройки профиля
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem
              className="cursor-pointer p-3 rounded-xl focus:bg-red-500/10 focus:text-red-600 text-red-500 font-medium transition-colors"
              onClick={handleLogout}
            >
              <div className="p-1.5 bg-red-500/10 rounded-md mr-3">
                <LogOut className="h-4 w-4" />
              </div>
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default ClientMenu;
