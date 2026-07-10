"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts"; // Import recharts primitives // Импортируем примитивы recharts

import { cn } from "@/utils/clx";

// Format: { THEME_NAME: CSS_SELECTOR }
// Format: { ИМЯ_ТЕМЫ: CSS_СЕЛЕКТОР }
const THEMES = { light: "", dark: ".dark" } as const;

// Type definition for chart configuration
// Определение типа для конфигурации диаграммы
export type ChartConfig = {
  [k in string]: {
    // Key: data key in your chart data // Ключ: ключ данных в ваших данных диаграммы
    label?: React.ReactNode; // Optional label for display (e.g., in tooltips, legends) // Необязательная метка для отображения (например, во всплывающих подсказках, легендах)
    icon?: React.ComponentType; // Optional icon component // Необязательный компонент иконки
  } & ( // Union type for color definition // Объединенный тип для определения цвета
    | { color?: string; theme?: never } // Either a direct color string // Либо прямая строка цвета
    | { color?: never; theme: Record<keyof typeof THEMES, string> } // Or theme-specific colors // Либо цвета для конкретных тем
  );
};

// Props for the ChartContext // Пропсы для ChartContext
type ChartContextProps = {
  config: ChartConfig; // The chart configuration object // Объект конфигурации диаграммы
};

// React context for sharing chart configuration // React-контекст для обмена конфигурацией диаграммы
const ChartContext = React.createContext<ChartContextProps | null>(null);

// Hook to access the chart configuration from context
// Хук для доступа к конфигурации диаграммы из контекста
function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />"); // Error if used outside provider // Ошибка, если используется вне провайдера
  }

  return context;
}

// Main chart container component
// Основной компонент-контейнер диаграммы
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig; // Chart configuration object // Объект конфигурации диаграммы
    children: React.ComponentProps<
      // Chart content (usually Recharts components) // Содержимое диаграммы (обычно компоненты Recharts)
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId(); // Generate a unique ID if not provided // Генерируем уникальный ID, если не предоставлен
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`; // Create a unique chart ID // Создаем уникальный ID диаграммы

  return (
    <ChartContext.Provider value={{ config }}>
      {" "}
      {/* Provide config to context */} {/* Предоставляем config в контекст */}
      <div
        data-chart={chartId} // Data attribute for styling // Атрибут данных для стилизации
        ref={ref}
        className={cn(
          // Base styles for chart container and Recharts elements
          // Базовые стили для контейнера диаграммы и элементов Recharts
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className, // Apply custom classes // Применяем кастомные классы
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />{" "}
        {/* Component to inject CSS variables for colors */}{" "}
        {/* Компонент для внедрения CSS-переменных для цветов */}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart"; // Set display name // Устанавливаем имя

// Component to generate and inject CSS variables based on the chart config
// Компонент для генерации и внедрения CSS-переменных на основе конфигурации диаграммы
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // Filter config entries that have color or theme definitions
  // Фильтруем записи config, у которых есть определения цвета или темы
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null; // Don't render style tag if no colors are defined // Не рендерим тег style, если цвета не определены
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES) // Iterate through light/dark themes // Итерируем по светлой/темной темам
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] { // Apply styles based on theme prefix and chart ID // Применяем стили на основе префикса темы и ID диаграммы
${colorConfig
  .map(([key, itemConfig]) => {
    // Get the color for the current theme or the direct color
    // Получаем цвет для текущей темы или прямой цвет
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    // Generate CSS variable definition if color exists
    // Генерируем определение CSS-переменной, если цвет существует
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

// Recharts Tooltip component // Компонент Tooltip из Recharts
const ChartTooltip = RechartsPrimitive.Tooltip;

// Custom Tooltip content component
// Кастомный компонент содержимого Tooltip
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & // Inherit Recharts Tooltip props // Наследуем пропсы Recharts Tooltip
    React.ComponentProps<"div"> & {
      // Add standard div props // Добавляем стандартные пропсы div
      hideLabel?: boolean; // Option to hide the label // Опция для скрытия метки
      hideIndicator?: boolean; // Option to hide the color indicator // Опция для скрытия цветового индикатора
      indicator?: "line" | "dot" | "dashed"; // Type of indicator // Тип индикатора
      nameKey?: string; // Key to use for item name // Ключ для имени элемента
      labelKey?: string; // Key to use for label // Ключ для метки
    }
>(
  (
    {
      active, // Provided by Recharts: is the tooltip active? // Предоставляется Recharts: активен ли tooltip?
      payload, // Provided by Recharts: data for the hovered item(s) // Предоставляется Recharts: данные для наведенного(ых) элемента(ов)
      className,
      indicator = "dot", // Default indicator type // Тип индикатора по умолчанию
      hideLabel = false,
      hideIndicator = false,
      label, // Custom label prop // Кастомный пропс метки
      labelFormatter, // Custom label formatter function // Кастомная функция форматирования метки
      labelClassName,
      formatter, // Custom value formatter function // Кастомная функция форматирования значения
      color, // Custom color override // Кастомное переопределение цвета
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart(); // Get chart config from context // Получаем config диаграммы

    // Memoized calculation for the tooltip label // Мемоизированное вычисление метки tooltip
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload; // Get the first item from the payload // Получаем первый элемент из payload
      // Determine the key to use for looking up label in config // Определяем ключ для поиска метки в config
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key); // Get config for this item // Получаем config для этого элемента
      // Determine the actual label value // Определяем фактическое значение метки
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      // Use label formatter if provided // Используем форматер метки, если предоставлен
      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      // Render the label // Рендерим метку
      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    // Don't render if tooltip is not active or no data // Не рендерим, если tooltip не активен или нет данных
    if (!active || !payload?.length) {
      return null;
    }

    // Determine if the label should be nested within each item (for line/dashed indicators)
    // Определяем, должна ли метка быть вложенной в каждый элемент (для line/dashed индикаторов)
    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", // Base tooltip styles // Базовые стили tooltip
          className,
        )}
      >
        {/* Render label outside the loop if not nested */}
        {/* Рендерим метку вне цикла, если не вложена */}
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {/* Map through payload items to display each data point */}
          {/* Итерируем по элементам payload для отображения каждой точки данных */}
          {payload.map((item, index) => {
            // Determine the key and config for the current item // Определяем ключ и config для текущего элемента
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            // Determine the indicator color // Определяем цвет индикатора
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey} // Use dataKey as key // Используем dataKey как ключ
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", // Base item styles // Базовые стили элемента
                  indicator === "dot" && "items-center", // Align center for dot indicator // Выравниваем по центру для dot индикатора
                )}
              >
                {/* Use custom formatter if provided */}
                {/* Используем кастомный форматер, если предоставлен */}
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  // Default item rendering // Рендеринг элемента по умолчанию
                  <>
                    {/* Render icon or indicator */}
                    {/* Рендерим иконку или индикатор */}
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", // Indicator styles // Стили индикатора
                            {
                              "h-2.5 w-2.5": indicator === "dot", // Dot style // Стиль точки
                              "w-1": indicator === "line", // Line style // Стиль линии
                              // Dashed style // Стиль пунктира
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed", // Adjust margin for nested dashed // Корректируем отступ для вложенного пунктира
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor, // Set CSS variables for color // Устанавливаем CSS-переменные для цвета
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none", // Layout for label and value // Расположение для метки и значения
                        nestLabel ? "items-end" : "items-center", // Adjust alignment based on nesting // Корректируем выравнивание в зависимости от вложенности
                      )}
                    >
                      <div className="grid gap-1.5">
                        {/* Render nested label if applicable */}
                        {/* Рендерим вложенную метку, если применимо */}
                        {nestLabel ? tooltipLabel : null}
                        {/* Item label (from config or data) */}
                        {/* Метка элемента (из config или данных) */}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {/* Item value (formatted) */}
                      {/* Значение элемента (отформатированное) */}
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip"; // Set display name // Устанавливаем имя

// Recharts Legend component // Компонент Legend из Recharts
const ChartLegend = RechartsPrimitive.Legend;

// Custom Legend content component // Кастомный компонент содержимого Legend
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Legend> & // Standard div props // Стандартные пропсы div
    Pick<React.ComponentProps<typeof RechartsPrimitive.Legend>, "payload"> & {
      // Inherit specific Recharts Legend props // Наследуем специфичные пропсы Recharts Legend
      hideIcon?: boolean; // Option to hide the icon // Опция для скрытия иконки
      nameKey?: string; // Key to use for item name // Ключ для имени элемента
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref,
  ) => {
    const { config } = useChart(); // Get chart config // Получаем config диаграммы

    if (!payload?.length) {
      return null; // Don't render if no payload // Не рендерим, если нет payload
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4", // Base legend styles // Базовые стили легенды
          verticalAlign === "top" ? "pb-3" : "pt-3", // Adjust padding based on vertical alignment // Корректируем отступы в зависимости от вертикального выравнивания
          className,
        )}
      >
        {/* Map through payload items to render legend items */}
        {/* Итерируем по элементам payload для рендеринга элементов легенды */}
        {payload.map((item) => {
          // Determine key and config for the current item // Определяем ключ и config для текущего элемента
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value} // Use value as key // Используем value как ключ
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground", // Base item styles // Базовые стили элемента
              )}
            >
              {/* Render icon or color indicator */}
              {/* Рендерим иконку или цветовой индикатор */}
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]" // Color indicator style // Стиль цветового индикатора
                  style={{
                    backgroundColor: item.color, // Use item color // Используем цвет элемента
                  }}
                />
              )}
              {/* Item label from config */}
              {/* Метка элемента из config */}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  },
);
ChartLegendContent.displayName = "ChartLegend"; // Set display name // Устанавливаем имя

// Helper function to extract item configuration from Recharts payload and config object
// Вспомогательная функция для извлечения конфигурации элемента из payload Recharts и объекта config
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown, // The item from Recharts payload array // Элемент из массива payload Recharts
  key: string, // The key to look up in the config // Ключ для поиска в config
) {
  // Check if payload is a valid object // Проверяем, является ли payload валидным объектом
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  // Check if the payload has its own nested 'payload' property (common in Recharts)
  // Проверяем, есть ли у payload свое вложенное свойство 'payload' (часто встречается в Recharts)
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key; // Start with the provided key // Начинаем с предоставленного ключа

  // Try to find a more specific key within the payload itself or its nested payload
  // Пытаемся найти более специфичный ключ внутри самого payload или его вложенного payload
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  // Return the config entry matching the determined key, or the original key as fallback
  // Возвращаем запись config, соответствующую определенному ключу, или исходный ключ в качестве запасного варианта
  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

// Export the chart components // Экспортируем компоненты диаграммы
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
