"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import ChatListScreen from "@/components/chat/ChatListScreen";
import ChatDetailScreen from "@/components/chat/ChatDetailScreen";
import { clsx } from "clsx";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // State to manage the currently selected chat in the split-pane
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Zustand Store
  const connectSocket = useChatStore((state) => state.connectSocket);
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  const userId = session?.user?.id;

  // 🚨 FIX 1: Connection Effect (Strictly depends ONLY on auth status & userId)
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (userId) {
      connectSocket(userId);
      setIsReady(true);
    }
  }, [status, userId, router, connectSocket]);

  // 🚨 FIX 2: Active Chat Effect (Strictly separated from the socket connection)
  useEffect(() => {
    if (isReady) {
      setActiveChat(selectedChat?.id || null);
    }
  }, [selectedChat, setActiveChat, isReady]);

  if (!isReady || status === "loading") {
    return (
      <div className="flex flex-col h-screen pt-16 items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-10 h-10 mb-4" />
        <p className="text-muted-foreground font-medium">Загрузка чатов...</p>
      </div>
    );
  }

  return (
    // 🚨 DESIGN FIX: Added pt-[4rem] (mobile) and sm:pt-[6rem] (desktop) to clear the fixed ClientHeader
    // Wrapped in a subtle muted background on desktop to make the chat card "pop"
    <div className="flex h-[100dvh] pt-[4rem] sm:pt-[5.5rem] sm:pb-6 px-0 sm:px-4 w-full bg-background sm:bg-muted/10 justify-center">
      {/* The main chat container */}
      <div className="flex w-full max-w-6xl h-full bg-background sm:rounded-2xl sm:border sm:border-border/50  overflow-hidden">
        {/* LEFT PANE: Chat List */}
        <div
          className={clsx(
            "w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-border/50 bg-card flex flex-col",
            selectedChat ? "hidden md:flex" : "flex",
          )}
        >
          {/* Because the Backend injects the Admin, ChatListScreen can just render data natively without hacking it */}
          <ChatListScreen
            selectedChatId={selectedChat?.id}
            onSelectChat={(id, name) => setSelectedChat({ id, name })}
          />
        </div>

        {/* RIGHT PANE: Chat Detail */}
        <div
          className={clsx(
            "flex-1 flex flex-col bg-background/50 relative",
            !selectedChat ? "hidden md:flex" : "flex",
          )}
        >
          {selectedChat ? (
            <ChatDetailScreen
              partnerId={selectedChat.id}
              partnerName={selectedChat.name}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-60 bg-slate-50/50 dark:bg-black/20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-xl font-bold text-foreground">Выберите чат</p>
              <p className="text-sm mt-1">чтобы начать общение</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
