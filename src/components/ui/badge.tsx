import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/clx";

// Define badge variants using class-variance-authority
// Определяем варианты badge с помощью class-variance-authority
const badgeVariants = cva(
  // Base styles for all badges
  // Базовые стили для всех badge
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      // Define different visual variants
      // Определяем различные визуальные варианты
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80", // Default style // Стиль по умолчанию
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary style // Вторичный стиль
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80", // Destructive (error) style // Стиль destructive (ошибка)
        outline: "text-foreground", // Outline style // Стиль outline
      },
    },
    defaultVariants: {
      variant: "default", // Set the default variant // Устанавливаем вариант по умолчанию
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
