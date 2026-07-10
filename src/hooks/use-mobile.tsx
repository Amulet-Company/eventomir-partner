"use client" // Client hook directive // Директива для клиентского хука

import * as React from "react"

// Threshold for defining a mobile device (in pixels)
// Пороговое значение для определения мобильного устройства (в пикселях)
const MOBILE_BREAKPOINT = 768

// Hook to determine if the current device is mobile
// Хук для определения, является ли текущее устройство мобильным
export function useIsMobile() {
  // State to store mobile status (undefined until determined)
  // Состояние для хранения информации о мобильном устройстве (undefined до определения)
  // Initialize state to undefined to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // This code runs only on the client after hydration
    // Этот код выполняется только на клиенте после гидратации
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`) // Media query // Медиа-запрос

    // Callback function on media query match change
    // Функция обратного вызова при изменении совпадения медиа-запроса
    const onChange = () => {
      // Update state based on current window width
      // Обновляем состояние в зависимости от текущей ширины окна
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add listener for change event
    // Добавляем слушатель события изменения
    mql.addEventListener("change", onChange)

    // Set initial value on component mount (after first client render)
    // Устанавливаем начальное значение при монтировании компонента (после первой отрисовки на клиенте)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function: remove listener on component unmount
    // Функция очистки: удаляем слушатель при размонтировании компонента
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array means the effect runs once on mount // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

  // Return undefined during SSR and initial client render
  // Возвращаем undefined во время SSR и начального рендера на клиенте
  // Return the boolean value once determined on the client
  // Возвращаем булево значение после определения на клиенте
  return isMobile;
}