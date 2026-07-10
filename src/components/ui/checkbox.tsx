"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react"; // Check icon component // Компонент иконки галочки

import { cn } from "@/utils/clx";

// Checkbox component definition // Определение компонента Checkbox
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles for the checkbox: size, border, focus ring, disabled state, checked state styles
      // Базовые стили для чекбокса: размер, граница, кольцо фокуса, состояние disabled, стили состояния checked
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Indicator component (the check mark inside the checkbox) */}
    {/* Компонент индикатора (галочка внутри чекбокса) */}
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")} // Styles for centering the indicator // Стили для центрирования индикатора
    >
      <Check className="h-4 w-4" /> {/* Render the check icon */}{" "}
      {/* Рендерим иконку галочки */}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Checkbox component // Экспортируем компонент Checkbox
export { Checkbox };
