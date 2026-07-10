"use client"; // Directive for client hook

import * as React from "react";

/**
 * Custom React hook to check if the component is mounted.
 * Returns true after the component has mounted on the client-side.
 * Useful for avoiding hydration errors by conditionally rendering client-only content.
 *
 * Кастомный React хук для проверки, смонтирован ли компонент.
 * Возвращает true после того, как компонент смонтирован на стороне клиента.
 * Полезен для избежания ошибок гидратации путем условного рендеринга контента только на клиенте.
 *
 * @returns {boolean} - True if the component is mounted, false otherwise (during SSR or before mount).
 */
export function useMounted(): boolean {
  // FIXED: Added closing ']' and moved '=' outside
  const [mounted, setMounted] = React.useState<boolean>(false);

  // Effect runs only once after the initial render on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
