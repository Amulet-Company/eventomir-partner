"use client"; // Клиентский компонент, если используются хуки или интерактивность

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link"; // Импорт Link для навигации
import { FileTextIcon } from "lucide-react"; // Иконка для документов

// Компонент страницы "Документы"
const DocumentsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-6 w-6" />
            Документы
          </CardTitle>
          <CardDescription>
            Здесь вы можете ознакомиться с нашими юридическими документами.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li>
              <Link
                href="/documents/privacy-policy"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {" "}
                {/* Обновлен путь */}
                <FileTextIcon className="h-4 w-4" />
                Политика обработки персональных данных
              </Link>
            </li>
            <li>
              <Link
                href="/documents/terms-of-service"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {" "}
                {/* Обновлен путь */}
                <FileTextIcon className="h-4 w-4" />
                Пользовательское соглашение
              </Link>
            </li>
            <li>
              <Link
                href="/documents/offer-agreement"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {" "}
                {/* Обновлен путь */}
                <FileTextIcon className="h-4 w-4" />
                Договор-оферта на оказание услуг
              </Link>
            </li>
            <li>
              <Link
                href="/documents/cookie-policy"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {" "}
                {/* Обновлен путь */}
                <FileTextIcon className="h-4 w-4" />
                Политика в отношении файлов Cookie
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
