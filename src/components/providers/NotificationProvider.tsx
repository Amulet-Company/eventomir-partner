"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/providers/SocketProvider";
import { apiRequest } from "@/utils/api-client";
import {
  NotificationContextType,
  NotificationItem,
} from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { socket } = useSocket();
  const { toast } = useToast();
  const router = useRouter();
  const { status } = useSession();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const routerRef = useRef(router);
  const toastRef = useRef(toast);

  useEffect(() => {
    routerRef.current = router;
    toastRef.current = toast;
  }, [router, toast]);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/notification.wav");
      audio.play().catch((e) => console.log("Audio play blocked", e));
    } catch (error) {
      console.error("Audio error:", error);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (status !== "authenticated") return;

      try {
        const data = await apiRequest<NotificationItem[]>({
          method: "GET",
          url: "/api/notifications",
        });

        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((n) => !n.isRead).length);
        }
      } catch (error) {
        console.error("Failed to fetch initial notifications:", error);
      }
    };

    fetchNotifications();
  }, [status]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (payload: any) => {
      console.log("🔔 Received Notification:", payload);

      const type = payload.type || "SYSTEM";

      // 🚨 FIX: Safely parse data if the backend stringified it
      let data = payload.data || {};
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      const title = payload.title || data.title || "Уведомление";
      const message = payload.message || payload.body || "Новое сообщение";

      const notifTime = payload.createdAt
        ? new Date(payload.createdAt).getTime()
        : Date.now();

      // 🚨 FIX: Use Math.abs and increase to 60s to prevent Server/Client clock skew from muting toasts
      const isOldMessage = Math.abs(Date.now() - notifTime) > 60000;

      if (type === "CHAT_MESSAGE") {
        const chatItem: NotificationItem = {
          id: payload.id || crypto.randomUUID(),
          type: "CHAT_MESSAGE",
          title: title, // Added title mapping safely
          message: message || `Новое сообщение от ${data?.senderName}`,
          isRead: false,
          createdAt: payload.createdAt || new Date().toISOString(),
          data: {
            chatId: data?.chatId,
            senderName: data?.senderName,
            preview: data?.preview,
            url: data?.url || `/chat/${data?.chatId}`,
          },
        };

        setNotifications((prev) => [chatItem, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } else {
        const genericItem: NotificationItem = {
          id: payload.id || crypto.randomUUID(),
          type: type,
          title: title, // 🚨 FIX: Store the title so the UI can render it
          message: message,
          isRead: false,
          createdAt: payload.createdAt || new Date().toISOString(),
          data: data,
        };

        setNotifications((prev) => [genericItem, ...prev]);
        setUnreadCount((prev) => prev + 1);

        if (!isOldMessage) {
          playNotificationSound();

          let variant: "default" | "success" | "destructive" = "default";

          // 🚨 FIX: Trigger the green success variant for new referrals
          if (
            type === "BOOKING_ACCEPTED" ||
            type === "SUCCESS" ||
            type === "REFERRAL_UPDATE"
          ) {
            variant = "success";
          }

          if (
            type === "BOOKING_REJECTED" ||
            type === "BOOKING_CANCELLED" ||
            type === "FAILED"
          ) {
            variant = "destructive";
          }

          toastRef.current({
            variant: variant,
            title: title,
            description: message,
            action: data?.url
              ? {
                  label: "Открыть",
                  onClick: () => routerRef.current.push(data.url),
                }
              : undefined,
          });
        }
      }
    };

    const handleSpecificMessage = (payload: any) => {
      handleNotification({
        type: "CHAT_MESSAGE",
        id: crypto.randomUUID(),
        title: "Новое сообщение",
        message: `Сообщение от ${payload.senderName}`,
        createdAt: new Date().toISOString(),
        data: {
          chatId: payload.chatId,
          senderName: payload.senderName,
          preview: payload.preview,
        },
      });
    };

    socket.on("notification", handleNotification);
    socket.on("new_notification", handleNotification);
    socket.on("message_notification", handleSpecificMessage);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("new_notification", handleNotification);
      socket.off("message_notification", handleSpecificMessage);
    };
  }, [socket, playNotificationSound]);

  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
          return { ...n, isRead: true };
        }
        return n;
      }),
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
