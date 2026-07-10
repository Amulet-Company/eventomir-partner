import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/utils/clx";

// Separator component definition, wraps Radix UI Separator
// Определение компонента Separator, оборачивает Radix UI Separator
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> // Props type // Тип пропсов
>(
  (
    // Destructure props, setting defaults for orientation and decorative
    // Деструктурируем пропсы, устанавливая значения по умолчанию для orientation и decorative
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref} // Forward the ref // Перенаправляем ref
      decorative={decorative} // Indicate if the separator is decorative (for accessibility) // Указываем, является ли разделитель декоративным (для доступности)
      orientation={orientation} // Set the orientation (horizontal or vertical) // Устанавливаем ориентацию (горизонтальная или вертикальная)
      className={cn(
        "shrink-0 bg-border", // Base styles: prevent shrinking, background color // Базовые стили: предотвращение сжатия, цвет фона
        // Orientation-specific styles for height/width // Стили для конкретной ориентации для высоты/ширины
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Separator component // Экспортируем компонент Separator
export { Separator };
