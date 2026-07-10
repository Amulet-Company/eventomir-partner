"use client";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { apiRequest } from "@/utils/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, User, Check, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  senderId: string | null;
  createdAt: string;
  status?: "sending" | "sent" | "error";
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  performerName: string;
  currentUserId: string;
  performerImage?: string;
}

export default function ChatDialog({
  isOpen,
  onClose,
  chatId,
  performerName,
  currentUserId,
  performerImage,
}: ChatDialogProps) {
  const { socket } = useSocket();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Full History ---
  useEffect(() => {
    if (isOpen && chatId && !chatId.startsWith("chat-temp")) {
      const initializeChat = async () => {
        setIsLoadingHistory(true);
        try {
          const data = await apiRequest<Message[]>({
            method: "get",
            url: `/api/chats/${chatId}/messages`,
          });
          setMessages(data.map((m) => ({ ...m, status: "sent" })));

          await apiRequest({
            method: "patch",
            url: `/api/chats/${chatId}/read`,
          });
        } catch (error) {
          console.error("Load Chat Error:", error);
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Не удалось загрузить историю сообщений",
          });
        } finally {
          setIsLoadingHistory(false);
        }
      };

      initializeChat();
    }
  }, [isOpen, chatId, toast]);

  // --- 2. Socket Listener (FIXED ECHO BUG) ---
  useEffect(() => {
    if (!socket || !chatId || chatId.startsWith("chat-temp")) return;

    socket.emit("join_chat", chatId);

    const handleReceiveMessage = (msg: any) => {
      if (msg.chatId === chatId) {
        // CRITICAL FIX: Ignore messages that WE just sent!
        if (msg.message.senderId === currentUserId) return;

        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.message.id)) return prev;
          return [...prev, { ...msg.message, status: "sent" }];
        });

        // Mark as read since we have the chat open
        apiRequest({ method: "patch", url: `/api/chats/${chatId}/read` }).catch(
          console.error,
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, chatId, currentUserId]);

  // --- 3. Scroll to Bottom ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // --- 4. Send Message ---
  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // OPTIMISTIC UPDATE: Adds the message instantly
    const optimisticMsg: Message = {
      id: tempId,
      content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setIsSending(true);

    try {
      const savedMsg = await apiRequest<Message>({
        method: "post",
        url: `/api/chats/${chatId}/messages`,
        data: { content },
      });

      // Swap the temp message for the real database message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...savedMsg, status: "sent" } : m,
        ),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "error" } : m)),
      );
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl bg-background">
        {/* Removed z-10, changed layout to flex-row, added pr-12 so the default 'X' button sits safely on top and is clickable */}
        <DialogHeader className=" px-6 py-4 border-b bg-secondary/20 flex flex-row items-center justify-between pr-12 text-left space-y-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={performerImage} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {performerName?.charAt(0).toUpperCase() || (
                  <User className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <DialogTitle className="text-base font-bold leading-none mb-1 text-foreground">
                {performerName}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-black/20">
          {isLoadingHistory ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2 mt-10">
              <div className="bg-muted p-4 rounded-full">
                <User className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm">История сообщений пуста</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg, index) => {
                const isMe =
                  msg.senderId !== null && msg.senderId === currentUserId;
                const prevMsg = messages[index - 1];
                const showDivider =
                  !prevMsg ||
                  !isSameDay(
                    new Date(prevMsg.createdAt),
                    new Date(msg.createdAt),
                  );

                return (
                  <div key={msg.id}>
                    {showDivider && (
                      <div className="flex justify-center my-6">
                        <span className="bg-muted px-3 py-1 rounded-full text-[10px] text-muted-foreground font-medium uppercase tracking-tighter shadow-sm border border-border/50">
                          {format(new Date(msg.createdAt), "d MMMM yyyy", {
                            locale: ru,
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div
                        className={`max-w-[85%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-[15px] shadow-sm ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-background dark:bg-zinc-900 border rounded-tl-none"
                          } ${msg.status === "error" ? "border-destructive border-2" : ""}`}
                        >
                          <p className="whitespace-pre-wrap leading-snug">
                            {msg.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-muted-foreground opacity-70 font-medium">
                            {format(new Date(msg.createdAt), "HH:mm")}
                          </span>
                          {isMe && (
                            <span className="text-muted-foreground">
                              {msg.status === "sending" ? (
                                <Clock className="h-3 w-3 animate-pulse" />
                              ) : msg.status === "error" ? (
                                <AlertCircle className="h-3 w-3 text-destructive" />
                              ) : (
                                <Check className="h-3 w-3 text-primary/70" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-3 border-t bg-background shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 rounded-full px-5 bg-muted/30 border-muted focus-visible:ring-1 focus-visible:bg-background transition-colors h-11"
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || isSending}
              className="rounded-full h-11 w-11 shrink-0 shadow-md transition-transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
