'use client'; // Directive for client hook // Директива для клиентского хука

import * as React from 'react';

/**
 * Custom React hook to lock body scroll.
 * Prevents scrolling on the body element when the hook is active.
 *
 * Кастомный React хук для блокировки прокрутки body.
 * Предотвращает прокрутку элемента body, когда хук активен.
 */
export function useLockBody() {
  // UseLayoutEffect runs synchronously after DOM mutations, suitable for style changes
  // UseLayoutEffect выполняется синхронно после мутаций DOM, подходит для изменений стилей
  React.useLayoutEffect((): (() => void) => {
    // Get the original body overflow style // Получаем исходный стиль overflow для body
    const originalStyle: string = window.getComputedStyle(document.body).overflow;

    // Apply 'hidden' overflow style to lock scrolling
    // Применяем стиль overflow 'hidden' для блокировки прокрутки
    document.body.style.overflow = 'hidden';

    // Cleanup function: Restore the original overflow style when the component unmounts
    // Функция очистки: Восстанавливаем исходный стиль overflow при размонтировании компонента
    return () => (document.body.style.overflow = originalStyle);
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleanup on unmount // Пустой массив зависимостей гарантирует, что эффект выполняется только один раз при монтировании и очищается при размонтировании
}
