"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react"; // Close icon // Иконка закрытия

import { cn } from "@/utils/clx";

// ToastProvider component (provides context for toasts) // Компонент ToastProvider (предоставляет контекст для тостов)
const ToastProvider = ToastPrimitives.Provider;

// ToastViewport component (renders the toasts on the screen) // Компонент ToastViewport (рендерит тосты на экране)
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: positioning, z-index, layout, size constraints, padding, responsive layout // Базовые стили: позиционирование, z-index, расположение, ограничения размера, паддинг, адаптивное расположение
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName; // Set display name // Устанавливаем имя

// Define toast variants using class-variance-authority // Определяем варианты тоста с помощью class-variance-authority
const toastVariants = cva(
  // Base styles: pointer events, positioning, layout, spacing, overflow, border, padding, shadow, transition, animations // Базовые стили: события указателя, позиционирование, расположение, отступы, переполнение, граница, паддинг, тень, переход, анимации
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      // Define different visual variants // Определяем различные визуальные варианты
      variant: {
        default: "border bg-background text-foreground", // Default style // Стиль по умолчанию
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground", // Destructive style // Стиль destructive
      },
    },
    defaultVariants: {
      variant: "default", // Set the default variant // Устанавливаем вариант по умолчанию
    },
  },
);

// Toast component definition // Определение компонента Toast
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & // Props type // Тип пропсов
    VariantProps<typeof toastVariants> // Include variant props // Включаем пропсы вариантов
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref} // Forward the ref // Перенаправляем ref
      className={cn(toastVariants({ variant }), className)} // Combine base variant styles with custom classes // Объединяем базовые стили варианта с кастомными классами
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName; // Set display name // Устанавливаем имя

// ToastAction component (a button within the toast) // Компонент ToastAction (кнопка внутри тоста)
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: layout, size, rounded corners, border, background, padding, text style, focus ring, transition, hover state, disabled state, destructive variant styles
      // Базовые стили: расположение, размер, скругленные углы, граница, фон, паддинг, стиль текста, кольцо фокуса, переход, состояние hover, состояние disabled, стили варианта destructive
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName; // Set display name // Устанавливаем имя

// ToastClose component (a button to close the toast) // Компонент ToastClose (кнопка для закрытия тоста)
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: positioning, rounded corners, padding, text color, opacity, transition, hover state, focus state, destructive variant styles
      // Базовые стили: позиционирование, скругленные углы, паддинг, цвет текста, прозрачность, переход, состояние hover, состояние focus, стили варианта destructive
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    toast-close="" // Attribute used by the toast primitive // Атрибут, используемый примитивом тоста
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName; // Set display name // Устанавливаем имя

// ToastTitle component // Компонент ToastTitle
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("text-sm font-semibold", className)} // Base styles: text size, font weight // Базовые стили: размер текста, вес шрифта
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName; // Set display name // Устанавливаем имя

// ToastDescription component // Компонент ToastDescription
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("text-sm opacity-90", className)} // Base styles: text size, opacity // Базовые стили: размер текста, прозрачность
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName; // Set display name // Устанавливаем имя

// Type definition for Toast component props // Определение типа для пропсов компонента Toast
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

// Type definition for ToastAction element // Определение типа для элемента ToastAction
type ToastActionElement = React.ReactElement<typeof ToastAction>;

// Export the components and types // Экспортируем компоненты и типы
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
