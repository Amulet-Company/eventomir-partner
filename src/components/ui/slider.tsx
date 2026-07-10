"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/utils/clx";

// Slider component definition, wraps Radix UI Slider
// Определение компонента Slider, оборачивает Radix UI Slider
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  // Slider root element // Корневой элемент Slider
  <SliderPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles for the slider container: flex layout, touch behavior, selection, alignment // Базовые стили для контейнера слайдера: flex расположение, поведение касания, выделение, выравнивание
      "relative flex w-full touch-none select-none items-center",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Slider track element (the background line) */}
    {/* Элемент трека слайдера (фоновая линия) */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      {/* Slider range element (the filled part of the track) */}
      {/* Элемент диапазона слайдера (заполненная часть трека) */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* Ensure Thumb is rendered for each value in the array (for range sliders) */}
    {/* Убеждаемся, что Thumb рендерится для каждого значения в массиве (для слайдеров диапазона) */}
    {(Array.isArray(props.value) ? props.value : [props.value || 0]).map(
      (_, i) => (
        // Slider thumb element (the draggable handle) // Элемент ползунка слайдера (перетаскиваемый маркер)
        <SliderPrimitive.Thumb
          key={i} // Unique key for each thumb // Уникальный ключ для каждого ползунка
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        /> // Styles for the thumb // Стили для ползунка
      ),
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Slider component // Экспортируем компонент Slider
export { Slider };
