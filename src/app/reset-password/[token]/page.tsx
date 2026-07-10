"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Clock,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageAlert, AlertVariant } from "@/components/ui/alert";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Минимум 8 символов.",
      })
      .regex(/[A-Z]/, {
        message: "Должно содержать как минимум одну заглавную букву.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

interface AlertState {
  type: AlertVariant;
  message: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { toast } = useToast();

  // --- STATE ---
  const [isExpired, setIsExpired] = useState(false);

  // Resend State
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendAlert, setResendAlert] = useState<AlertState | null>(null);

  // Main Form State
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // --- 1. CHECK TOKEN EXPIRATION ON LOAD ---
  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const payload = JSON.parse(jsonPayload);
        const now = Date.now() / 1000;

        if (payload.exp && now > payload.exp) {
          setIsExpired(true);
        }
      } catch (e) {
        setIsExpired(true);
      }
    }
  }, [token]);

  // --- 2. HANDLER: RESEND LINK (If token expired) ---
  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);
    setResendAlert(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resendEmail || !emailRegex.test(resendEmail)) {
      setResendAlert({
        type: "error",
        message: "Введите корректный Email адрес",
      });
      setIsResending(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password/partner`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resendEmail }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        setResendAlert({
          type: "success",
          message: "Новая ссылка отправлена на вашу почту!",
        });
      } else {
        setResendAlert({
          type: "error",
          message: data.message || "Не удалось отправить ссылку.",
        });
      }
    } catch (err) {
      setResendAlert({
        type: "error",
        message: "Ошибка соединения с сервером",
      });
    } finally {
      setIsResending(false);
    }
  };

  // --- 3. HANDLER: SUBMIT NEW PASSWORD ---
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAlert(null);
    const { password, confirmPassword } = values;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirmPassword }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Пароль изменен!",
          description: "Теперь вы можете войти с новым паролем.",
          variant: "success",
        });
        router.push("/login");
      } else {
        setAlert({
          type: "error",
          message: data.message || "Произошла ошибка при сохранении пароля.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Ошибка подключения. Не удалось связаться с сервером.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // VIEW 1: EXPIRED TOKEN UI
  // ==========================================
  if (isExpired) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-muted/10 md:bg-transparent">
        <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="pt-10 pb-6 px-6 md:px-8 text-center flex flex-col items-center">
            <div className="relative flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-amber-100 dark:bg-amber-500/20 rounded-full animate-pulse" />
              <div className="relative bg-amber-100 dark:bg-amber-500/20 rounded-full p-4 ring-8 ring-amber-50 dark:ring-amber-500/10">
                <Clock className="w-10 h-10 text-amber-600 dark:text-amber-500" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">
              Ссылка устарела
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Срок действия этой ссылки для сброса пароля истек. Пожалуйста,
              введите ваш email, чтобы запросить новую.
            </p>
          </div>

          <CardContent className="px-6 pb-8 md:px-8">
            {resendAlert && (
              <MessageAlert
                variant={resendAlert.type}
                message={resendAlert.message}
                className="mb-6"
              />
            )}

            <form onSubmit={handleResendLink} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="example@mail.com"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  disabled={isResending}
                  className="pl-11 h-12 rounded-xl bg-muted/40 focus:bg-background transition-all border-muted-foreground/20 text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={isResending || !resendEmail}
                className="w-full h-12 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                {isResending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isResending ? "Отправка..." : "Отправить новую ссылку"}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться ко входу
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE TOKEN (RESET PASSWORD UI)
  // ==========================================
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-muted/10 md:bg-transparent">
      <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-2 pt-10 pb-6 text-center">
          <CardTitle className="text-3xl font-black text-foreground tracking-tight">
            Новый пароль
          </CardTitle>
          <CardDescription className="text-base md:text-sm font-medium px-4">
            Придумайте надежный пароль. Мы рекомендуем использовать буквы
            разного регистра и цифры.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-10 md:px-8">
          {alert && (
            <MessageAlert
              variant={alert.type}
              message={alert.message}
              className="mb-6"
            />
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* PASSWORD FIELD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold ml-1 text-sm text-foreground/80">
                      Новый пароль
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        {/* 🚨 FIX: Replaced Mail with Lock icon */}
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />

                        <Input
                          placeholder="••••••••"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pl-11 pr-11 h-12 rounded-xl bg-muted/40 focus:bg-background transition-all border-muted-foreground/20 text-base"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1 text-xs" />
                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD FIELD */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold ml-1 text-sm text-foreground/80">
                      Подтвердить пароль
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />

                        <Input
                          placeholder="••••••••"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-11 pr-11 h-12 rounded-xl bg-muted/40 focus:bg-background transition-all border-muted-foreground/20 text-base"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-2 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] group"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isSubmitting ? (
                  "Сохранение..."
                ) : (
                  <span className="flex items-center">
                    Сохранить пароль{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
