import type { Config } from "tailwindcss";

// Tailwind CSS configuration // Конфигурация Tailwind CSS
export default {
  darkMode: ["class"], // Enable dark mode using a class // Включаем темный режим с помощью класса
  content: [
    // Files to scan for Tailwind classes // Файлы для сканирования классов Tailwind
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // --- NEW: Map Tailwind's default font to your dynamic CSS variable ---
      fontFamily: {
        sans: ["var(--font-main)", "sans-serif"],
      },
      // -------------------------------------------------------------------

      // Extend the default Tailwind theme // Расширяем стандартную тему Tailwind
      colors: {
        // Define custom colors using CSS variables from globals.css // Определяем кастомные цвета, используя CSS-переменные из globals.css
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))", // Added hover color // Добавлен цвет при наведении
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          // Chart colors // Цвета для графиков
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          // Sidebar colors // Цвета для боковой панели
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        profile: {
          // Profile-specific theme colors // Цвета темы для профиля
          background: "hsl(var(--profile-background))",
          foreground: "hsl(var(--profile-foreground))",
          accent: "hsl(var(--profile-accent))",
          "accent-foreground": "hsl(var(--profile-accent-foreground))",
          muted: "hsl(var(--profile-muted))",
          "muted-foreground": "hsl(var(--profile-muted-foreground))",
          card: "hsl(var(--profile-card))",
          "card-foreground": "hsl(var(--profile-card-foreground))",
        },
      },
      borderRadius: {
        // Define border radius values using CSS variable // Определяем значения радиуса границы, используя CSS-переменную
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Define custom keyframes for animations // Определяем кастомные keyframes для анимаций
        "accordion-down": {
          // Accordion opening animation // Анимация открытия аккордеона
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)", // Animate to content height // Анимируем до высоты контента
          },
        },
        "accordion-up": {
          // Accordion closing animation // Анимация закрытия аккордеона
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0", // Animate to zero height // Анимируем до нулевой высоты
          },
        },
      },
      animation: {
        // Define custom animations using keyframes // Определяем кастомные анимации, используя keyframes
        "accordion-down": "accordion-down 0.2s ease-out", // Accordion down animation // Анимация аккордеона вниз
        "accordion-up": "accordion-up 0.2s ease-out", // Accordion up animation // Анимация аккордеона вверх
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Include tailwindcss-animate plugin // Включаем плагин tailwindcss-animate
} satisfies Config;
