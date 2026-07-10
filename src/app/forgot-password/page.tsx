"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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

// Validation Schema
const formSchema = z.object({
  email: z.string().email({
    message: "Пожалуйста, введите корректный адрес электронной почты.",
  }),
});

interface AlertState {
  type: AlertVariant;
  message: string;
}

export default function ForgotPasswordPage() {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAlert(null);
    const { email } = values;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password/partner`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        },
      );
      const data = await res.json();
      if (res.status === 200) {
        setIsSuccess(true);
        toast({
          title: "Запрос успешно обработан",
          variant: "success",
        });
      } else {
        setAlert({
          type: "error",
          message: data.message || "Произошла неизвестная ошибка при отправке.",
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
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-muted/10 md:bg-transparent">
        <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="pt-12 pb-6 px-6 md:px-8 text-center flex flex-col items-center">
            {/* Elegant Icon with concentric ring effect */}
            <div className="relative flex items-center justify-center w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-full animate-pulse" />
              <div className="relative bg-emerald-100 dark:bg-emerald-500/20 rounded-full p-4 ring-8 ring-emerald-50 dark:ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
              </div>
            </div>

            {/* Improved Typography & Contrast */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
              Проверьте почту!
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed px-2">
              Мы отправили инструкции по сбросу пароля на указанный вами адрес,
              если он существует в нашей системе.
            </p>
          </div>

          <CardContent className="px-6 pb-10 md:px-8">
            {/* Sleek, highly clickable action button */}
            <Link
              href="/login"
              className="flex items-center justify-center w-full h-12 md:h-10 rounded-xl md:rounded-lg bg-primary font-bold text-primary-foreground md:text-sm shadow-md hover:shadow-lg transition-all"
            >
              Вернуться ко входу
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-4 bg-muted/10 md:bg-transparent">
      <Card className="w-full max-w-[420px] md:max-w-[380px] shadow-none  border-none md:border-border/50 rounded-[2rem] md:rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-2 md:space-y-1.5 pt-8 md:pt-8 pb-6 md:pb-4 text-center">
          <CardTitle className="text-3xl md:text-2xl font-extrabold tracking-tight">
            {/* <Link
              href="/login"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Назад ко входу
            </Link> */}

            <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">
              Восстановление
            </h2>
          </CardTitle>
          <CardDescription className="text-base md:text-sm font-semibold">
            Введите ваш Email адрес, и мы отправим вам ссылку для безопасного
            сброса пароля.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 md:px-8 md:pb-8">
          {/* Reusable Alert Component */}
          {alert && (
            <MessageAlert
              variant={alert.type}
              message={alert.message}
              className="mb-2"
            />
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 md:space-y-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold ml-1 text-sm md:text-xs text-foreground/80">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-4 md:w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />

                        <Input
                          placeholder="example@mail.com"
                          {...field}
                          type="email"
                          className="pl-11 md:pl-10 h-12 md:h-10 rounded-xl md:rounded-lg bg-muted/40 focus:bg-background transition-all border-muted-foreground/20 text-base md:text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1 text-xs" />
                  </FormItem>
                )}
              />

              {/* Tighter submit button */}
              <Button
                type="submit"
                className="w-full h-12 md:h-10 rounded-xl md:rounded-lg font-bold text-base md:text-sm shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 md:h-4 md:w-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Отправка..." : "Ссылка для сброса пароля"}
              </Button>
            </form>
          </Form>
          <p className="mt-10 text-sm text-muted-foreground font-medium">
            Вспомнили пароль?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-bold"
            >
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
