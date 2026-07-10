"use client"; // Directive for client hook

import * as React from "react";

/**
 * Custom React hook to track the state of a CSS media query.
 * Returns true if the media query matches, false otherwise.
 * Handles server-side rendering gracefully by returning false initially.
 *
 * Кастомный React хук для отслеживания состояния CSS медиа-запроса.
 * Возвращает true, если медиа-запрос совпадает, иначе false.
 * Корректно обрабатывает рендеринг на стороне сервера, возвращая false изначально.
 *
 * @param {string} query - The CSS media query string to match (e.g., '(min-width: 768px)').
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
export function useMediaQuery(query: string): boolean {
  // FIXED: Added closing bracket ']' and removed '=' inside destructuring
  const [value, setValue] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Function to update the state based on the media query match
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    // Create a MediaQueryList object
    const result = window.matchMedia(query);

    // Add listener for changes in the media query match state
    result.addEventListener("change", onChange);

    // Set the initial state based on the current match status
    setValue(result.matches);

    // Cleanup function: remove the listener when the component unmounts
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
