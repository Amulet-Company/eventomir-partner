"use client"; // Клиентский компонент для использования ScrollArea

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link"; // Импорт Link

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Политика в отношении файлов Cookie</CardTitle>
          <CardDescription>
            Общество с ограниченной ответственностью «ООО "Eventomir"»{" "}
            {/* ЗАМЕНИТЬ НА ПОЛНОЕ ЮР. ЛИЦО */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4 text-sm">
            <h2 className="text-lg font-semibold mb-2">
              1. Что такое файлы Cookie?
            </h2>
            <p className="mb-4">
              Файлы cookie (куки) — это небольшие текстовые файлы, которые
              веб-сайты сохраняют на вашем компьютере или мобильном устройстве
              при их посещении. Они позволяют сайту запоминать ваши действия и
              предпочтения (например, язык, размер шрифта, данные для входа) на
              определенный период времени, чтобы вам не приходилось вводить их
              заново при каждом посещении сайта или переходе между страницами.
            </p>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              2. Как мы используем файлы Cookie?
            </h2>
            <p className="mb-4">
              Платформа Eventomir (https://eventomir.ru) использует файлы cookie
              для следующих целей:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <strong>Обеспечение функционирования Платформы:</strong>{" "}
                Некоторые файлы cookie необходимы для корректной работы
                Платформы, например, для поддержания сессии аутентифицированного
                пользователя (чтобы вам не приходилось входить в систему на
                каждой странице) и запоминания вашего согласия на использование
                cookie. (Категория: Строго необходимые)
              </li>
              <li>
                <strong>Аналитика и улучшение:</strong> Мы используем
                аналитические cookie (например, от сервисов Яндекс.Метрика,
                Google Analytics) для сбора обезличенной информации о том, как
                Пользователи взаимодействуют с Платформой. Это помогает нам
                понять, какие разделы наиболее популярны, как пользователи
                перемещаются по сайту, и выявить возможные проблемы. Эти данные
                используются для улучшения работы Платформы и пользовательского
                опыта. (Категория: Аналитические/Статистические)
              </li>
              <li>
                <strong>Функциональность:</strong> Эти файлы cookie позволяют
                Платформе запоминать сделанный вами выбор (например, выбранный
                город или язык интерфейса) и предоставлять улучшенные, более
                персонализированные функции. (Категория: Функциональные)
              </li>
              {/* <li>
                                <strong>Маркетинг и реклама (если применимо):</strong> С вашего согласия мы или наши партнеры можем использовать маркетинговые cookie для отслеживания ваших посещений Платформы, страниц, которые вы посетили, и ссылок, по которым вы переходили. Эта информация может использоваться для показа вам более релевантной рекламы на других сайтах. (Категория: Маркетинговые)
                            </li> */}
            </ul>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              3. Типы используемых файлов Cookie
            </h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <strong>Сеансовые cookie:</strong> Эти файлы cookie существуют
                только во время вашего сеанса на Платформе и автоматически
                удаляются при закрытии браузера.
              </li>
              <li>
                <strong>Постоянные cookie:</strong> Эти файлы cookie остаются на
                вашем устройстве в течение определенного периода времени или до
                тех пор, пока вы их не удалите вручную. Они помогают нам
                узнавать вас как вернувшегося посетителя.
              </li>
              <li>
                <strong>Основные cookie (First-party cookies):</strong>{" "}
                Устанавливаются непосредственно Платформой Eventomir.
              </li>
              <li>
                <strong>Сторонние cookie (Third-party cookies):</strong>{" "}
                Устанавливаются другими доменами, например, сервисами аналитики
                (Яндекс.Метрика, Google Analytics) или социальными сетями (если
                интегрированы виджеты). Мы не контролируем использование этих
                cookie, и вам следует ознакомиться с политиками
                конфиденциальности соответствующих третьих сторон.
              </li>
            </ul>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              4. Управление файлами Cookie
            </h2>
            <p className="mb-4">
              При первом посещении Платформы вы увидите баннер, запрашивающий
              ваше согласие на использование файлов cookie. Вы можете принять
              все cookie, отказаться от необязательных cookie или настроить свои
              предпочтения.
            </p>
            <p className="mb-4">
              Вы также можете управлять файлами cookie через настройки вашего
              веб-браузера. Большинство браузеров позволяют:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                Просматривать сохраненные cookie и удалять их по отдельности или
                все сразу.
              </li>
              <li>Блокировать сторонние cookie.</li>
              <li>Блокировать cookie с определенных сайтов.</li>
              <li>Блокировать установку всех cookie.</li>
              <li>Удалять все cookie при закрытии браузера.</li>
            </ul>
            <p className="mb-4">
              Обратите внимание, что отключение или удаление некоторых файлов
              cookie (особенно строго необходимых) может привести к нарушению
              работы Платформы или ограничению доступа к некоторым ее функциям.
            </p>
            <p className="mb-4">
              Информацию о настройках cookie для популярных браузеров можно
              найти по ссылкам:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/ru/kb/uluchshyonnaya-zashita-ot-otslezhivaniya-v-firefox-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari (macOS)
                </a>{" "}
                /{" "}
                <a
                  href="https://support.apple.com/ru-ru/HT201265"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari (iOS)
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/ru-ru/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a
                  href="https://help.opera.com/ru/latest/web-preferences/#cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Opera
                </a>
              </li>
            </ul>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              5. Изменения в Политике
            </h2>
            <p className="mb-4">
              Мы можем время от времени обновлять настоящую Политику в отношении
              файлов Cookie. Мы рекомендуем вам периодически просматривать эту
              страницу для получения актуальной информации о том, как мы
              используем файлы cookie.
            </p>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              6. Контактная информация
            </h2>
            <p className="mb-4">
              Если у вас есть вопросы относительно нашей политики использования
              cookie, пожалуйста, свяжитесь с нами по адресу электронной почты:
              [Ваш email для связи] или ознакомьтесь с нашей полной{" "}
              <Link
                href="/documents/privacy-policy"
                className="text-primary hover:underline"
              >
                Политикой обработки персональных данных
              </Link>
              .
            </p>
            <p className="mt-8 font-semibold">ООО «ООО "Eventomir"»</p>{" "}
            {/* ЗАМЕНИТЬ */}
            <p className="text-xs">
              Дата публикации: [Дата публикации, например, 19 Августа 2024 г.]
            </p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookiePolicyPage;
