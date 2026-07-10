"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/utils/clx";

// TooltipProvider component (provides context for tooltips) // Компонент TooltipProvider (предоставляет контекст для всплывающих подсказок)
const TooltipProvider = TooltipPrimitive.Provider;

// Tooltip root component // Корневой компонент Tooltip
const Tooltip = TooltipPrimitive.Root;

// Tooltip trigger component (the element that triggers the tooltip on hover/focus) // Компонент триггера Tooltip (элемент, который вызывает всплывающую подсказку при наведении/фокусе)
const TooltipTrigger = TooltipPrimitive.Trigger;

// Tooltip content component (the actual tooltip popup) // Компонент содержимого Tooltip (сама всплывающая подсказка)
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> // Props type // Тип пропсов
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    {" "}
    {/* Render content within the portal */}{" "}
    {/* Рендерим контент внутри портала */}
    <TooltipPrimitive.Content
      ref={ref} // Forward the ref // Перенаправляем ref
      sideOffset={sideOffset} // Offset from the trigger element // Смещение от элемента триггера
      className={cn(
        // Base styles: z-index, overflow, border, background, padding, text style, shadow, animations // Базовые стили: z-index, переполнение, граница, фон, паддинг, стиль текста, тень, анимации
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Export the Tooltip components // Экспортируем компоненты Tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
