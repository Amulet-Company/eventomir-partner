"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils/clx";

// Accordion root component
// Корневой компонент аккордеона
const Accordion = AccordionPrimitive.Root;

// Accordion item component
// Компонент элемента аккордеона
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)} // Apply base and custom classes // Применяем базовые и кастомные классы
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem"; // Set display name for debugging // Устанавливаем имя для отладки

// Accordion trigger component (the clickable header)
// Компонент триггера аккордеона (кликабельный заголовок)
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", // Base styles and open state rotation // Базовые стили и поворот при открытии
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props}
    >
      {children} {/* The content of the trigger (usually text) */}{" "}
      {/* Содержимое триггера (обычно текст) */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />{" "}
      {/* Down arrow icon */} {/* Иконка стрелки вниз */}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName; // Set display name // Устанавливаем имя

// Accordion content component (the collapsible content area)
// Компонент содержимого аккордеона (сворачиваемая область контента)
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", // Base styles and animations // Базовые стили и анимации
      className, // Apply className here for external styling // Применяем className здесь для внешней стилизации
    )}
    {...props}
  >
    {/* Wrap children in a div to apply padding consistently */}
    {/* Оборачиваем дочерние элементы в div для последовательного применения отступов */}
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
