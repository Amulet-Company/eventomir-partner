// Export all hooks from this directory
// This allows importing hooks from a single location:
// import { useIsMobile, useToast } from '@/hooks';
// Экспорт всех хуков из этой директории
// Это позволяет импортировать хуки из одного места:
// import { useIsMobile, useToast } from '@/hooks';

export * from './use-mobile'; // Hook to detect mobile devices // Хук для определения мобильных устройств
export * from './use-toast'; // Hook for managing toast notifications // Хук для управления всплывающими уведомлениями
