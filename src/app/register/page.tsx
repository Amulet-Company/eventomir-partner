"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import { getRussianRegionsWithCities } from "@/services/geo";
import { registerPartnerWithVerification } from "@/services/auth";

import {
  Mail,
  Loader2,
  User,
  Phone,
  Building,
  FileText,
  Lock,
  MapPin,
  CheckCircle2,
  Briefcase,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// --- VALIDATION SCHEMA ---
const formSchema = z
  .object({
    accountType: z.enum(
      ["selfEmployed", "individualEntrepreneur", "legalEntity", "agency"],
      { required_error: "Выберите тип аккаунта." },
    ),
    email: z.string().email("Введите корректный email."),
    password: z.string().min(8, "Минимум 8 символов."),
    name: z.string().min(6, "Минимум 6 символа."),
    companyName: z.string().optional(),
    phone: z
      .string()
      .regex(
        /^\+7 \d{3} \d{3} \d{2}-\d{2}$/,
        "Введите полный номер телефона (10 цифр).",
      ),
    inn: z.string().optional(),
    city: z.string().min(2, "Выберите город."),
    agreement: z.boolean().refine((val) => val === true, {
      message: "Необходимо согласиться с условиями.",
    }),
  })
  .superRefine((data, ctx) => {
    const needsCompanyAndInn = [
      "individualEntrepreneur",
      "legalEntity",
      "agency",
    ].includes(data.accountType);

    if (needsCompanyAndInn) {
      if (!data.companyName || data.companyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Укажите название компании или ИП.",
          path: ["companyName"],
        });
      }

      if (!data.inn || data.inn.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ИНН обязателен для данного типа аккаунта.",
          path: ["inn"],
        });
      } else {
        const innClean = data.inn.trim();

        if (data.accountType === "individualEntrepreneur") {
          if (!/^\d{10}$/.test(innClean)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Для ИП ИНН должен состоять ровно из 10 цифр.",
              path: ["inn"],
            });
          }
        } else if (["legalEntity", "agency"].includes(data.accountType)) {
          if (!/^\d{10,12}$/.test(innClean)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Для Юр. лица или Агентства ИНН должен содержать от 10 до 12 цифр.",
              path: ["inn"],
            });
          }
        }
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

const RegisterPartnerPage = () => {
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const referralId = searchParams.get("ref");

  const [cityInput, setCityInput] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    getRussianRegionsWithCities().then((data) => {
      const allCities = data.flatMap((r) => r.cities.map((c) => c.name));
      setCities(allCities);
    });
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "selfEmployed",
      email: "",
      password: "",
      name: "",
      phone: "",
      city: "",
      agreement: false,
    },
  });

  const accountType = form.watch("accountType");

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string) => void,
  ) => {
    const val = e.target.value;
    if (!val || val === "+7" || val === "+7 " || val === "+") {
      onChange("");
      return;
    }
    const digits = val.replace(/\D/g, "");
    if (!digits) return;

    let coreDigits = digits;
    if (digits.startsWith("7") || digits.startsWith("8")) {
      coreDigits = digits.slice(1);
    } else if (digits.startsWith("9")) {
      coreDigits = digits;
    }
    coreDigits = coreDigits.slice(0, 10);

    let formatted = "+7 ";
    if (coreDigits.length > 0) formatted += coreDigits.slice(0, 3);
    if (coreDigits.length >= 4) formatted += " " + coreDigits.slice(3, 6);
    if (coreDigits.length >= 7) formatted += " " + coreDigits.slice(6, 8);
    if (coreDigits.length >= 9) formatted += "-" + coreDigits.slice(8, 10);

    onChange(formatted);
  };

  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCityInput(val);
    form.setValue("city", val);
    if (val.length > 1) {
      setFilteredCities(
        cities
          .filter((c) => c.toLowerCase().startsWith(val.toLowerCase()))
          .slice(0, 5),
      );
    } else {
      setFilteredCities([]);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const cleanPhone = "+7" + values.phone.replace(/\D/g, "").slice(1);
      const result = await registerPartnerWithVerification(
        {
          accountType: values.accountType,
          email: values.email,
          name: values.name,
          companyName: values.companyName,
          phone: cleanPhone,
          inn: values.inn,
          city: values.city,
        },
        values.password,
        referralId,
      );

      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Что-то пошло не так. Проверьте введенные данные.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // --- ALREADY LOGGED IN STATE ---
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-multiply pointer-events-none"></div>

        <Card className="w-full max-w-[400px] text-center shadow-2xl shadow-slate-200/50 border-slate-200 bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="pb-4 pt-10">
            <div className="mx-auto bg-emerald-100 text-emerald-600 h-20 w-20 flex items-center justify-center rounded-full mb-6 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Вы уже авторизованы
            </CardTitle>
            <CardDescription className="text-sm mt-2 text-slate-500">
              Вы уже вошли в систему. Нет необходимости регистрироваться заново.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-10">
            <Button
              variant="outline"
              asChild
              className="w-full h-12 rounded-xl font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
              <Link href="/dashboard">
                Перейти в Дашборд <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-multiply pointer-events-none"></div>

        <Card className="w-full max-w-[440px] text-center shadow-2xl shadow-slate-200/50 border-slate-200 bg-white/90 backdrop-blur-xl rounded-[2rem] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="pb-4 pt-10">
            <div className="mx-auto bg-emerald-100 text-emerald-600 h-20 w-20 flex items-center justify-center rounded-full mb-6 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Заявка принята!
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <p className="text-slate-500 text-base leading-relaxed mb-8 font-medium">
              Мы отправили письмо со ссылкой для подтверждения на ваш Email.
              Пожалуйста, проверьте почту (включая папку "Спам").
            </p>
            <Button
              asChild
              className="w-full h-12 rounded-xl font-bold shadow-[0_4px_14px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.35)] transition-all"
            >
              <Link href="/login">Перейти ко входу</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- MAIN REGISTRATION STATE (Split Screen) ---
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden relative">
      {/* ======================= GLOBAL AMBIENT BACKGROUND ======================= */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-multiply pointer-events-none"></div>

      {/* ======================= LEFT PANE (BRANDING) ======================= */}
      {/* Fixed on desktop, hidden on mobile */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-100/30  z-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter transition-colors text-primary"
          >
            Eventomir <span className="opacity-70 font-medium">Партнер</span>
          </Link>
        </div>

        <div className=" space-y-8 max-w-xl py-8">
          <div className="p-5 rounded-2xl bg-white/80 border border-white/60 backdrop-blur-md shadow-xl shadow-slate-200/50 w-72 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-200/50">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Потенциальные клиенты
                </p>
                <p className="text-xl font-black text-slate-900">
                  10,000+ в месяц
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 shadow-inner">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[100%] shadow-sm"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary" /> B2B Платформа
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
              Присоединяйтесь к сообществу <br />
              <span className="text-primary">профессионалов.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
              Находите новые заказы, автоматизируйте бронирования и
              масштабируйте свой бизнес вместе с нами.
            </p>
          </div>
        </div>
      </div>

      {/* ======================= RIGHT PANE (REGISTRATION FORM) ======================= */}
      {/* Takes full width on mobile, right half on desktop. Scrolls naturally. */}
      <div className="flex w-full lg:w-1/2 lg:ml-auto min-h-screen items-center justify-center p-4 sm:px-8 sm:py-4 relative z-10">
        <Card className="w-full max-w-[500px] shadow-2xl shadow-slate-200/60 border-slate-200 bg-white/90 lg:bg-white/60 backdrop-blur-2xl rounded-[2rem] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500 my-4">
          <CardHeader className="space-y-2 pt-10 pb-6 text-center border-b border-slate-100">
            <div className="lg:hidden mb-2">
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                Eventomir{" "}
                <span className="opacity-80 font-medium text-slate-900">
                  Партнер
                </span>
              </h1>
            </div>

            <CardTitle className="text-2xl font-bold text-slate-900 hidden lg:block">
              Создание аккаунта
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-500">
              Заполните данные для регистрации на платформе
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-10 pt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 text-left"
              >
                {/* ACCOUNT TYPE RADIOS */}
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                        Тип аккаунта
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-3"
                        >
                          {/* Option 1: Самозанятый */}
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="selfEmployed"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary text-slate-500 cursor-pointer transition-all h-full shadow-sm">
                              <User className="mb-2 h-5 w-5" />
                              <span className="text-xs font-bold text-center leading-tight">
                                Самозанятый
                              </span>
                            </FormLabel>
                          </FormItem>
                          {/* Option 2: ИП */}
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="individualEntrepreneur"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary text-slate-500 cursor-pointer transition-all h-full shadow-sm">
                              <Briefcase className="mb-2 h-5 w-5" />
                              <span className="text-xs font-bold text-center leading-tight">
                                ИП
                              </span>
                            </FormLabel>
                          </FormItem>
                          {/* Option 3: Юр. лицо */}
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="legalEntity"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary text-slate-500 cursor-pointer transition-all h-full shadow-sm">
                              <Building className="mb-2 h-5 w-5" />
                              <span className="text-xs font-bold text-center leading-tight">
                                Юр. лицо
                              </span>
                            </FormLabel>
                          </FormItem>
                          {/* Option 4: Агентство */}
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="agency"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary text-slate-500 cursor-pointer transition-all h-full shadow-sm">
                              <Users className="mb-2 h-5 w-5" />
                              <span className="text-xs font-bold text-center leading-tight">
                                Агентство
                              </span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="ml-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* NAME */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                        {["selfEmployed", "individualEntrepreneur"].includes(
                          accountType,
                        )
                          ? "ФИО руководителя"
                          : "Контактное лицо"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            className="pl-12 h-12 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/50 transition-all text-sm shadow-sm"
                            placeholder={
                              [
                                "selfEmployed",
                                "individualEntrepreneur",
                              ].includes(accountType)
                                ? "Иванов Иван Иванович"
                                : "Менеджер Иван"
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="ml-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* COMPANY DETAILS (Conditional) */}
                {["individualEntrepreneur", "legalEntity", "agency"].includes(
                  accountType,
                ) && (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 animate-in fade-in zoom-in-95 shadow-sm">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                            Название (необязательно)
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Input
                                className="pl-12 h-12 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/50 transition-all text-sm shadow-sm"
                                placeholder="Например, Eventomir Agency"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="ml-1 text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                            ИНН
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Input
                                className="pl-12 h-12 rounded-xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/50 transition-all text-sm font-mono shadow-sm"
                                placeholder="10 или 12 цифр"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="ml-1 text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            className="pl-12 h-12 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/50 transition-all text-sm shadow-sm"
                            type="email"
                            placeholder="mail@example.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="ml-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* GRID: PHONE & CITY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                          Телефон
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              className="pl-12 h-12 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/50 transition-all text-sm shadow-sm"
                              placeholder="+7 999 000 00-00"
                              value={field.value}
                              onChange={(e) =>
                                handlePhoneChange(e, field.onChange)
                              }
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="ml-1 text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                          Город
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                              className="pl-12 h-12 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/50 transition-all text-sm shadow-sm"
                              placeholder="Поиск города..."
                              value={cityInput}
                              onChange={handleCitySearch}
                              onBlur={field.onBlur}
                            />
                          </div>
                        </FormControl>
                        {filteredCities.length > 0 && (
                          <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-2 py-2 overflow-hidden animate-in fade-in">
                            {filteredCities.map((city) => (
                              <div
                                key={city}
                                className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 transition-colors"
                                onClick={() => {
                                  setCityInput(city);
                                  form.setValue("city", city);
                                  setFilteredCities([]);
                                }}
                              >
                                {city}
                              </div>
                            ))}
                          </div>
                        )}
                        <FormMessage className="ml-1 text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* PASSWORD */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-xs uppercase tracking-wider text-slate-500 ml-1">
                        Пароль
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            className="pl-12 h-12 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/50 transition-all text-sm shadow-sm"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="ml-1 text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* AGREEMENT */}
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl transition-colors hover:bg-slate-100/50 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-tight">
                        <FormLabel className="text-xs font-medium text-slate-500 cursor-pointer">
                          Я принимаю{" "}
                          <Link
                            href="/documents/terms-of-service"
                            target="_blank"
                            className="text-slate-900 hover:text-primary transition-colors underline underline-offset-2"
                          >
                            Пользовательское соглашение
                          </Link>{" "}
                          и{" "}
                          <Link
                            href="/documents/privacy-policy"
                            target="_blank"
                            className="text-slate-900 hover:text-primary transition-colors underline underline-offset-2"
                          >
                            Политику обработки данных
                          </Link>
                          . *
                        </FormLabel>
                        <FormMessage className="text-xs text-red-500" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 mt-6 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(249,115,22,0.25)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  {isSubmitting ? "Создание аккаунта..." : "Зарегистрироваться"}
                </Button>

                <div className="mt-8 text-center text-xs font-medium text-slate-500">
                  Уже есть аккаунт?{" "}
                  <Link
                    href="/login"
                    className="text-slate-900 font-bold hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    Войти
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPartnerPage;
