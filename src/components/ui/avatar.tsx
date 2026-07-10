"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/utils/clx";

// Avatar root component
// Корневой компонент Avatar
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // Base styles: size, rounded, hidden overflow // Базовые стили: размер, скругление, скрытие переполнения
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName; // Set display name // Устанавливаем имя

// Avatar image component (displays the actual image)
// Компонент изображения Avatar (отображает фактическое изображение)
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)} // Base styles: aspect ratio, full size // Базовые стили: соотношение сторон, полный размер
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName; // Set display name // Устанавливаем имя

// Avatar fallback component (displayed when the image fails to load or is not provided)
// Компонент заглушки Avatar (отображается, если изображение не загрузилось или не предоставлено)
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted", // Base styles: flex center, rounded, background // Базовые стили: flex центр, скругление, фон
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName; // Set display name // Устанавливаем имя

// Export the components // Экспортируем компоненты
export { Avatar, AvatarImage, AvatarFallback };
