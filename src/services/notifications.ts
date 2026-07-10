// "use client";

// export interface Notification {
//   id: string;
//   userId: string;
//   title: string;
//   message: string;
//   link?: string;
//   read: boolean;
//   createdAt: Date;
//   type?: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'request' | 'review' | 'profile' | 'subscription' | 'admin';
// }

// // TODO: Replace with actual interaction with Firebase Firestore or another DB
// let notificationsStore: Notification[] = [
//     {
//         id: 'notif-admin-1',
//         userId: 'admin-user-id',
//         title: 'Новый исполнитель', // New Performer
//         message: 'Зарегистрировался новый исполнитель: Тест Исполнитель (perf123).', // New performer registered: Test Performer (perf123).
//         link: '/admin?section=performers',
//         read: false,
//         createdAt: new Date(2024, 7, 15, 10, 0),
//         type: 'admin',
//     },
//     {
//         id: 'notif-admin-2',
//         userId: 'admin-user-id',
//         title: 'Изменение профиля', // Profile Change
//         message: 'Исполнитель Тест Исполнитель изменил свой профиль. Требуется модерация.', // Performer Test Performer updated their profile. Moderation required.
//         link: '/admin#moderation',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 12, 0),
//         type: 'admin',
//     },
//      {
//         id: 'notif-admin-3',
//         userId: 'admin-user-id',
//         title: 'Новая работа в галерее', // New Gallery Work
//         message: 'Исполнитель Тест Исполнитель добавил новую работу в галерею. Требуется модерация.', // Performer Test Performer added a new work to the gallery. Moderation required.
//         link: '/admin#moderation',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 14, 0),
//         type: 'admin',
//     },
//     {
//         id: 'notif-perf-1',
//         userId: 'perf123',
//         title: 'Новый запрос на бронирование', // New Booking Request
//         message: 'Иван Петров запрашивает бронь на 5 Сентября 2024.', // Ivan Petrov requests a booking for September 5, 2024.
//         link: '/performer-profile#bookings',
//         read: false,
//         createdAt: new Date(2024, 7, 15, 11, 30),
//         type: 'booking',
//     },
//     {
//         id: 'notif-perf-2',
//         userId: 'perf123',
//         title: 'Новый отзыв', // New Review
//         message: 'Анна К. оставила отзыв о вашей работе.', // Anna K. left a review about your work.
//         link: '/performer-profile#reviews',
//         read: true,
//         createdAt: new Date(2024, 7, 14, 18, 0),
//         type: 'review',
//     },
//      {
//         id: 'notif-perf-3',
//         userId: 'perf123',
//         title: 'Новый платный запрос', // New Paid Request
//         message: 'Появился новый запрос на Фотографа в г. Москва.', // A new request for a Photographer in Moscow has appeared.
//         link: '/performer-profile#requests',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 9, 0),
//         type: 'request',
//     },
//      {
//         id: 'notif-perf-4',
//         userId: 'perf123',
//         title: 'Профиль одобрен', // Profile Approved
//         message: 'Ваш профиль успешно прошел модерацию!', // Your profile has been successfully moderated!
//         link: '/performer-profile',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 16, 0),
//         type: 'success',
//     },
//      {
//         id: 'notif-perf-5',
//         userId: 'perf123',
//         title: 'Работа отклонена', // Work Rejected
//         message: 'Ваша работа "Свадебная фотосессия у озера" отклонена. Причина: Низкое качество.', // Your work "Wedding Photoshoot by the Lake" was rejected. Reason: Low quality.
//         link: '/performer-profile#gallery',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 17, 0),
//         type: 'error',
//     },
//     {
//         id: 'notif-cust-1',
//         userId: 'cust456',
//         title: 'Запрос подтвержден', // Request Confirmed
//         message: 'Исполнитель Тест Исполнитель подтвердил ваш запрос на 10 Сентября 2024.', // Performer Test Performer confirmed your request for September 10, 2024.
//         link: '/customer-profile#orders',
//         read: false,
//         createdAt: new Date(2024, 7, 15, 14, 0),
//         type: 'booking',
//     },
//      {
//         id: 'notif-cust-2',
//         userId: 'cust456',
//         title: 'Новое сообщение', // New Message
//         message: 'У вас новое сообщение от Тест Исполнитель.', // You have a new message from Test Performer.
//         link: '/chat?chatId=chat-example-id',
//         read: false,
//         createdAt: new Date(2024, 7, 16, 11, 0),
//         type: 'info',
//     },
// ];

// export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> => {
//     console.log(`Создание уведомления для ${notificationData.userId} (заглушка): "${notificationData.title}"`); // Creating notification for ${notificationData.userId} (stub): "${notificationData.title}"

//     // TODO: Implement sending Email/Push notifications here
//     // if (shouldSendEmail(notificationData.type)) {
//     //   await sendEmailNotification(notificationData.userId, notificationData.title, notificationData.message);
//     // }
//     // if (shouldSendPush(notificationData.type)) {
//     //   await sendPushNotification(notificationData.userId, notificationData.title, notificationData.message);
//     // }

//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const newNotification: Notification = {
//                 ...notificationData,
//                 id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
//                 createdAt: new Date(),
//                 read: false,
//             };
//             notificationsStore.push(newNotification);
//             resolve(newNotification);
//         }, 100);
//     });
// };

// // TODO: Replace with actual integration with services
// const sendEmailNotification = async (userId: string, subject: string, body: string) => {
//     console.log(`--- Имитация Email ---`); // --- Email Simulation ---
//     console.log(`Кому: ${userId}`); // To:
//     console.log(`Тема: ${subject}`); // Subject:
//     console.log(`Тело: ${body}`); // Body:
//     console.log(`---------------------`);
//     await new Promise(res => setTimeout(res, 100));
// };

// const sendPushNotification = async (userId: string, title: string, body: string) => {
//     console.log(`--- Имитация Push ---`); // --- Push Simulation ---
//     console.log(`Кому: ${userId}`); // To:
//     console.log(`Заголовок: ${title}`); // Title:
//     console.log(`Тело: ${body}`); // Body:
//     console.log(`-------------------`);
//     await new Promise(res => setTimeout(res, 100));
// };

// export const getNotifications = async (userId: string): Promise<Notification[]> => {
//     console.log(`Получение уведомлений для ${userId} (заглушка)...`); // Fetching notifications for ${userId} (stub)...
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const userNotifications = notificationsStore
//                 .filter(notif => notif.userId === userId)
//                 .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
//             resolve([...userNotifications]);
//         }, 300);
//     });
// };

// export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
//     console.log(`Пометка уведомления ${notificationId} как прочитанного для ${userId} (заглушка)...`); // Marking notification ${notificationId} as read for ${userId} (stub)...
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const notificationIndex = notificationsStore.findIndex(n => n.id === notificationId && n.userId === userId);
//             if (notificationIndex !== -1) {
//                 notificationsStore[notificationIndex].read = true;
//                 resolve();
//             } else {
//                 console.warn(`Уведомление ${notificationId} не найдено для пользователя ${userId} или уже прочитано.`); // Notification ${notificationId} not found for user ${userId} or already read.
//                 resolve();
//                 // reject(new Error("Уведомление не найдено или у вас нет прав")); // Notification not found or you don't have permissions
//             }
//         }, 150);
//     });
// };

// export const markAllAsRead = async (userId: string): Promise<void> => {
//     console.log(`Пометка всех уведомлений как прочитанных для ${userId} (заглушка)...`); // Marking all notifications as read for ${userId} (stub)...
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             notificationsStore = notificationsStore.map(n =>
//                 n.userId === userId ? { ...n, read: true } : n
//             );
//             resolve();
//         }, 200);
//     });
// };

// // TODO: Add function to delete notifications (if necessary)
// // export const deleteNotification = async (notificationId: string, userId: string): Promise<void> => { ... };

import { apiRequest } from "@/utils/api-client";

export interface NotificationItem {
  id: string;
  type: string; // 'BOOKING_REQUEST', 'BOOKING_UPDATE', etc.
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (
  userId: string,
): Promise<NotificationItem[]> => {
  // Note: userId is usually handled by the backend via token,
  // but we keep the signature if you use it for other logic.
  return await apiRequest<NotificationItem[]>({
    method: "get",
    url: "/api/notifications",
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await apiRequest({
    method: "patch",
    url: `/api/notifications/${notificationId}/read`,
  });
};

export const markAllNotificationsAsRead = async () => {
  return await apiRequest({
    method: "patch",
    url: `/api/notifications/read-all`,
  });
};
