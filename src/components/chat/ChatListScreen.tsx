"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Loader2,
  MessageSquare,
  UserCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { clsx } from "clsx";
import { apiRequest } from "@/utils/api-client";

interface ChatSession {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  partnerImage: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
  isAdmin?: boolean;
}

export default function ChatListScreen({
  selectedChatId,
  onSelectChat,
}: {
  selectedChatId?: string;
  onSelectChat: (id: string, name: string) => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const socket = useChatStore((state) => state.socket);
  const refreshTrigger = useChatStore((state) => state.refreshTrigger);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const lastSeenMap = useChatStore((state) => state.lastSeenMap);
  const setOnlineStatusBulk = useChatStore(
    (state) => state.setOnlineStatusBulk,
  );
  const decreaseUnreadCount = useChatStore(
    (state) => state.decreaseUnreadCount,
  );

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const hasFetchedInitially = useRef(false);

  // 1. Optimized Data Fetching (Removed dangerous dependencies causing the loop)
  const fetchSessions = useCallback(
    async (isSilent = false) => {
      if (!userId) return;
      if (!isSilent) setLoading(true);

      try {
        let data = await apiRequest<ChatSession[]>({
          method: "GET",
          url: "/api/chats/sessions",
        });

        // Inject Administrator safely
        try {
          const admins = await apiRequest<any[]>({
            method: "GET",
            url: "/api/users?role=administrator",
          });

          if (admins && admins.length > 0) {
            const admin = admins[0];
            const adminExists = data.some((s) => s.partnerId === admin.id);

            if (!adminExists && admin.id !== userId) {
              data.unshift({
                id: `admin-${admin.id}`,
                partnerId: admin.id,
                partnerName: admin.name || "Поддержка (Администратор)",
                partnerRole: "administrator",
                partnerImage: admin.image || null,
                lastMessage: "Служба заботы о партнерах",
                lastMessageTime: new Date().toISOString(),
                unreadCount: 0,
                isOnline: false, // Will be updated globally if online
                isAdmin: true,
              });
            } else if (adminExists) {
              const adminIndex = data.findIndex(
                (s) => s.partnerId === admin.id,
              );
              data[adminIndex].isAdmin = true;
              const [adminSession] = data.splice(adminIndex, 1);
              data.unshift(adminSession);
            }
          }
        } catch (e) {
          console.error("Failed to fetch admin:", e);
        }

        const currentlyOnline: string[] = [];
        const lastSeenData: Record<string, string> = {};

        data.forEach((s) => {
          if (s.isOnline) currentlyOnline.push(s.partnerId);
          else if (s.lastSeen) lastSeenData[s.partnerId] = s.lastSeen;
        });

        setOnlineStatusBulk(currentlyOnline, lastSeenData);
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    },
    // FIXED: Removed onlineUsers from here. It is no longer a dependency.
    [userId, setOnlineStatusBulk],
  );

  // 2. Initial Fetch & Refresh Trigger (Safe)
  useEffect(() => {
    fetchSessions(hasFetchedInitially.current);
    hasFetchedInitially.current = true;
  }, [fetchSessions, refreshTrigger]);

  // 3. Socket Event Listeners
  useEffect(() => {
    if (!socket || !userId) return;
    const handleSilentRefresh = () => fetchSessions(true);

    socket.on("receive_message", handleSilentRefresh);
    socket.on("read_status_synced", handleSilentRefresh);

    return () => {
      socket.off("receive_message", handleSilentRefresh);
      socket.off("read_status_synced", handleSilentRefresh);
    };
  }, [socket, userId, fetchSessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) =>
      s.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sessions, searchQuery]);

  if (loading && sessions.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-b  z-10 shrink-0">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/40 hover:bg-muted/60 focus:bg-background rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all border border-border/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground pb-20">
            <MessageSquare className="w-10 h-10 opacity-20 mb-3" />
            <p className="text-sm font-medium">Чаты не найдены</p>
          </div>
        ) : (
          <div className="flex flex-col pb-6">
            {filteredSessions.map((chat) => (
              <ChatListItem
                key={chat.partnerId}
                chat={chat}
                isSelected={selectedChatId === chat.partnerId}
                isOnline={!!onlineUsers[chat.partnerId]}
                realTimeLastSeen={lastSeenMap[chat.partnerId]}
                onClick={() => {
                  decreaseUnreadCount(chat.unreadCount);
                  setSessions((prev) =>
                    prev.map((s) =>
                      s.partnerId === chat.partnerId
                        ? { ...s, unreadCount: 0 }
                        : s,
                    ),
                  );
                  onSelectChat(chat.partnerId, chat.partnerName);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// --- SUB-COMPONENT: CHAT ITEM ---
function ChatListItem({
  chat,
  isSelected,
  isOnline,
  realTimeLastSeen,
  onClick,
}: {
  chat: ChatSession;
  isSelected: boolean;
  isOnline: boolean;
  realTimeLastSeen?: string;
  onClick: () => void;
}) {
  const lastActive = realTimeLastSeen || chat.lastSeen || chat.lastMessageTime;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 p-3 mx-2 mt-1 rounded-xl transition-all cursor-pointer group",
        isSelected
          ? "bg-primary/10 hover:bg-primary/15"
          : "hover:bg-muted active:bg-muted",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={clsx(
            "w-12 h-12 rounded-full overflow-hidden transition-all shadow-sm",
            isOnline ? "ring-2 ring-green-500/50" : "bg-muted",
          )}
        >
          {chat.partnerImage ? (
            <img
              src={chat.partnerImage}
              className="w-full h-full object-cover"
              alt={chat.partnerName}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 bg-secondary">
              <UserCircle className="w-8 h-8" />
            </div>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="font-bold text-[15px] truncate flex items-center gap-1.5">
            <span
              className={clsx(
                isSelected
                  ? "text-primary"
                  : "text-foreground group-hover:text-primary transition-colors",
              )}
            >
              {chat.partnerName}
            </span>
            {chat.isAdmin && (
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            )}
          </h3>
          <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2">
            {lastActive ? format(new Date(lastActive), "HH:mm") : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p
            className={clsx(
              "text-[13px] truncate flex-1 leading-snug",
              chat.unreadCount > 0
                ? "text-foreground font-semibold"
                : "text-muted-foreground",
              chat.isAdmin && chat.unreadCount === 0 && "text-blue-600/70",
            )}
          >
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shrink-0 shadow-sm animate-in zoom-in">
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
