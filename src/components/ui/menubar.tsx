"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react"; // Icon components // Компоненты иконок

import { cn } from "@/utils/clx";

// MenubarMenu component (wrapper for a menu) // Компонент MenubarMenu (обертка для меню)
const MenubarMenu = MenubarPrimitive.Menu;

// MenubarGroup component (for grouping items) // Компонент MenubarGroup (для группировки элементов)
const MenubarGroup = MenubarPrimitive.Group;

// MenubarPortal component (renders content outside the normal DOM flow) // Компонент MenubarPortal (рендерит контент вне обычного потока DOM)
const MenubarPortal = MenubarPrimitive.Portal;

// MenubarRadioGroup component // Компонент MenubarRadioGroup
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

// MenubarSub component (for sub-menus) // Компонент MenubarSub (для подменю)
const MenubarSub = MenubarPrimitive.Sub;

// Menubar root component // Корневой компонент Menubar
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex layout, height, spacing, border, background, padding // Базовые стили: flex расположение, высота, отступы, граница, фон, паддинг
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName; // Set display name // Устанавливаем имя

// MenubarTrigger component (the clickable element that opens a menu) // Компонент MenubarTrigger (кликабельный элемент, открывающий меню)
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex, cursor, selection, padding, text style, focus/open states // Базовые стили: flex, курсор, выделение, паддинг, стиль текста, состояния фокуса/открытия
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName; // Set display name // Устанавливаем имя

// MenubarSubTrigger component (the clickable element that opens a sub-menu) // Компонент MenubarSubTrigger (кликабельный элемент, открывающий подменю)
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    // Props type // Тип пропсов
    inset?: boolean; // Optional prop for indented style // Опциональный пропс для стиля с отступом
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex, cursor, selection, padding, text style, focus/open states // Базовые стили: flex, курсор, выделение, паддинг, стиль текста, состояния фокуса/открытия
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8", // Apply left padding if inset // Применяем левый паддинг, если inset
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {children} {/* The content of the sub-trigger */}{" "}
    {/* Содержимое триггера подменю */}
    <ChevronRight className="ml-auto h-4 w-4" /> {/* Right chevron icon */}{" "}
    {/* Иконка стрелки вправо */}
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName; // Set display name // Устанавливаем имя

// MenubarSubContent component (the content panel of a sub-menu) // Компонент MenubarSubContent (панель содержимого подменю)
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: z-index, width, overflow, border, background, padding, text color, animations // Базовые стили: z-index, ширина, переполнение, граница, фон, паддинг, цвет текста, анимации
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName; // Set display name // Устанавливаем имя

// MenubarContent component (the main content panel of a menu) // Компонент MenubarContent (основная панель содержимого меню)
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> // Props type // Тип пропсов
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <MenubarPrimitive.Portal>
      {" "}
      {/* Render content within the portal */}{" "}
      {/* Рендерим контент внутри портала */}
      <MenubarPrimitive.Content
        ref={ref} // Forward the ref // Перенаправляем ref
        align={align} // Alignment relative to the trigger // Выравнивание относительно триггера
        alignOffset={alignOffset} // Fine-tune alignment offset // Точная настройка смещения выравнивания
        sideOffset={sideOffset} // Offset from the trigger // Смещение от триггера
        className={cn(
          // Base styles: z-index, width, overflow, border, background, padding, text color, shadow, animations // Базовые стили: z-index, ширина, переполнение, граница, фон, паддинг, цвет текста, тень, анимации
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className, // Apply custom classes // Применяем кастомные классы
        )}
        {...props} // Spread remaining props // Распространяем остальные пропсы
      />
    </MenubarPrimitive.Portal>
  ),
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName; // Set display name // Устанавливаем имя

// MenubarItem component (a basic menu item) // Компонент MenubarItem (базовый элемент меню)
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    // Props type // Тип пропсов
    inset?: boolean; // Optional prop for indented style // Опциональный пропс для стиля с отступом
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex, cursor, selection, padding, text style, focus state, disabled state // Базовые стили: flex, курсор, выделение, паддинг, стиль текста, состояние фокуса, состояние disabled
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8", // Apply left padding if inset // Применяем левый паддинг, если inset
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName; // Set display name // Устанавливаем имя

// MenubarCheckboxItem component (a menu item that can be checked) // Компонент MenubarCheckboxItem (элемент меню, который можно отметить)
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> // Props type // Тип пропсов
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex, cursor, selection, padding, text style, focus state, disabled state
      // Базовые стили: flex, курсор, выделение, паддинг, стиль текста, состояние фокуса, состояние disabled
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    checked={checked} // Pass checked state // Передаем состояние checked
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Check indicator */} {/* Индикатор галочки */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" /> {/* Check icon */} {/* Иконка галочки */}
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children} {/* The content of the checkbox item */}{" "}
    {/* Содержимое элемента чекбокса */}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName; // Set display name // Устанавливаем имя

// MenubarRadioItem component (a menu item that can be selected like a radio button) // Компонент MenubarRadioItem (элемент меню, который можно выбрать как радиокнопку)
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> // Props type // Тип пропсов
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      // Base styles: flex, cursor, selection, padding, text style, focus state, disabled state
      // Базовые стили: flex, курсор, выделение, паддинг, стиль текста, состояние фокуса, состояние disabled
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  >
    {/* Radio indicator (circle) */} {/* Индикатор радиокнопки (кружок) */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" /> {/* Circle icon */}{" "}
        {/* Иконка кружка */}
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children} {/* The content of the radio item */}{" "}
    {/* Содержимое элемента радиокнопки */}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName; // Set display name // Устанавливаем имя

// MenubarLabel component (non-interactive text label) // Компонент метки Menubar (неинтерактивная текстовая метка)
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    // Props type // Тип пропсов
    inset?: boolean; // Optional prop for indented style // Опциональный пропс для стиля с отступом
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn(
      "px-2 py-1.5 text-sm font-semibold", // Base styles: padding, text style // Базовые стили: паддинг, стиль текста
      inset && "pl-8", // Apply left padding if inset // Применяем левый паддинг, если inset
      className, // Apply custom classes // Применяем кастомные классы
    )}
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName; // Set display name // Устанавливаем имя

// MenubarSeparator component // Компонент MenubarSeparator
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>, // Ref element type // Тип элемента ref
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> // Props type // Тип пропсов
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref} // Forward the ref // Перенаправляем ref
    className={cn("-mx-1 my-1 h-px bg-muted", className)} // Base styles: margin, height, background color // Базовые стили: margin, высота, цвет фона
    {...props} // Spread remaining props // Распространяем остальные пропсы
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName; // Set display name // Устанавливаем имя

// MenubarShortcut component (displays keyboard shortcuts) // Компонент MenubarShortcut (отображает сочетания клавиш)
const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground", // Base styles: margin, text style, tracking, opacity // Базовые стили: margin, стиль текста, трекинг, прозрачность
        className, // Apply custom classes // Применяем кастомные классы
      )}
      {...props} // Spread remaining props // Распространяем остальные пропсы
    />
  );
};
MenubarShortcut.displayName = "MenubarShortcut"; // Set display name (note: lowercase 'n') // Устанавливаем имя (примечание: строчная 'n')

// Export the components // Экспортируем компоненты
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
