"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/utils/clx";

// Popover root component // Корневой компонент Popover
const Popover = PopoverPrimitive.Root;

// Popover trigger component (usually a button) // Компонент триггера Popover (обычно кнопка)
const PopoverTrigger = PopoverPrimitive.Trigger;

// Popover content component (the panel that pops up) // Компонент содержимого Popover (панель, которая всплывает)
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> // Props type // Тип пропсов
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    {" "}
    {/* Render content within the portal */}{" "}
    {/* Рендерим контент внутри портала */}
    <PopoverPrimitive.Content
      ref={ref} // Forward the ref // Перенаправляем ref
      align={align} // Alignment relative to the trigger // Выравнивание относительно триггера
      sideOffset={sideOffset} // Смещение от триггера
      className={cn(
        // Base styles: z-index, width, border, background, padding, text style, shadow, animations // Базовые стили: z-index, ширина, граница, фон, паддинг, стиль текста, тень, анимации
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export { Popover, PopoverTrigger, PopoverContent };
