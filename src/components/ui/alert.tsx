import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/clx";

export type AlertVariant = "error" | "warning" | "info" | "success";

interface MessageAlertProps {
  variant: AlertVariant;
  message: string;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; text: string; icon: React.ReactNode }
> = {
  error: {
    container: "bg-red-50 border-red-200",
    text: "text-red-700",
    icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  },
  success: {
    container: "bg-green-50 border-green-200",
    text: "text-green-700",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />,
  },
};

export function MessageAlert({
  variant,
  message,
  className,
}: MessageAlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-2 duration-300",
        styles.container,
        className,
      )}
      role="alert"
    >
      {styles.icon}
      <div className={cn("text-sm font-medium leading-relaxed", styles.text)}>
        {message}
      </div>
    </div>
  );
}
