import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { apiRequest } from "@/utils/api-client";

interface ChatState {
  socket: Socket | null;
  totalUnreadCount: number;
  onlineUsers: Record<string, boolean>;
  lastSeenMap: Record<string, string>;
  activeChatId: string | null;
  refreshTrigger: number;
  typingUser: string | null;

  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  syncUnreadCount: () => Promise<void>;
  setOnlineStatusBulk: (
    onlineIds: string[],
    lastSeenData: Record<string, string>,
  ) => void;
  setActiveChat: (partnerId: string | null) => void;
  decreaseUnreadCount: (amount: number) => void;
}

const playNotificationSound = () => {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/notification.wav");
    audio.play().catch(() => console.log("Audio playback blocked."));
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  totalUnreadCount: 0,
  onlineUsers: {},
  lastSeenMap: {},
  activeChatId: null,
  refreshTrigger: 0,
  typingUser: null,

  connectSocket: (userId: string) => {
    const existingSocket = get().socket;

    if (existingSocket) {
      if (existingSocket.connected) return;
      existingSocket.disconnect();
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8800";

    const socket = io(API_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: { userId },
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected");
      get().syncUnreadCount();
    });

    socket.on("online_users_list", (onlineArray: string[]) => {
      const onlineMap: Record<string, boolean> = {};
      onlineArray.forEach((id) => {
        onlineMap[id] = true;
      });
      set({ onlineUsers: onlineMap });
    });

    socket.on("receive_message", (newMessage) => {
      if (get().activeChatId !== newMessage.senderId) {
        get().syncUnreadCount();
        playNotificationSound();
        if ("vibrate" in navigator) navigator.vibrate([200]);
      }
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
    });

    socket.on("messages_read_by_recipient", () =>
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
    );
    socket.on("read_status_synced", () => {
      get().syncUnreadCount();
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
    });
    socket.on("message_deleted", () =>
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
    );

    socket.on(
      "user_status_changed",
      ({ userId: changedUserId, isOnline, lastSeen }) => {
        set((state) => {
          // Prevent unnecessary re-renders if status hasn't changed
          if (isOnline && state.onlineUsers[changedUserId]) return state;
          if (
            !isOnline &&
            !state.onlineUsers[changedUserId] &&
            state.lastSeenMap[changedUserId] === lastSeen
          )
            return state;

          const newOnlineUsers = { ...state.onlineUsers };
          const newLastSeenMap = { ...state.lastSeenMap };

          if (isOnline) {
            newOnlineUsers[changedUserId] = true;
            delete newLastSeenMap[changedUserId];
          } else {
            delete newOnlineUsers[changedUserId];
            if (lastSeen) newLastSeenMap[changedUserId] = lastSeen;
          }

          return { onlineUsers: newOnlineUsers, lastSeenMap: newLastSeenMap };
        });
      },
    );

    socket.on("user_typing", ({ senderId }) => {
      if (get().activeChatId === senderId) set({ typingUser: senderId });
    });

    socket.on("user_stopped_typing", () => set({ typingUser: null }));

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({
      socket: null,
      totalUnreadCount: 0,
      onlineUsers: {},
      lastSeenMap: {},
      typingUser: null,
      activeChatId: null,
    });
  },

  setOnlineStatusBulk: (
    onlineIds: string[],
    lastSeenData: Record<string, string>,
  ) => {
    const onlineMap: Record<string, boolean> = {};
    onlineIds.forEach((id) => {
      onlineMap[id] = true;
    });
    set({ onlineUsers: onlineMap, lastSeenMap: lastSeenData });
  },

  syncUnreadCount: async () => {
    try {
      const data = await apiRequest<{ totalUnread?: number; count?: number }>({
        method: "GET",
        url: "/api/chats/unread-count",
      });
      set({ totalUnreadCount: data.totalUnread || data.count || 0 });
    } catch (error) {
      console.error("❌ Error syncing unread count:", error);
    }
  },

  setActiveChat: (partnerId: string | null) => {
    if (get().activeChatId === partnerId) return;
    set({ activeChatId: partnerId, typingUser: null });
  },

  decreaseUnreadCount: (amount: number) => {
    set((state) => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount - amount),
    }));
  },
}));
