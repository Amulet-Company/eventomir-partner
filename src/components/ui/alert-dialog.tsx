"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/utils/clx";
import { buttonVariants } from "@/components/ui/button";

// AlertDialog root component
// Корневой компонент AlertDialog
const AlertDialog = AlertDialogPrimitive.Root;

// AlertDialog trigger component (usually a button)
// Компонент триггера AlertDialog (обычно кнопка)
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

// AlertDialog portal component (renders content outside the normal DOM flow)
// Компонент портала AlertDialog (рендерит контент вне обычного потока DOM)
const AlertDialogPortal = AlertDialogPrimitive.Portal;

// AlertDialog overlay component (the semi-transparent background)
// Компонент оверлея AlertDialog (полупрозрачный фон)
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", // Base styles and animations // Базовые стили и анимации
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName; // Set display name // Устанавливаем имя

// AlertDialog content component (the main dialog window)
// Компонент содержимого AlertDialog (основное диалоговое окно)
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    {" "}
    {/* Render content within the portal */}{" "}
    {/* Рендерим контент внутри портала */}
    <AlertDialogOverlay /> {/* Render the overlay */} {/* Рендерим оверлей */}
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", // Base styles, positioning, and animations // Базовые стили, позиционирование и анимации
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// AlertDialog header component // Компонент заголовка AlertDialog
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left", // Base styles // Базовые стили
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader"; // Set display name // Устанавливаем имя

// AlertDialog footer component (typically contains action buttons)
// Компонент футера AlertDialog (обычно содержит кнопки действий)
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", // Base styles for layout and spacing // Базовые стили для расположения и отступов
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter"; // Set display name // Устанавливаем имя

// AlertDialog title component // Компонент заголовка AlertDialog
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)} // Base styles // Базовые стили
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName; // Set display name // Устанавливаем имя

// AlertDialog description component // Компонент описания AlertDialog
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Base styles // Базовые стили
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName; // Set display name // Устанавливаем имя

// AlertDialog action button component (confirms the action)
// Компонент кнопки действия AlertDialog (подтверждает действие)
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)} // Apply button styles // Применяем стили кнопки
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName; // Set display name // Устанавливаем имя

// AlertDialog cancel button component (cancels the action)
// Компонент кнопки отмены AlertDialog (отменяет действие)
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }), // Apply outline button styles // Применяем стили кнопки outline
      "mt-2 sm:mt-0", // Margin top for spacing // Отступ сверху для spacing
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
