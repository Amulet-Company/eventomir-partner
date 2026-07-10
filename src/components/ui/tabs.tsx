"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/clx";

// Tabs root component // Корневой компонент Tabs
const Tabs = TabsPrimitive.Root;

// TabsList component (container for the triggers) // Компонент TabsList (контейнер для триггеров)
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex layout, height, alignment, rounded corners, background, padding, text color // Базовые стили: flex расположение, высота, выравнивание, скругленные углы, фон, паддинг, цвет текста
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
TabsList.displayName = TabsPrimitive.List.displayName; // Set display name // Устанавливаем имя

// TabsTrigger component (the clickable tab header) // Компонент TabsTrigger (кликабельный заголовок вкладки)
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex layout, alignment, whitespace, rounded corners, padding, text style, focus ring, transition, disabled state, active state styles
      // Базовые стили: flex расположение, выравнивание, перенос текста, скругленные углы, паддинг, стиль текста, кольцо фокуса, переход, состояние disabled, стили активного состояния
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName; // Set display name // Устанавливаем имя

// TabsContent component (the content panel associated with a trigger) // Компонент TabsContent (панель содержимого, связанная с триггером)
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: margin top, focus ring // Базовые стили: отступ сверху, кольцо фокуса
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export { Tabs, TabsList, TabsTrigger, TabsContent };
