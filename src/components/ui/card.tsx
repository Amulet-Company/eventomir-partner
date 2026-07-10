import * as React from "react";

import { cn } from "@/utils/clx";

// Card component: The main container for card content
// Компонент Card: Основной контейнер для содержимого карточки
const Card = React.forwardRef<
  HTMLDivElement, // Ref element type // Тип элемента ref
  React.HTMLAttributes<HTMLDivElement> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <div
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: rounded corners, border, background, text color, shadow
      // Базовые стили: скругленные углы, граница, фон, цвет текста, тень
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
Card.displayName = "Card"; // Set display name // Устанавливаем имя

// CardHeader component: Container for the card's header section
// Компонент CardHeader: Контейнер для секции заголовка карточки
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Base styles: flex column, spacing, padding // Базовые стили: flex колонка, отступы, паддинг
    {...props}
  />
));
CardHeader.displayName = "CardHeader"; // Set display name // Устанавливаем имя

// CardTitle component: The main title within the CardHeader
// Компонент CardTitle: Основной заголовок внутри CardHeader
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Base styles: font size, weight, line height, tracking // Базовые стили: размер шрифта, вес, высота строки, трекинг
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle"; // Set display name // Устанавливаем имя

// CardDescription component: Subtitle or description within the CardHeader
// Компонент CardDescription: Подзаголовок или описание внутри CardHeader
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Base styles: font size, muted color // Базовые стили: размер шрифта, приглушенный цвет
    {...props}
  />
));
CardDescription.displayName = "CardDescription"; // Set display name // Устанавливаем имя

// CardContent component: Container for the main content of the card
// Компонент CardContent: Контейнер для основного содержимого карточки
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Base styles: padding (top padding removed by default) // Базовые стили: паддинг (верхний паддинг убран по умолчанию)
));
CardContent.displayName = "CardContent"; // Set display name // Устанавливаем имя

// CardFooter component: Container for the card's footer section
// Компонент CardFooter: Контейнер для секции футера карточки
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Base styles: flex, alignment, padding // Базовые стили: flex, выравнивание, паддинг
    {...props}
  />
));
CardFooter.displayName = "CardFooter"; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
