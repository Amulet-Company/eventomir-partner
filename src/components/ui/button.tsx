import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/clx";

// Define button variants using class-variance-authority
// Определяем варианты кнопки с помощью class-variance-authority
const buttonVariants = cva(
  // Base styles for all buttons
  // Базовые стили для всех кнопок
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Define different visual variants
      // Определяем различные визуальные варианты
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Default style // Стиль по умолчанию
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-hover", // Destructive style with hover/active // Стиль destructive с hover/active // Added active state // Добавлено active state
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline style // Стиль outline
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary style // Вторичный стиль
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost style // Стиль ghost
        link: "text-primary underline-offset-4 hover:underline", // Link style // Стиль link
      },
      // Define different size variants
      // Определяем различные варианты размера
      size: {
        default: "h-10 px-4 py-2", // Default size // Размер по умолчанию
        sm: "h-9 rounded-md px-3", // Small size // Маленький размер
        lg: "h-11 rounded-md px-8", // Large size // Большой размер
        icon: "h-10 w-10", // Icon size // Размер иконки
      },
    },
    defaultVariants: {
      variant: "default", // Set the default variant // Устанавливаем вариант по умолчанию
      size: "default", // Set the default size // Устанавливаем размер по умолчанию
    },
  },
);

// Define the props interface for the Button component
// Определяем интерфейс пропсов для компонента Button
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>, // Include standard HTML button attributes // Включаем стандартные атрибуты HTML кнопки
    VariantProps<typeof buttonVariants> {
  // Include the variant props defined above // Включаем пропсы вариантов, определенные выше
  asChild?: boolean; // Optional prop to render as a child component // Опциональный пропс для рендеринга как дочернего компонента
}

// Button component definition // Определение компонента Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determine the component type (Slot or button) based on asChild prop
    // Определяем тип компонента (Slot или button) на основе пропса asChild
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        // Combine base variant styles with custom classes
        // Объединяем базовые стили варианта с кастомными классами
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref} // Forward the ref // Перенаправляем ref
        {...props} // Spread remaining props // Распространяем остальные пропсы
      />
    );
  },
);
Button.displayName = "Button"; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Button component and its variants // Экспортируем компонент Button и его варианты
export { Button, buttonVariants };
