import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "./useChatHistory";

export const useChatSocketSync = (
  socket: any,
  userId: string,
  partnerId: string,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !userId) return;

    // 1. RECEIVE NEW MESSAGE
    const handleReceiveMessage = (newMessage: ChatMessage) => {
      if (newMessage.senderId === partnerId || newMessage.senderId === userId) {
        queryClient.setQueryData(["chatHistory", partnerId], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const messageExists = oldData.pages.some((page: ChatMessage[]) =>
            page.some(
              (m) =>
                m.id === newMessage.id ||
                (m.tempId && m.tempId === newMessage.tempId),
            ),
          );
          if (messageExists) return oldData;

          const newPages = [...oldData.pages];

          // FIX: Handle case where pages array is empty
          if (newPages.length === 0) {
            newPages.push([newMessage]);
          } else {
            const lastIdx = newPages.length - 1;
            newPages[lastIdx] = [...newPages[lastIdx], newMessage];
          }

          return { ...oldData, pages: newPages };
        });

        if (newMessage.senderId === partnerId) {
          socket.emit("mark_messages_read", {
            readerId: userId,
            senderId: partnerId,
          });
        }
      }
    };

    // 2. CONFIRM SENT MESSAGE
    const handleMessageConfirmed = (confirmData: {
      tempId: string;
      message: ChatMessage;
    }) => {
      queryClient.setQueryData(["chatHistory", partnerId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: ChatMessage[]) =>
            page.map((m) => {
              if (m.tempId === confirmData.tempId) {
                if (m.imageUrl && m.imageUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(m.imageUrl); // Cleanup memory
                }
                return confirmData.message;
              }
              return m;
            }),
          ),
        };
      });
    };

    // 3. MESSAGE DELETED (NEW: Hides message if partner deletes it)
    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData(["chatHistory", partnerId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: ChatMessage[]) =>
            page.filter((m) => m.id !== messageId),
          ),
        };
      });
    };

    // 4. MESSAGES READ (NEW: Turns grey ticks to blue double-ticks)
    const handleMessagesRead = ({ readerId }: { readerId: string }) => {
      if (readerId === partnerId) {
        queryClient.setQueryData(["chatHistory", partnerId], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: ChatMessage[]) =>
              page.map((m) =>
                m.senderId === userId && !m.isRead
                  ? { ...m, isRead: true } // Update to read
                  : m,
              ),
            ),
          };
        });
      }
    };

    // Register Listeners
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_confirmed", handleMessageConfirmed);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("messages_read_by_recipient", handleMessagesRead);

    // Cleanup Listeners on unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_confirmed", handleMessageConfirmed);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("messages_read_by_recipient", handleMessagesRead);
    };
  }, [partnerId, socket, userId, queryClient]);
};
