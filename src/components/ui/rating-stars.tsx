"use client";

import * as React from "react";
import { Star } from "lucide-react"; // Star icon component // Компонент иконки звезды
import { cn } from "@/utils/clx";

// Props interface for the RatingStars component
// Интерфейс пропсов для компонента RatingStars
interface RatingStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // Current rating (0-5) // Текущий рейтинг (0-5)
  totalStars?: number; // Total number of stars (default 5) // Общее количество звезд (по умолчанию 5)
  size?: number; // Size of star icons (default 20) // Размер иконок звезд (по умолчанию 20)
  readOnly?: boolean; // If true, rating cannot be changed // Если true, рейтинг нельзя изменить
  onValueChange?: (newValue: number) => void; // Callback function when rating changes // Функция обратного вызова при изменении рейтинга
}

// RatingStars component definition // Определение компонента RatingStars
const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      value, // Destructure props // Деструктуризация пропсов
      totalStars = 5,
      size = 20,
      readOnly = false,
      onValueChange,
      className,
      ...props
    },
    ref,
  ) => {
    // State to track the value when hovering over stars
    // Состояние для отслеживания значения при наведении на звезды
    const [hoverValue, setHoverValue] = React.useState<number | undefined>(
      undefined,
    );

    // Handler for mouse enter event on a star // Обработчик события входа мыши на звезду
    const handleMouseEnter = (index: number) => {
      if (!readOnly) {
        // Allow hover effect only if not read-only // Разрешаем эффект наведения только если не read-only
        setHoverValue(index + 1); // Set hover value to the star's index + 1 // Устанавливаем значение наведения на индекс звезды + 1
      }
    };

    // Handler for mouse leave event from the container // Обработчик события ухода мыши из контейнера
    const handleMouseLeave = () => {
      if (!readOnly) {
        // Reset hover only if not read-only // Сбрасываем наведение только если не read-only
        setHoverValue(undefined); // Reset hover value // Сбрасываем значение наведения
      }
    };

    // Handler for click event on a star // Обработчик события клика по звезде
    const handleClick = (index: number) => {
      // Call onValueChange callback if provided and not read-only
      // Вызываем колбэк onValueChange, если он предоставлен и не read-only
      if (!readOnly && onValueChange) {
        onValueChange(index + 1); // Pass the new rating value // Передаем новое значение рейтинга
      }
    };

    // Round the value to the nearest integer for display
    // Округляем значение до ближайшего целого для отображения
    // In this case, we round to whole numbers
    // В данном случае округляем до целого
    const roundedValue = Math.round(value);
    // Determine the value to display (hover value takes precedence)
    // Определяем значение для отображения (значение наведения имеет приоритет)
    const displayValue = hoverValue ?? roundedValue;

    return (
      // Main container div // Основной div-контейнер
      <div
        ref={ref} // Forward the ref // Перенаправляем ref
        className={cn(
          "flex items-center gap-1", // Base styles: flex layout, alignment, gap // Базовые стили: flex расположение, выравнивание, отступ
          !readOnly && "cursor-pointer", // Add pointer cursor if interactive // Добавляем курсор-указатель, если интерактивно
          className, // Apply custom classes // Применяем кастомные классы
        )}
        onMouseLeave={handleMouseLeave} // Attach mouse leave handler // Прикрепляем обработчик ухода мыши
        {...props} // Spread remaining props // Распространяем остальные пропсы
      >
        {/* Map through the total number of stars to render each star */}
        {/* Итерируем по общему количеству звезд для рендеринга каждой звезды */}
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1; // The value this star represents (1 to totalStars) // Значение, которое представляет эта звезда (от 1 до totalStars)
          // Determine if the star should be filled based on the display value
          // Определяем, должна ли звезда быть заполнена, на основе отображаемого значения
          const isFilled = starValue <= displayValue;

          return (
            // Star icon component // Компонент иконки звезды
            <Star
              key={index} // Unique key for each star // Уникальный ключ для каждой звезды
              size={size} // Set star size // Устанавливаем размер звезды
              className={cn(
                "transition-colors", // Enable color transition // Включаем переход цвета
                // Apply filled or empty star styles // Применяем стили заполненной или пустой звезды
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                // Apply hover effect styles if not read-only // Применяем стили эффекта наведения, если не read-only
                !readOnly && "hover:text-yellow-500 hover:fill-yellow-500",
              )}
              onMouseEnter={() => handleMouseEnter(index)} // Attach mouse enter handler // Прикрепляем обработчик входа мыши
              onClick={() => handleClick(index)} // Attach click handler // Прикрепляем обработчик клика
              aria-label={`Оценка ${starValue} из ${totalStars}`} // Accessibility label // Метка доступности (Rating {starValue} out of {totalStars})
            />
          );
        })}
      </div>
    );
  },
);
RatingStars.displayName = "RatingStars"; // Set display name for debugging // Устанавливаем имя для отладки

// Export the RatingStars component // Экспортируем компонент RatingStars
export { RatingStars };
