"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Send as SendIcon } from "@/components/Icons";
import { cn } from "@/utils/clx";

// Inline SVGs for VK and Odnoklassniki as they are not in lucide-react
// Inline SVG для VK и Одноклассников, так как их нет в lucide-react
const VkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05S0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H10.28V16c3.824-.604 6.75-3.934 6.75-7.951" />
  </svg>
);

const OkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8m4.773 12.227c-.29.29-.678.435-1.067.435h-2.86c-.39 0-.777-.145-1.067-.435-.29-.29-.435-.678-.435-1.067 0-.07.008-.14.024-.208l-.154-.155c-.07-.07-.13-.15-.178-.238-.047-.09-.07-.184-.07-.28 0-.39.145-.777.435-1.067.29-.29.678-.435 1.067-.435h2.067c.39 0 .777.145 1.067.435.29.29.435.678.435 1.067 0 .39-.145.777-.435 1.067m-4.208-.472c.016.066.024.138.024.208 0 .195-.07.375-.2.514-.133.138-.313.208-.514.208-.195 0-.375-.07-.514-.208-.138-.139-.208-.319-.208-.514 0-.195.07-.375.208-.514.14-.138.32-.208.514-.208.201 0 .38.07.514.208.13.14.2.32.2.514M8.53 4.6c.16.16.24.364.24.614V6.3c0 .25-.08.455-.24.614-.16.16-.364.24-.614.24H6.83c-.25 0-.455-.08-.614-.24-.16-.16-.24-.364-.24-.614V5.214c0-.25.08-.455.24-.614.16-.16.364.24.614.24h1.086c.25 0 .455.08.614.24" />
  </svg>
);

interface ShareButtonsProps {
  url: string; // URL to share // URL для шеринга
  title?: string; // Title (for some social networks) // Заголовок (для некоторых соцсетей)
  description?: string; // Description (for some social networks) // Описание (для некоторых соцсетей)
  imageUrl?: string; // Image URL (for VK) // URL изображения (для VK)
  className?: string; // Additional classes for the container // Дополнительные классы для контейнера
  buttonSize?: "sm" | "default" | "lg" | "icon"; // Button size // Размер кнопок
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"; // Button style variant // Вариант стиля кнопок
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = "",
  description = "",
  imageUrl = "",
  className,
  buttonSize = "icon", // Default size is icon // Размер по умолчанию - иконка
  variant = "outline", // Default variant is outline // Вариант по умолчанию - outline
}) => {
  const { toast } = useToast(); // Hook for уведомлений
  // State to ensure the component only renders on the client // Состояние, чтобы компонент рендерился только на клиенте
  const [isClient, setIsClient] = React.useState(false);

  // Set isClient to true after mounting // Устанавливаем isClient в true после монтирования
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render buttons if not on the client // Если не клиент, не рендерим кнопки
  if (!isClient) {
    return null;
  }

  // Encode parameters for URLs // Кодируем параметры для URL
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImageUrl = encodeURIComponent(imageUrl);

  // Function to copy the URL to the clipboard // Функция для копирования URL в буфер обмена
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Ссылка скопирована", // Link copied
        description: "Ссылка скопирована в буфер обмена.", // Link copied to clipboard.
      });
    } catch (err) {
      console.error("Ошибка копирования ссылки:", err); // Error copying link:
      toast({
        variant: "destructive",
        title: "Ошибка", // Error
        description: "Не удалось скопировать ссылку.", // Could not copy link.
      });
    }
  };

  // TODO: Replace with RuTube share link if needed // TODO: Заменить на RuTube ссылку если нужно
  //const ruTubeShareUrl = `...`; // Link for RuTube

  // Construct share URLs // Конструируем URL для шеринга
  const vkShareUrl = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedDescription}&image=${encodedImageUrl}`;
  const okShareUrl = `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${encodedUrl}`;
  const tgShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

  // Function to open the share window // Функция для открытия окна шеринга
  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* VK Share Button */} {/* Кнопка шеринга VK */}
      <Button
        variant={variant}
        size={buttonSize}
        onClick={() => openShareWindow(vkShareUrl)}
        title="Поделиться ВКонтакте" // Share on VKontakte
      >
        <VkIcon />
        <span className="sr-only">Поделиться ВКонтакте</span>{" "}
        {/* Share on VKontakte */}
      </Button>
      {/* Odnoklassniki Share Button */} {/* Кнопка шеринга Одноклассники */}
      <Button
        variant={variant}
        size={buttonSize}
        onClick={() => openShareWindow(okShareUrl)}
        title="Поделиться в Одноклассниках" // Share on Odnoklassniki
      >
        <OkIcon />
        <span className="sr-only">Поделиться в Одноклассниках</span>{" "}
        {/* Share on Odnoklassniki */}
      </Button>
      {/* Telegram Share Button */} {/* Кнопка шеринга Telegram */}
      <Button
        variant={variant}
        size={buttonSize}
        onClick={() => openShareWindow(tgShareUrl)}
        title="Поделиться в Telegram" // Share on Telegram
      >
        <SendIcon />
        <span className="sr-only">Поделиться в Telegram</span>{" "}
        {/* Share on Telegram */}
      </Button>
      {/* TODO: Add button for RuTube if needed */}{" "}
      {/* TODO: Добавить кнопку для RuTube, если нужно */}
      {/*  */}
      {/* Copy Link Button */} {/* Кнопка копирования ссылки */}
      <Button
        variant={variant}
        size={buttonSize}
        onClick={copyToClipboard}
        title="Скопировать ссылку" // Copy link
      >
        <Copy />
        <span className="sr-only">Скопировать ссылку</span> {/* Copy link */}
      </Button>
    </div>
  );
};

export default ShareButtons;
