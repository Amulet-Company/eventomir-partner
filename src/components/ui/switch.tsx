"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/utils/clx";

// Switch component definition, wraps Radix UI Switch
// Определение компонента Switch, оборачивает Radix UI Switch
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  // Switch root element // Корневой элемент Switch
  <SwitchPrimitives.Root
    className={cn(
      // Base styles for the switch track: size, cursor, rounded corners, border, transition, focus ring, disabled state, checked/unchecked background colors
      // Базовые стили для трека переключателя: размер, курсор, скругленные углы, граница, переход, кольцо фокуса, состояние disabled, цвета фона в состояниях checked/unchecked
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
    ref={ref} // Forward the ref // Перенаправляем ref
  >
    {/* Switch thumb element (the sliding part) */}
    {/* Элемент ползунка переключателя (скользящая часть) */}
    <SwitchPrimitives.Thumb
      className={cn(
        // Base styles for the thumb: size, rounded corners, background, shadow, transition, checked/unchecked position
        // Базовые стили для ползунка: размер, скругленные углы, фон, тень, переход, позиция в состояниях checked/unchecked
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Switch component // Экспортируем компонент Switch
export { Switch };
