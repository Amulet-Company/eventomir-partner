"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageAlert, AlertVariant } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Введите корректный email адрес." }),
});

type formData = z.infer<typeof formSchema>;

interface AlertState {
  type: AlertVariant;
  message: string;
}

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("v") || searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>("Проверяем ваш токен...");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage("Токен верификации не найден.");
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email?token=${token}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Ваш аккаунт успешно подтвержден! Перенаправляем...");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(
            data.message || "Ошибка верификации. Ссылка могла устареть.",
          );
        }
      } catch (error) {
        setMessage("Произошла ошибка сети. Попробуйте позже.");
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, router]);

  // ==========================================
  // VIEW: LOADING
  // ==========================================
  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-muted/10 md:bg-transparent">
        <Card className="w-full max-w-[420px] shadow-xl border-border/40 rounded-[2rem] overflow-hidden bg-background/80 backdrop-blur-xl p-10 flex flex-col items-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <h2 className="text-xl font-semibold tracking-tight mb-2">
            Обработка...
          </h2>
          <p className="text-muted-foreground text-sm">{message}</p>
        </Card>
      </div>
    );
  }

  // ==========================================
  // VIEW: SUCCESS
  // ==========================================
  if (status === "success") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-4 bg-muted/10 md:bg-transparent">
        <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="pt-12 pb-6 px-6 text-center flex flex-col items-center">
            <div className="relative flex items-center justify-center w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-full animate-pulse" />
              <div className="relative bg-emerald-100 dark:bg-emerald-500/20 rounded-full p-4 ring-8 ring-emerald-50 dark:ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">
              Успешно!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed px-2">
              {message}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // ==========================================
  // VIEW: ERROR (Includes Resend Form)
  // ==========================================
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-4 bg-muted/10 md:bg-transparent">
      <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="py-6  px-4 text-center flex flex-col items-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-red-100 dark:bg-red-500/20 rounded-full animate-pulse" />
            <div className="relative bg-red-100 dark:bg-red-500/20 rounded-full p-4 ring-8 ring-red-50 dark:ring-red-500/10">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
            Ошибка
          </h2>
          <p className="text-muted-foreground text-sm ">{message}</p>
        </div>

        <CardContent className="px-6 pb-8">
          <ResendVerificationForm />
        </CardContent>
      </Card>
    </div>
  );
};

// ==========================================
// RESEND FORM COMPONENT
// ==========================================
function ResendVerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Cooldown timer state for Rate Limiting visual feedback
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // Handle countdown logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const onSubmit = async (values: formData) => {
    if (cooldown > 0) return;

    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setAlert({ type: "success", message: data.message });
        setCooldown(60); // Start 60 second cooldown
        form.reset();
      } else {
        if (response.status === 429) {
          setCooldown(60); // Sync frontend timer with backend 429 Rate Limit
        }
        setAlert({
          type: "error",
          message: data.message || "Произошла ошибка.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Ошибка подключения к серверу." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 border-t border-border/50">
      {/* <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-foreground">
          Запросить новую ссылку
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Введите email, указанный при регистрации
        </p>
      </div> */}

      {alert && (
        <MessageAlert
          variant={alert.type}
          message={alert.message}
          className="mb-4"
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel className="font-semibold text-sm text-foreground/80">
                  Email
                </FormLabel> */}
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="example@mail.ru"
                      type="email"
                      {...field}
                      disabled={isSubmitting || cooldown > 0}
                      className="pl-11 h-12 rounded-xl bg-muted/40 focus:bg-background transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            disabled={isSubmitting || cooldown > 0}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {cooldown > 0
              ? `Подождите ${cooldown} сек.`
              : isSubmitting
                ? "Отправка..."
                : "Отправить новую ссылку"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

//  Wrap useSearchParams in Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
