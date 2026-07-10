"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, redirect } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Copy,
  Users,
  DollarSign,
  Handshake,
  Eye,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

import { usePartnerDashboard, useRequestPayout } from "@/services/dashboard";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
    <Skeleton className="h-80 rounded-xl" />
  </div>
);

export default function PartnerDashboardPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("v");
  const hasAttemptedTransfer = useRef(false);

  const mainAppUrl =
    process.env.NEXT_PUBLIC_WEB_APP_URL || "https://app.eventomir.ru";
  const userId = session?.user?.id;

  useEffect(() => {
    if (token && !hasAttemptedTransfer.current) {
      hasAttemptedTransfer.current = true;
      signIn("credentials", { transferToken: token, redirect: false }).then(
        (res) => {
          if (res?.ok) router.replace("/dashboard");
          else {
            toast({
              variant: "destructive",
              title: "Ошибка",
              description: "Срок действия ссылки истек.",
            });
            window.location.href = `${mainAppUrl}/login`;
          }
        },
      );
    } else if (status === "unauthenticated" && !token) {
      window.location.href = `${mainAppUrl}/login`;
    }
  }, [token, status, router, mainAppUrl, toast]);

  if (status === "authenticated") {
    if (!session?.user?.role || session.user.role === "") {
      redirect("/complete-registration");
    } else if (session.user.role !== "partner") {
      return (
        <div className="container mx-auto pt-32 pb-20 text-center max-w-xl px-4">
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Доступ запрещен</h2>
          <Button
            className="mt-6"
            onClick={() => (window.location.href = mainAppUrl)}
          >
            Вернуться
          </Button>
        </div>
      );
    }
  }

  const isReadyToFetch =
    status === "authenticated" && !!userId && session?.user?.role === "partner";

  const {
    data: dashboardData,
    isLoading,
    error,
  } = usePartnerDashboard(isReadyToFetch ? userId : undefined);
  const requestPayoutMutation = useRequestPayout();

  if (
    status === "loading" ||
    (token && !hasAttemptedTransfer.current) ||
    isLoading
  ) {
    return (
      <div className="container mx-auto pt-28 pb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="container mx-auto pt-32 pb-20 text-center max-w-xl px-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Ошибка загрузки данных</h2>
      </div>
    );
  }

  const {
    referralId,
    balance,
    totalEarned,
    totalRegistrations,
    clicks,
    monthlyRevenue,
    referralEvents,
    minPayout,
    paymentDetails,
  } = dashboardData;
  const canRequestPayout = balance >= minPayout;

  const handleCopyToClipboard = () => {
    if (!dashboardData) return;
    const referralLink = `${mainAppUrl}/register-performer?ref=${referralId}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Скопировано!",
      description: "Реферальная ссылка скопирована в буфер обмена.",
    });
  };

  return (
    // 🚨 ADDED px-4 sm:px-6 lg:px-8 to give the container proper breathing room on mobile edges
    <div className="container mx-auto pt-24 pb-12 md:pt-32 md:pb-20 space-y-6 md:space-y-8 max-w-6xl animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8">
      <div className="mb-2 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Кабинет партнера
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Отслеживайте статистику и управляйте финансами.
        </p>
      </div>

      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white shadow-sm overflow-hidden">
        {/* Adjusted padding on mobile: p-4 vs md:p-8 */}
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-end gap-3 md:gap-4 p-5 md:p-8">
          <div className="flex-grow w-full">
            <Label
              htmlFor="referralLink"
              className="text-emerald-800 font-bold mb-2 block text-xs md:text-sm uppercase tracking-wider"
            >
              Ваша реферальная ссылка
            </Label>
            <Input
              id="referralLink"
              readOnly
              className="bg-white border-emerald-200 font-mono text-sm md:text-base py-5 md:py-6 shadow-sm focus-visible:ring-emerald-500"
              value={`${mainAppUrl}/register-performer?ref=${referralId}`}
            />
          </div>
          <Button
            size="lg"
            onClick={handleCopyToClipboard}
            className="w-full sm:w-auto mt-1 sm:mt-0 shrink-0 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 h-11 md:h-12"
          >
            <Copy className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Скопировать
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        {/* Added overflow-x-auto so tabs don't squish on tiny screens */}
        <ScrollArea className="w-full mb-6 md:mb-8">
          <TabsList className="flex w-max min-w-full md:min-w-0 md:grid md:max-w-md md:grid-cols-3 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg flex-1">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg flex-1">
              События
            </TabsTrigger>
            <TabsTrigger value="payouts" className="rounded-lg flex-1">
              Выплаты
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-1.5 md:gap-2">
                  <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />{" "}
                  Баланс
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-3xl font-black text-emerald-600 truncate">
                  {balance.toLocaleString("ru-RU")} ₽
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-1.5 md:gap-2">
                  <Handshake className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />{" "}
                  Доход
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-slate-900 truncate">
                  {totalEarned.toLocaleString("ru-RU")} ₽
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-1.5 md:gap-2">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500" />{" "}
                  Регистраций
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-slate-900 truncate">
                  +{totalRegistrations}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 p-4 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-1.5 md:gap-2">
                  <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" />{" "}
                  Клики
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-3xl font-bold text-slate-900 truncate">
                  {clicks}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">
                Доход по месяцам
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] md:h-[350px] p-2 sm:p-6">
              <ChartContainer
                config={{
                  total: { label: "Доход (₽)", color: "hsl(var(--primary))" },
                }}
                className="h-full w-full"
              >
                <BarChart
                  data={monthlyRevenue}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip
                    cursor={{ fill: "transparent" }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events" className="mt-4 md:mt-6">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">События</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] md:h-[500px] w-full">
                <Table>
                  <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                    <TableRow>
                      <TableHead className="font-bold text-xs md:text-sm">
                        Дата
                      </TableHead>
                      <TableHead className="font-bold text-xs md:text-sm">
                        Событие
                      </TableHead>
                      <TableHead className="font-bold text-xs md:text-sm hidden sm:table-cell">
                        Пользователь
                      </TableHead>
                      <TableHead className="text-right font-bold text-xs md:text-sm">
                        Сумма
                      </TableHead>
                      <TableHead className="font-bold text-center text-xs md:text-sm">
                        Статус
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralEvents?.map((event: any) => (
                      <TableRow
                        key={event.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="text-muted-foreground text-xs md:text-sm">
                          {new Date(event.createdAt).toLocaleDateString(
                            "ru-RU",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            },
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-xs md:text-sm">
                          {event.eventType === "registration"
                            ? "Рега"
                            : "Оплата"}
                          {/* Mobile-only user ID fallback */}
                          <span className="block sm:hidden text-[10px] text-muted-foreground mt-0.5">
                            ID: {event.referredUserId.substring(0, 5)}**
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-500 hidden sm:table-cell">
                          {event.referredUserId.substring(0, 8)}***
                        </TableCell>
                        <TableCell className="text-right font-bold text-xs md:text-sm">
                          {event.commissionAmount ? (
                            <span className="text-emerald-600">
                              +{event.commissionAmount} ₽
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {event.status === "paid" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-800">
                              Оплачено
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold bg-amber-100 text-amber-800">
                              Ожидание
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!referralEvents || referralEvents.length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-48 text-center text-muted-foreground text-sm"
                        >
                          Событий пока нет.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYOUTS TAB */}
        <TabsContent value="payouts" className="mt-4 md:mt-6">
          <Card className="max-w-xl shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b p-5 md:p-6">
              <CardTitle className="text-lg md:text-xl">
                Запрос выплаты
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Минимальная сумма: {minPayout.toLocaleString("ru-RU")} ₽.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-5 md:p-6">
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-500 mb-1">
                  Доступно к выводу
                </p>
                <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {balance.toLocaleString("ru-RU")}{" "}
                  <span className="text-2xl md:text-3xl text-slate-400 font-bold">
                    ₽
                  </span>
                </div>
              </div>

              {!canRequestPayout && (
                <div className="flex items-start gap-2.5 md:gap-3 text-xs md:text-sm text-amber-800 bg-amber-50 p-3.5 md:p-4 rounded-xl border border-amber-200">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-amber-600 mt-0.5" />
                  <p>
                    Необходимо накопить еще{" "}
                    <strong className="font-bold">
                      {(minPayout - balance).toLocaleString("ru-RU")} ₽
                    </strong>
                    .
                  </p>
                </div>
              )}
              {canRequestPayout && !paymentDetails && (
                <div className="flex items-start gap-2.5 md:gap-3 text-xs md:text-sm text-red-800 bg-red-50 p-3.5 md:p-4 rounded-xl border border-red-200">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-red-600 mt-0.5" />
                  <p>
                    Укажите банковские реквизиты в настройках профиля перед
                    запросом выплаты.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-5 md:p-6">
              <Button
                size="lg"
                className="w-full md:w-auto font-bold shadow-md hover:shadow-lg transition-all h-12"
                onClick={() => requestPayoutMutation.mutate(userId!)}
                disabled={
                  !canRequestPayout ||
                  !paymentDetails ||
                  requestPayoutMutation.isPending
                }
              >
                {requestPayoutMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <DollarSign className="mr-2 h-5 w-5" />
                )}
                Оформить заявку
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
