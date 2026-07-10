"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Close icon component // Компонент иконки закрытия

import { cn } from "@/utils/clx";

// Dialog root component // Корневой компонент Dialog
const Dialog = DialogPrimitive.Root;

// Dialog trigger component (usually a button) // Компонент триггера Dialog (обычно кнопка)
const DialogTrigger = DialogPrimitive.Trigger;

// Dialog portal component (renders content outside the normal DOM flow) // Компонент портала Dialog (рендерит контент вне обычного потока DOM)
const DialogPortal = DialogPrimitive.Portal;

// Dialog close component (usually a button inside the dialog) // Компонент закрытия Dialog (обычно кнопка внутри диалога)
const DialogClose = DialogPrimitive.Close; // Export DialogClose // Экспорт DialogClose

// Dialog overlay component (the semi-transparent background) // Компонент оверлея Dialog (полупрозрачный фон)
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles and animations for the overlay // Базовые стили и анимации для оверлея
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName; // Set display name // Устанавливаем имя

// Dialog content component (the main dialog window) // Компонент содержимого Dialog (основное диалоговое окно)
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> // Props type // Тип пропсов
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    {" "}
    {/* Render content within the portal */}{" "}
    {/* Рендерим контент внутри портала */}
    <DialogOverlay /> {/* Render the overlay */} {/* Рендерим оверлей */}
    <DialogPrimitive.Content
      ref={ref} // Forward the ref // Перенаправляем ref
      className={cn(
        // Base styles, positioning, and animations for the content // Базовые стили, позиционирование и анимации для содержимого
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    >
      {children} {/* Render the content passed as children */}{" "}
      {/* Рендерим контент, переданный как дочерние элементы */}
      {/* Default close button */} {/* Кнопка закрытия по умолчанию */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" /> {/* Close icon */} {/* Иконка закрытия */}
        <span className="sr-only">Close</span> {/* Screen reader text */}{" "}
        {/* Текст для скринридера */}
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Dialog header component // Компонент заголовка Dialog
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left", // Base styles: flex column, spacing, text alignment // Базовые стили: flex колонка, отступы, выравнивание текста
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader"; // Set display name // Устанавливаем имя

// Dialog footer component (typically contains action buttons) // Компонент футера Dialog (обычно содержит кнопки действий)
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Base styles: flex layout, justification, spacing // Базовые стили: flex расположение, выравнивание, отступы
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter"; // Set display name // Устанавливаем имя

// Dialog title component // Компонент заголовка Dialog
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      "text-lg font-semibold leading-none tracking-tight", // Base styles: font size, weight, line height, tracking // Базовые стили: размер шрифта, вес, высота строки, трекинг
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName; // Set display name // Устанавливаем имя

// Dialog description component // Компонент описания Dialog
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("text-sm text-muted-foreground", className)} // Base styles: font size, muted color // Базовые стили: размер шрифта, приглушенный цвет
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose, // Export DialogClose // Экспорт DialogClose
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
