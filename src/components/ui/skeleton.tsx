import { cn } from "@/utils/clx";

// Skeleton component definition // Определение компонента Skeleton
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Accepts standard HTML div attributes // Принимает стандартные атрибуты HTML div
  return (
    // Render a div element with animation and styling // Рендерим элемент div с анимацией и стилизацией
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted", // Base styles: pulse animation, rounded corners, muted background // Базовые стили: анимация пульсации, скругленные углы, приглушенный фон
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  );
}

// Export the Skeleton component // Экспортируем компонент Skeleton
export { Skeleton };
