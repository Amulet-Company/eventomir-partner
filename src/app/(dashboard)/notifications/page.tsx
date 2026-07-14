"use client";

import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/providers/NotificationProvider";
import { apiRequest } from "@/utils/api-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/clx";
import { NotificationItem } from "@/types/notification";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  CheckCheckIcon,
  Info,
  MessageCircle,
} from "lucide-react";

// Helper to determine the icon and color based on notification type
const getNotificationVisuals = (type: string) => {
  if (type === "CHAT_MESSAGE") {
    return {
      icon: MessageCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    };
  }
  if (type.includes("ACCEPTED") || type.includes("SUCCESS")) {
    return {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    };
  }
  if (
    type.includes("REJECTED") ||
    type.includes("CANCELLED") ||
    type.includes("FAILED")
  ) {
    return {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    };
  }
  if (type.includes("NEW_BOOKING") || type.includes("PENDING")) {
    return { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" };
  }
  return { icon: Info, color: "text-primary", bg: "bg-primary/10" };
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotification();
  const router = useRouter();

  // Handle clicking a specific notification
  const handleNotificationClick = async (notif: NotificationItem) => {
    // 1. Optimistically mark as read in UI (instant feedback)
    if (!notif.isRead) {
      markAsRead(notif.id.toString());

      // 2. Tell backend to permanently mark as read
      try {
        await apiRequest({
          method: "PATCH",
          url: `/api/notifications/${notif.id}/read`,
        });
      } catch (err) {
        console.error("Failed to mark as read in DB", err);
      }
    }

    // 3. Route the user if a URL was provided in the notification payload (Deep Linking)
    if (notif.data?.url) {
      router.push(notif.data.url);
    }
  };

  // Handle clicking "Read All"
  const handleMarkAllRead = async () => {
    markAllAsRead(); // Optimistic UI update
    try {
      await apiRequest({
        method: "PATCH",
        url: `/api/notifications/read-all`,
      });
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 pt-8 pb-20">
      <div className="container max-w-3xl mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                Уведомления
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium mt-0.5">
                {unreadCount > 0
                  ? `У вас ${unreadCount} непрочитанных сообщений`
                  : "Все уведомления прочитаны"}
              </p>
            </div>
          </div> */}

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="rounded-xl shadow-sm hover:bg-muted font-bold text-xs h-10 px-4 transition-all shrink-0"
            >
              <CheckCheckIcon className="mr-2 h-4 w-4" /> Прочитать все
            </Button>
          )}
        </div>

        {/* --- Notifications List --- */}
        <div className="bg-card rounded-[2rem] shadow-sm border border-border/50 p-4 md:p-6 min-h-[400px]">
          {notifications.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Bell className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">
                Уведомлений пока нет
              </p>
              <p className="text-muted-foreground max-w-sm">
                Здесь будет отображаться история ваших заказов, системные
                сообщения и обновления статусов.
              </p>
            </div>
          ) : (
            // Populated List
            <div className="space-y-3">
              {notifications.map((notif) => {
                const {
                  icon: Icon,
                  color,
                  bg,
                } = getNotificationVisuals(notif.type);

                // Extract title securely now that our types officially support it
                const title =
                  notif.title || notif.data?.title || "Системное уведомление";

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 group",
                      notif.data?.url ? "cursor-pointer" : "cursor-default",
                      !notif.isRead
                        ? "bg-background border-primary/20 shadow-sm"
                        : "bg-muted/30 border-transparent hover:bg-muted/60",
                    )}
                  >
                    {/* Unread Dot Indicator */}
                    {!notif.isRead && (
                      <span className="absolute top-5 right-5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/10 animate-pulse" />
                    )}

                    {/* Left Icon */}
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                        bg,
                      )}
                    >
                      <Icon className={cn("h-6 w-6", color)} />
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-col gap-1.5 pr-6 flex-1">
                      <div
                        className={cn(
                          "text-[15px] leading-snug",
                          !notif.isRead
                            ? "text-foreground"
                            : "text-foreground/80",
                        )}
                      >
                        <span
                          className={cn(
                            "block mb-1",
                            !notif.isRead
                              ? "font-bold text-base"
                              : "font-semibold",
                          )}
                        >
                          {title}
                        </span>
                        <span
                          className={cn(
                            "block",
                            !notif.isRead
                              ? "font-medium"
                              : "font-normal text-muted-foreground",
                          )}
                        >
                          {notif.message}
                        </span>
                      </div>

                      {/* Meta/Time footer */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider opacity-80">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {format(new Date(notif.createdAt), "d MMMM, HH:mm", {
                          locale: ru,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
