"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog"; // Sheet uses Dialog primitives internally // Sheet внутренне использует примитивы Dialog
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react"; // Close icon // Иконка закрытия

import { cn } from "@/utils/clx";

// Sheet root component (based on Dialog root) // Корневой компонент Sheet (на основе Dialog root)
const Sheet = SheetPrimitive.Root;

// Sheet trigger component (usually a button to open the sheet) // Компонент триггера Sheet (обычно кнопка для открытия sheet)
const SheetTrigger = SheetPrimitive.Trigger;

// Sheet close component (usually a button inside the sheet to close it) // Компонент закрытия Sheet (обычно кнопка внутри sheet для его закрытия)
const SheetClose = SheetPrimitive.Close; // Export SheetClose // Экспорт SheetClose

// Sheet portal component (renders content outside the normal DOM flow) // Компонент портала Sheet (рендерит контент вне обычного потока DOM)
const SheetPortal = SheetPrimitive.Portal;

// Sheet overlay component (the semi-transparent background) // Компонент оверлея Sheet (полупрозрачный фон)
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles and animations for the overlay // Базовые стили и анимации для оверлея
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName; // Set display name // Устанавливаем имя

// Define variants for the sheet content based on the side it appears from
// Определяем варианты для содержимого sheet в зависимости от стороны появления
const sheetVariants = cva(
  // Base styles: positioning, z-index, layout, background, padding, shadow, transitions, animations
  // Базовые стили: позиционирование, z-index, расположение, фон, паддинг, тень, переходы, анимации
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      // Define variants for each side (top, bottom, left, right) // Определяем варианты для каждой стороны (top, bottom, left, right)
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm", // Left side styles with responsive width // Стили для левой стороны с адаптивной шириной
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm", // Right side styles with responsive width // Стили для правой стороны с адаптивной шириной
      },
    },
    defaultVariants: {
      side: "right", // Default side is right // Сторона по умолчанию - правая
    },
  },
);

// Interface for SheetContent props, extending Dialog Content props and sheet variants
// Интерфейс для пропсов SheetContent, расширяющий пропсы Dialog Content и варианты sheet
interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

// Sheet content component (the main panel that slides in/out) // Компонент содержимого Sheet (основная панель, которая выдвигается/задвигается)
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>, // Ref element type // Тип элемента ref
  SheetContentProps // Props type // Тип пропсов
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    {" "}
    {/* Render content within the portal */}{" "}
    {/* Рендерим контент внутри портала */}
    <SheetOverlay /> {/* Render the overlay */} {/* Рендерим оверлей */}
    <SheetPrimitive.Content
      ref={ref} // Forward the ref // Перенаправляем ref
      className={cn(sheetVariants({ side }), className)} // Combine base variant styles with custom classes // Объединяем базовые стили варианта с кастомными классами
      {...props} // Spread remaining props // Распространяем остальные пропсы
    >
      {children} {/* Render the sheet content */}{" "}
      {/* Рендерим содержимое sheet */}
      {/* Default close button */} {/* Кнопка закрытия по умолчанию */}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" /> {/* Close icon */} {/* Иконка закрытия */}
        <span className="sr-only">Close</span> {/* Screen reader text */}{" "}
        {/* Текст для скринридера */}
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// Sheet header component // Компонент заголовка Sheet
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left", // Base styles: flex column, spacing, text alignment // Базовые стили: flex колонка, отступы, выравнивание текста
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader"; // Set display name // Устанавливаем имя

// Sheet footer component (typically contains action buttons) // Компонент футера Sheet (обычно содержит кнопки действий)
const SheetFooter = ({
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
SheetFooter.displayName = "SheetFooter"; // Set display name // Устанавливаем имя

// Sheet title component // Компонент заголовка Sheet
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("text-lg font-semibold text-foreground", className)} // Base styles: font size, weight, color // Базовые стили: размер шрифта, вес, цвет
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName; // Set display name // Устанавливаем имя

// Sheet description component // Компонент описания Sheet
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("text-sm text-muted-foreground", className)} // Base styles: font size, muted color // Базовые стили: размер шрифта, приглушенный цвет
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
