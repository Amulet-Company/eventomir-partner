"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentSubscription, UserSubscription } from "@/services/payment";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Gem, CalendarClock, CreditCard } from "lucide-react";
import Link from "next/link";

export default function SubscriptionStatusCard() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSub() {
      try {
        const sub = await getCurrentSubscription();
        setSubscription(sub);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSub();
  }, []);

  if (loading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (!subscription || subscription.status !== "ACTIVE") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="p-3 bg-muted rounded-full">
            <Gem className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Нет активной подписки</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Подключите тариф, чтобы получать больше заказов и выделиться среди
              конкурентов.
            </p>
          </div>
          <Button asChild>
            <Link href="/pricing">Выбрать тариф</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-sm">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              {subscription.planName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Активный тарифный план
            </p>
          </div>
          <Badge className="bg-green-600">Активна</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 grid sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <CalendarClock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Следующее списание</p>
            <p className="font-medium text-sm">
              {subscription.endDate
                ? format(new Date(subscription.endDate), "d MMMM yyyy", {
                    locale: ru,
                  })
                : "Бессрочно"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <CreditCard className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Стоимость</p>
            <p className="font-medium text-sm">
              {subscription.pricePaid > 0
                ? `${subscription.pricePaid.toLocaleString()} ₽`
                : "Бесплатно"}
            </p>
          </div>
        </div>

        <div className="sm:col-span-2 mt-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">Изменить тариф</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
