// This file is the central source for all icons used in the application.
// By centralizing icon exports, we can easily manage, update, or replace them in the future.
// Этот файл является центральным источником для всех иконок, используемых в приложении.
// Централизация экспорта иконок позволяет легко управлять, обновлять или заменять их в будущем.

export {
  Bell,
  Settings,
  Search,
  Pencil,
  Tags,
  Image as ImageIcon, // Renamed to avoid conflict with Next/Image // Переименовано, чтобы избежать конфликта с Next/Image
  Star,
  Users,
  DollarSign,
  Trash2,
  PlusCircle,
  UserCog,
  Check,
  ShieldCheck,
  ShieldX,
  Award,
  BookCheck,
  Gem,
  Loader2,
  MessageSquare,
  User,
  Calendar as CalendarIcon,
  ArrowLeft,
  Edit,
  Camera,
  History,
  MapPin,
  Phone,
  Mail,
  KeyRound,
  Send,
  XCircle,
  Clock,
  CheckCircle,
  Eye,
  MessageCircle as MessageCircleIcon,
  Cookie,
  Copy,
  Send as SendIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  GitCompare,
  ChefHat,
  Music,
  Palette,
  Mic,
  Car,
  Film,
  Flower2,
  Smile,
  Brush,
  Utensils,
  MicVocal,
  BookOpen,
  Wallet,
  Heart,
  X,
  Upload,
  Save,
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldQuestion,
  Briefcase,
  List,
  Map as MapIcon,
  BadgeCheck,
  Type as TypeIcon,
  HelpCircle,
  BarChart,
  ShieldAlert,
  Handshake,
  AlertCircle,
} from "lucide-react";

import React from "react";

export const VkontakteIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 48 48"
    className={className}
    {...props}
  >
    <path
      fill="#1976d2"
      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5 V37z"
    />
    <path
      fill="#fff"
      d="M35.937,18.041c0.046-0.151,0.068-0.291,0.062-0.416C35.984,17.263,35.735,17,35.149,17h-2.618 c-0.661,0-0.966,0.4-1.144,0.801c0,0-1.632,3.359-3.513,5.574c-0.61,0.641-0.92,0.625-1.25,0.625C26.447,24,26,23.786,26,23.199 v-5.185C26,17.32,25.827,17,25.268,17h-4.649C20.212,17,20,17.32,20,17.641c0,0.667,0.898,0.827,1,2.696v3.623 C21,24.84,20.847,25,20.517,25c-0.89,0-2.642-3-3.815-6.932C16.448,17.294,16.194,17,15.533,17h-2.643 C12.127,17,12,17.374,12,17.774c0,0.721,0.6,4.619,3.875,9.101C18.25,30.125,21.379,32,24.149,32c1.678,0,1.85-0.427,1.85-1.094 v-2.972C26,27.133,26.183,27,26.717,27c0.381,0,1.158,0.25,2.658,2c1.73,2.018,2.044,3,3.036,3h2.618 c0.608,0,0.957-0.255,0.971-0.75c0.003-0.126-0.015-0.267-0.056-0.424c-0.194-0.576-1.084-1.984-2.194-3.326 c-0.615-0.743-1.222-1.479-1.501-1.879C32.062,25.36,31.991,25.176,32,25c0.009-0.185,0.105-0.361,0.249-0.607 C32.223,24.393,35.607,19.642,35.937,18.041z"
    />
  </svg>
);

export const TelegramIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path
      fill="#2AABEE"
      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
    />
    <path
      fill="#FFF"
      d="M4.93 11.458c3.553-1.548 5.922-2.57 7.108-3.065 3.385-1.418 4.088-1.662 4.542-1.67.1 0 .324.023.468.113.12.075.153.175.168.246.015.07.032.226.017.345-.17 1.428-.908 6.13-1.284 8.307-.158.92-.472 1.228-.77 1.26-.643.068-1.13-.414-1.758-.78-.982-.572-1.536-.93-2.483-1.554-1.092-.72-.383-1.118.242-1.765.163-.168 2.998-2.748 3.053-2.98.006-.03.013-.134-.047-.184-.06-.05-.152-.03-.217-.015-.093.02-1.57.994-4.428 2.924-.418.283-.797.422-1.136.413-.375-.01-1.096-.21-1.636-.377-.664-.206-1.19-.315-1.144-.666.024-.184.305-.373.842-.566z"
    />
  </svg>
);

export const YandexIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path
      d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z"
      fill="#FC3F1D"
    />

    <path
      d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z"
      fill="#fff"
    ></path>
  </svg>
);

export const GoogleIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);
