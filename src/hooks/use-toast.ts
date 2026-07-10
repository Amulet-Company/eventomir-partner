"use client";

import * as React from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
import { cn } from "@/utils/clx";

// --- Типизация ---

export type ToastProps = Omit<ExternalToast, "description"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

// --- Основная функция toast ---

function toast({
  title,
  description,
  variant,
  action,
  className,
  ...props
}: ToastProps) {
  // Sonner требует чтобы первый аргумент (message) не был пустым.
  // Если title нет, поднимаем description наверх.
  const message = title || description || "";
  const displayDescription = title ? description : undefined;

  const commonProps = {
    description: displayDescription,
    action,
    ...props,
  };

  if (variant === "destructive") {
    return sonnerToast.error(message, {
      ...commonProps,
      className: cn(
        "!bg-red-100 !border-red-200 !text-red-800 dark:!bg-red-900/30 dark:!border-red-900 dark:!text-red-200 rounded-2xl shadow-lg",
        className,
      ),
    });
  }

  if (variant === "success") {
    return sonnerToast.success(message, {
      ...commonProps,
      className: cn(
        "!bg-green-100 !border-green-200 !text-green-800 dark:!bg-green-900/30 dark:!border-green-900 dark:!text-green-200 rounded-2xl shadow-lg",
        className,
      ),
    });
  }

  // Дефолтный вариант
  return sonnerToast(message, {
    ...commonProps,
    className: cn("rounded-2xl shadow-lg border-border", className),
  });
}

// --- Хук useToast ---

function useToast() {
  return {
    /**
     * Стандартное уведомление (Default, Success, Destructive)
     */
    toast,

    /**
     * Продвинутый метод для обработки асинхронных операций.
     * Автоматически меняет иконки (спиннер -> галочка/крестик).
     */
    promise: <T>(
      promise: Promise<T> | (() => Promise<T>),
      data: {
        loading: string | React.ReactNode;
        success:
          | string
          | React.ReactNode
          | ((data: T) => string | React.ReactNode);
        error:
          | string
          | React.ReactNode
          | ((error: unknown) => string | React.ReactNode);
      },
    ) => {
      return sonnerToast.promise(promise, {
        loading: data.loading,
        success: data.success,
        error: data.error,
        className: "rounded-2xl shadow-lg border-border font-medium",
      });
    },

    /**
     * Принудительное закрытие уведомления по ID
     */
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  };
}

export { useToast, toast };
