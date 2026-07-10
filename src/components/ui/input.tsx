import * as React from "react";

import { cn } from "@/utils/clx";

// Define the props interface for the Input component, extending standard HTML input attributes
// Определяем интерфейс пропсов для компонента Input, расширяя стандартные атрибуты HTML input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Input component definition // Определение компонента Input
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Pass the input type (text, password, email, etc.) // Передаем тип ввода (text, password, email и т.д.)
        className={cn(
          // Base styles for the input element: flex, height, width, border, background, padding, text size, focus ring, disabled state, file input styling
          // Базовые стили для элемента input: flex, высота, ширина, граница, фон, паддинг, размер текста, кольцо фокуса, состояние disabled, стилизация файлового ввода
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className, // Apply custom classes // Применяем кастомные классы
        )}
        ref={ref} // Forward the ref // Перенаправляем ref
        {...props} // Spread remaining props // Распространяем остальные пропсы
      />
    );
  },
);
Input.displayName = "Input"; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Input component // Экспортируем компонент Input
export { Input };
