import { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api-client";
import { useSocket } from "@/components/providers/SocketProvider";

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const { socket } = useSocket();

  const fetchCount = async () => {
    try {
      const data = await apiRequest<{ count: number }>({
        method: "get",
        url: "/api/chats/unread-count",
      });
      setCount(data.count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCount();

    if (!socket) return;

    const handleNewMsg = () => fetchCount(); // Refetch when a new message arrives
    socket.on("receive_message", handleNewMsg);

    return () => {
      socket.off("receive_message", handleNewMsg);
    };
  }, [socket]);

  return { count, refresh: fetchCount };
}
