"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/utils/clx";

// Progress component definition // Определение компонента Progress
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> // Props type // Тип пропсов
>(({ className, value, ...props }, ref) => (
  // Progress root element // Корневой элемент Progress
  <ProgressPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles for the progress bar container: height, width, overflow, rounded corners, background color
      // Базовые стили для контейнера индикатора выполнения: высота, ширина, переполнение, скругленные углы, цвет фона
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Progress indicator element (the filled part) */}
    {/* Элемент индикатора выполнения (заполненная часть) */}
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all" // Styles for the indicator: height, width, background, transition
      // Стили для индикатора: высота, ширина, фон, переход
      // Apply inline style to control the width based on the 'value' prop
      // Применяем инлайновый стиль для управления шириной на основе пропса 'value'
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Progress component // Экспортируем компонент Progress
export { Progress };
