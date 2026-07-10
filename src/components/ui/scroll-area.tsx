"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/utils/clx";

// ScrollArea root component, wraps the content that needs scrolling
// Корневой компонент ScrollArea, оборачивает контент, который нужно прокручивать
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> // Props type // Тип пропсов
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("relative overflow-hidden", className)} // Base styles: relative positioning, hide overflow // Базовые стили: относительное позиционирование, скрытие переполнения
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Viewport component: The scrollable container */}
    {/* Компонент Viewport: Прокручиваемый контейнер */}
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children} {/* Render the scrollable content */}{" "}
      {/* Рендерим прокручиваемый контент */}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar /> {/* Render the scrollbar */} {/* Рендерим полосу прокрутки */}
    <ScrollAreaPrimitive.Corner />{" "}
    {/* Render the corner piece where scrollbars meet */}{" "}
    {/* Рендерим уголок, где встречаются полосы прокрутки */}
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName; // Set display name // Устанавливаем имя

// ScrollBar component // Компонент ScrollBar
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> // Props type // Тип пропсов
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref} // Forward the ref // Перенаправляем ref
    orientation={orientation} // Set the orientation (vertical or horizontal) // Устанавливаем ориентацию (вертикальная или горизонтальная)
    className={cn(
      // Base styles: flex layout, touch/select behavior, transition // Базовые стили: flex расположение, поведение касания/выделения, переход
      "flex touch-none select-none transition-colors",
      // Orientation-specific styles // Стили для конкретной ориентации
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]", // Vertical styles // Вертикальные стили
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]", // Horizontal styles // Горизонтальные стили
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Thumb component (the draggable part of the scrollbar) */}
    {/* Компонент Thumb (перетаскиваемая часть полосы прокрутки) */}
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export { ScrollArea, ScrollBar };
