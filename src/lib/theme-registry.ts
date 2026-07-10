export type ThemePreset =
  | "classic"
  | "zinc"
  | "rose"
  | "blue"
  | "green"
  | "orange";

export const THEME_PRESETS: Record<
  ThemePreset,
  { light: string; dark: string }
> = {
  // THIS IS YOUR EXACT GLOBALS.CSS CONFIGURATION
  classic: {
    light: `
      --primary: 349 100% 81%; 
      --primary-foreground: 0 0% 98%;
      --accent: 51 100% 50%;
      --accent-foreground: 0 0% 9%;
    `,
    dark: `
      --primary: 0 0% 98%;
      --primary-foreground: 0 0% 9%;
      --accent: 0 0% 14.9%;
      --accent-foreground: 0 0% 98%;
    `,
  },
  zinc: {
    light: `--primary: 240 5.9% 10%; --accent: 240 4.8% 95.9%;`,
    dark: `--primary: 0 0% 98%; --accent: 240 3.7% 15.9%;`,
  },
  rose: {
    light: `--primary: 346.8 77.2% 49.8%; --accent: 346.8 77.2% 49.8%;`,
    dark: `--primary: 346.8 77.2% 49.8%; --accent: 346.8 77.2% 49.8%;`,
  },
  blue: {
    light: `--primary: 221.2 83.2% 53.3%; --accent: 210 40% 96.1%;`,
    dark: `--primary: 217.2 91.2% 59.8%; --accent: 217.2 32.6% 17.5%;`,
  },
  green: {
    light: `--primary: 142.1 76.2% 36.3%; --accent: 149.3 80.4% 90%;`,
    dark: `--primary: 142.1 70.6% 45.3%; --accent: 149.3 80.4% 90%;`,
  },
  orange: {
    light: `--primary: 24.6 95% 53.1%; --accent: 24.6 95% 53.1%;`,
    dark: `--primary: 20.5 90.2% 48.2%; --accent: 20.5 90.2% 48.2%;`,
  },
};
