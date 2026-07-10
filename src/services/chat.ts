export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string; // 'system' for system messages
    senderName: string; // Added
    content: string;
    timestamp: Date;
}

export interface Chat {
    id: string;
    userIds: string[];
    createdAt: Date;
    // Can add lastMessageTimestamp field for sorting chats
}

// TODO: Replace with actual interaction with Firebase Firestore or another DB
let chats: Chat[] = [];
let messages: ChatMessage[] = [];
const userNames: Record<string, string> = {
    'cust456': 'Тестовый Заказчик', // Test Customer
    'perf123': 'Тест Исполнитель', // Test Performer
    'support-1': 'Мария Поддержкина', // Maria Supportkina
    'system': 'Система', // System
};

export const createOrGetChat = async (userId1: string, userId2: string): Promise<string> => {
    console.log(`Создание/получение чата между ${userId1} и ${userId2} (заглушка)...`); // Creating/getting chat between ${userId1} and ${userId2} (stub)...
    return new Promise((resolve) => {
        setTimeout(() => {
            const sortedUserIds = [userId1, userId2].sort();
            let existingChat = chats.find(chat =>
                chat.userIds.length === 2 &&
                chat.userIds.includes(sortedUserIds[0]) &&
                chat.userIds.includes(sortedUserIds[1])
            );

            if (existingChat) {
                resolve(existingChat.id);
            } else {
                const newChatId = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                const newChat: Chat = {
                    id: newChatId,
                    userIds: sortedUserIds,
                    createdAt: new Date(),
                };
                chats.push(newChat);
                resolve(newChatId);
            }
        }, 300);
    });
};

export const getMessages = async (chatId: string): Promise<ChatMessage[]> => {
    console.log(`Получение сообщений для чата ${chatId} (заглушка)...`); // Fetching messages for chat ${chatId} (stub)...
    return new Promise((resolve) => {
        setTimeout(() => {
            const chatMessages = messages
                .filter(msg => msg.chatId === chatId)
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            resolve([...chatMessages]);
        }, 200);
    });
};

export const sendMessage = async (chatId: string, senderId: string, content: string): Promise<ChatMessage> => {
    console.log(`Отправка сообщения в чат ${chatId} от ${senderId} (заглушка)...`); // Sending message to chat ${chatId} from ${senderId} (stub)...
    return new Promise((resolve) => {
        setTimeout(() => {
            const senderName = userNames[senderId] || `Пользователь ${senderId.substring(0, 4)}`;

            const newMessage: ChatMessage = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                chatId,
                senderId,
                senderName,
                content,
                timestamp: new Date(),
            };
            messages.push(newMessage);
            resolve(newMessage);
        }, 150);
    });
};

export const requestSupport = async (chatId: string, requesterId: string): Promise<void> => {
    console.log(`Запрос поддержки для чата ${chatId} от пользователя ${requesterId} (заглушка)...`); // Requesting support for chat ${chatId} from user ${requesterId} (stub)...
    // TODO: Implement logic to notify support service
    return new Promise((resolve) => {
        setTimeout(() => {
            const senderName = userNames[requesterId] || `Пользователь ${requesterId.substring(0, 4)}`;
            const supportMessage: ChatMessage = {
                id: `support-${Date.now()}`,
                chatId: chatId,
                senderId: 'system',
                senderName: 'Система',
                content: `Пользователь ${senderName} запросил помощь поддержки.`, // User ${senderName} requested support.
                timestamp: new Date(),
            };
            messages.push(supportMessage);
            resolve();
        }, 400);
    });
};


// --- Additional functions for support ---

export const assignSupportManager = async (requestId: string, managerId: string): Promise<void> => {
    console.log(`Назначение менеджера ${managerId} на запрос ${requestId} (заглушка)...`); // Assigning manager ${managerId} to request ${requestId} (stub)...
    // TODO: Find the request in DB and update assignedManagerId and status
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Менеджер ${managerId} назначен на запрос ${requestId}.`); // Manager ${managerId} assigned to request ${requestId}.
            resolve();
        }, 200);
    });
};

export const closeSupportRequest = async (requestId: string, managerId: string): Promise<void> => {
     console.log(`Закрытие запроса ${requestId} менеджером ${managerId} (заглушка)...`); // Closing request ${requestId} by manager ${managerId} (stub)...
     // TODO: Find the request in DB and update status to 'closed'
    return new Promise((resolve) => {
        setTimeout(() => {
             const chat = messages.find(m => m.id.startsWith(`support-${requestId.split('-')[2]}`));
             if (chat) {
                const managerName = userNames[managerId] || 'Менеджер';
                 const closeMessage: ChatMessage = {
                     id: `support-close-${Date.now()}`,
                     chatId: chat.chatId,
                     senderId: 'system',
                     senderName: 'Система',
                     content: `Менеджер ${managerName} завершил обработку вашего запроса.`, // Manager ${managerName} has finished processing your request.
                     timestamp: new Date(),
                 };
                 messages.push(closeMessage);
             }
            console.log(`Запрос ${requestId} закрыт.`); // Request ${requestId} closed.
            resolve();
        }, 250);
    });
};
