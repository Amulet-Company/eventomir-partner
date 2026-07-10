"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/utils/clx";
import { buttonVariants } from "@/components/ui/button";

// Define the props type for the Calendar component, extending DayPicker props
// Определяем тип пропсов для компонента Calendar, расширяя пропсы DayPicker
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Calendar component definition // Определение компонента Calendar
function Calendar({
  className,
  classNames,
  showOutsideDays = true, // Default prop to show days outside the current month // Пропс по умолчанию для отображения дней вне текущего месяца
  ...props
}: CalendarProps) {
  return (
    <DayPicker // This line looks correct
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)} // Base padding and custom classes // Базовый отступ и кастомные классы
      // Define class names for different parts of the calendar for styling
      // Определяем имена классов для различных частей календаря для стилизации
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0", // Styles for months container // Стили для контейнера месяцев
        month: "space-y-4", // Styles for a single month // Стили для одного месяца
        caption: "flex justify-center pt-1 relative items-center", // Styles for the month caption // Стили для заголовка месяца
        caption_label: "text-sm font-medium", // Styles for the caption label (e.g., "January 2024") // Стили для метки заголовка (например, "Январь 2024")
        nav: "space-x-1 flex items-center", // Styles for the navigation container // Стили для контейнера навигации
        nav_button: cn(
          buttonVariants({ variant: "outline" }), // Apply outline button styles // Применяем стили кнопки outline
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", // Size, transparency, and hover effect // Размер, прозрачность и эффект при наведении
        ),
        nav_button_previous: "absolute left-1", // Positioning for the previous button // Позиционирование для кнопки "назад"
        nav_button_next: "absolute right-1", // Positioning for the next button // Позиционирование для кнопки "вперед"
        table: "w-full border-collapse space-y-1", // Styles for the calendar table // Стили для таблицы календаря
        head_row: "flex", // Styles for the header row (weekdays) // Стили для строки заголовка (дни недели)
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]", // Styles for weekday cells // Стили для ячеек дней недели
        row: "flex w-full mt-2", // Styles for each week row // Стили для каждой строки недели
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // Styles for day cells, including selection and range styling // Стили для ячеек дней, включая стили выделения и диапазона
        day: cn(
          buttonVariants({ variant: "ghost" }), // Apply ghost button styles for individual days // Применяем стили кнопки ghost для отдельных дней
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100", // Size, padding, and selected state opacity // Размер, отступы и прозрачность в выделенном состоянии
        ),
        day_range_end: "day-range-end", // Class for the end day of a selected range // Класс для последнего дня выбранного диапазона
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // Styles for selected days // Стили для выделенных дней
        day_today: "bg-accent text-accent-foreground", // Styles for the current day // Стили для текущего дня
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground", // Styles for days outside the current month // Стили для дней вне текущего месяца
        day_disabled: "text-muted-foreground opacity-50", // Styles for disabled days // Стили для отключенных дней
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground", // Styles for days in the middle of a selected range // Стили для дней в середине выбранного диапазона
        day_hidden: "invisible", // Styles for hidden days (if using fixedWeeks) // Стили для скрытых дней (при использовании fixedWeeks)
        ...classNames, // Merge with any custom classNames passed as props // Объединяем с любыми кастомными classNames, переданными как пропсы
      }}
      // Define custom components for the navigation icons
      // Определяем кастомные компоненты для иконок навигации
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" {...props} />
        ), // Left chevron icon // Иконка стрелки влево
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" {...props} />
        ), // Right chevron icon // Иконка стрелки вправо
      }}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  );
}
Calendar.displayName = "Calendar"; // Set display name for debugging // Устанавливаем имя для отладки

// Export the Calendar component // Экспортируем компонент Calendar
export { Calendar };
