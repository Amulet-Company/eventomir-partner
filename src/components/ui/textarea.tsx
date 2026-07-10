import * as React from "react";

import { cn } from "@/utils/clx";

// Define the props interface for the Textarea component, extending standard HTML textarea attributes
// Определяем интерфейс пропсов для компонента Textarea, расширяя стандартные атрибуты HTML textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Textarea component definition // Определение компонента Textarea
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles: flex layout, min height, width, rounded corners, border, background, padding, text size (responsive), focus ring, disabled state
          // Базовые стили: flex расположение, минимальная высота, ширина, скругленные углы, граница, фон, паддинг, размер текста (адаптивный), кольцо фокуса, состояние disabled
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className, // Apply custom classes // Применяем кастомные классы
        )}
        ref={ref} // Forward the ref // Перенаправляем ref
        {...props} // Spread remaining props // Распространяем остальные пропсы
      />
    );
  },
);
Textarea.displayName = "Textarea"; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Textarea component // Экспортируем компонент Textarea
export { Textarea };
