// Common fields for all notifications
export interface BaseNotification {
  id: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt: string | Date;
}

// Chat Message Notification
export interface ChatMessagePayload extends BaseNotification {
  type: "CHAT_MESSAGE";
  data: {
    chatId: string;
    senderName: string;
    preview: string;
    url?: string;
    [key: string]: any;
  };
}

// Booking Notification
export interface BookingPayload extends BaseNotification {
  type:
    | "NEW_BOOKING"
    | "BOOKING_ACCEPTED"
    | "BOOKING_REJECTED"
    | "BOOKING_CANCELLED";
  data: {
    bookingId: string;
    customerId?: string;
    status?: string;
    url?: string;
    [key: string]: any;
  };
}

// Generic System Notification
export interface SystemPayload extends BaseNotification {
  type: "SYSTEM" | "REFERRAL_UPDATE" | string;
  data?: Record<string, any> & { url?: string };
}

// Union Type
export type NotificationItem =
  | ChatMessagePayload
  | BookingPayload
  | SystemPayload;

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  socket: any;
}
