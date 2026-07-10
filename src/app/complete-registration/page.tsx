"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import {
  User,
  Briefcase,
  Building,
  Users,
  MapPin,
  Phone,
  Loader2,
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

// Services
import { completeOAuthRegistration } from "@/services/auth";
import { getRussianRegionsWithCities } from "@/services/geo";

const CompleteRegistrationPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [accountType, setAccountType] = useState<string>("selfEmployed");
  const [companyName, setCompanyName] = useState("");
  const [inn, setINN] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions, setRegions] = useState<
    { name: string; cities: { name: string }[] }[]
  >([]);
  const [cityInput, setCityInput] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);

  // 1. Check Authentication and Role Status
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // 2. Fetch City/Region Data
  useEffect(() => {
    getRussianRegionsWithCities()
      .then(setRegions)
      .catch((err) => console.error("Failed to load regions:", err));
  }, []);

  // 3. Handle City Autocomplete
  const handleCityInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setCityInput(input);
      setCity(input);

      if (input.length >= 2 && regions.length > 0) {
        const results = regions.flatMap((region) =>
          region.cities
            .map((c) => c.name)
            .filter((cityName) =>
              cityName.toLowerCase().startsWith(input.toLowerCase()),
            ),
        );
        setAutocompleteResults([...new Set(results)].slice(0, 10)); // Max 10 results
      } else {
        setAutocompleteResults([]);
      }
    },
    [regions],
  );

  // 4. Handle Phone Number Masking (+7 (XXX) XXX-XX-XX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!input || input === "+7" || input === "+7 (" || input === "+") {
      setPhone("");
      return;
    }

    let digits = input.replace(/\D/g, "");
    if (digits.startsWith("7") || digits.startsWith("8"))
      digits = digits.slice(1);
    if (digits.startsWith("9")) digits = digits;
    digits = digits.slice(0, 10);

    let formatted = "+7";
    if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`;
    if (digits.length >= 4) formatted += `) ${digits.slice(3, 6)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(6, 8)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(8, 10)}`;

    setPhone(formatted);
  };

  // 5. Submit Registration
  const handleComplete = async () => {
    const needsCompanyNameAndINN = [
      "legalEntity",
      "individualEntrepreneur",
      "agency",
    ].includes(accountType);

    if (
      needsCompanyNameAndINN &&
      (!companyName || companyName.trim().length < 2)
    ) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Укажите название компании или ИП.",
      });
      return;
    }

    if (
      needsCompanyNameAndINN &&
      (!inn || !/^\d{10}$|^\d{12}$/.test(inn.trim()))
    ) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "ИНН должен состоять из 10 или 12 цифр.",
      });
      return;
    }

    if (!city || city.length < 2) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Выберите ваш город.",
      });
      return;
    }

    const rawDigits = phone.replace(/\D/g, "");
    if (rawDigits.length !== 11) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите номер телефона полностью.",
      });
      return;
    }

    const formattedPhoneForBackend = `+${rawDigits}`;

    setIsSubmitting(true);
    try {
      const result = await completeOAuthRegistration({
        phone: formattedPhoneForBackend,
        city,
        accountType,
        companyName: needsCompanyNameAndINN ? companyName.trim() : undefined,
        inn: needsCompanyNameAndINN ? inn.trim() : undefined,
      });

      if (!result.success) throw new Error(result.message);
      await update({ role: "partner" });

      toast({
        variant: "success",
        title: "Профиль настроен!",
        description: "Добро пожаловать в Eventomir.",
      });

      // Hard redirect to force session refresh and clear OAuth landing state
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: error.message,
      });
      setIsSubmitting(false);
    }
  };

  if (
    status === "loading" ||
    (status === "authenticated" && session?.user?.role)
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  // --- MAIN OAUTH COMPLETION STATE (Split Screen) ---
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
      {/* ======================= LEFT PANE (BRANDING & IMAGE) ======================= */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-1/2 flex-col justify-between p-12 overflow-hidden bg-slate-900 border-r border-slate-800/60 z-0">
        <Image
          src="/images/loginBG.webp"
          alt="Eventomir Events"
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <Link href="/">
            <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Eventomir{" "}
              <span className="opacity-70 font-medium text-2xl">Партнер</span>
            </h1>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-xl pb-8">
          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl w-72 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-300 font-medium">
                  Синхронизация профиля
                </p>
                <p className="text-xl font-bold text-white">Почти готово!</p>
              </div>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-1.5">
              <div className="bg-blue-400 h-1.5 rounded-full w-[90%] shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Быстрая регистрация
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Заполните детали для <br />
              <span className="text-primary">завершения регистрации.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Мы получили данные из вашей социальной сети. Нам нужно уточнить
              еще пару деталей для правильной работы.
            </p>
          </div>
        </div>
      </div>

      {/* ======================= RIGHT PANE (COMPLETION FORM) ======================= */}
      <div className="flex w-full lg:w-1/2 lg:ml-auto min-h-screen items-center justify-center p-4 sm:p-8 relative z-10">
        {/* Ambient Glowing Background */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none lg:bg-primary/5" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none lg:bg-blue-600/5" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none lg:hidden"></div>

        <Card className="w-full max-w-[500px] shadow-2xl border-slate-800/60 bg-slate-900/80 lg:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500 my-8">
          <CardHeader className="space-y-2 pt-10 pb-6 text-center border-b border-slate-800/50">
            <div className="lg:hidden mb-2">
              <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                Eventomir{" "}
                <span className="opacity-80 font-medium">Партнер</span>
              </h1>
            </div>
            <CardTitle className="text-2xl font-bold text-white hidden lg:block">
              Завершение настройки
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-400">
              Укажите тип профиля и контактные данные
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-10 pt-8">
            <div className="space-y-6 text-left">
              {/* ACCOUNT TYPE RADIOS */}
              <div className="space-y-3">
                <Label className="font-semibold text-xs uppercase tracking-wider text-slate-400 ml-1">
                  Тип аккаунта
                </Label>
                <RadioGroup
                  value={accountType}
                  onValueChange={setAccountType}
                  className="grid grid-cols-2 gap-3"
                  disabled={isSubmitting}
                >
                  <div className="relative">
                    <RadioGroupItem
                      value="selfEmployed"
                      id="selfEmployed"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="selfEmployed"
                      className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:bg-slate-800/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-white text-slate-400 cursor-pointer transition-all h-full"
                    >
                      <User className="mb-2 h-5 w-5 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-xs font-bold text-center leading-tight">
                        Самозанятый
                      </span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="individualEntrepreneur"
                      id="individualEntrepreneur"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="individualEntrepreneur"
                      className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:bg-slate-800/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-white text-slate-400 cursor-pointer transition-all h-full"
                    >
                      <Briefcase className="mb-2 h-5 w-5 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-xs font-bold text-center leading-tight">
                        ИП
                      </span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="legalEntity"
                      id="legalEntity"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="legalEntity"
                      className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:bg-slate-800/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-white text-slate-400 cursor-pointer transition-all h-full"
                    >
                      <Building className="mb-2 h-5 w-5 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-xs font-bold text-center leading-tight">
                        Юр. лицо
                      </span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem
                      value="agency"
                      id="agency"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="agency"
                      className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-4 hover:bg-slate-800/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-white text-slate-400 cursor-pointer transition-all h-full"
                    >
                      <Users className="mb-2 h-5 w-5 text-slate-500 peer-data-[state=checked]:text-primary" />
                      <span className="text-xs font-bold text-center leading-tight">
                        Агентство
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* COMPANY DETAILS (Conditional) */}
              {["individualEntrepreneur", "legalEntity", "agency"].includes(
                accountType,
              ) && (
                <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-5 animate-in fade-in zoom-in-95">
                  <div className="space-y-2">
                    <Label className="font-semibold text-xs uppercase tracking-wider text-slate-400 ml-1">
                      Название компании / ИП
                    </Label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        className="pl-12 h-12 rounded-xl bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-primary/50 transition-all text-sm"
                        placeholder="Например, Eventomir Agency"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-xs uppercase tracking-wider text-slate-400 ml-1">
                      ИНН
                    </Label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        className="pl-12 h-12 rounded-xl bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-primary/50 transition-all text-sm font-mono"
                        placeholder="10 или 12 цифр"
                        value={inn}
                        onChange={(e) => setINN(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GRID: PHONE & CITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-semibold text-xs uppercase tracking-wider text-slate-400 ml-1">
                    Телефон
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      className="pl-12 h-12 rounded-xl bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-primary/50 transition-all text-sm"
                      placeholder="+7 999 000 00-00"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label className="font-semibold text-xs uppercase tracking-wider text-slate-400 ml-1">
                    Город
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      className="pl-12 h-12 rounded-xl bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-primary/50 transition-all text-sm"
                      placeholder="Поиск города..."
                      value={cityInput}
                      onChange={handleCityInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  {autocompleteResults.length > 0 && (
                    <div className="absolute z-50 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl mt-2 py-2 overflow-hidden animate-in fade-in">
                      {autocompleteResults.map((res) => (
                        <div
                          key={res}
                          className="px-4 py-2.5 hover:bg-slate-800 cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors"
                          onClick={() => {
                            setCityInput(res);
                            setCity(res);
                            setAutocompleteResults([]);
                          }}
                        >
                          {res}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SUBMIT */}
              <Button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="w-full h-12 mt-6 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isSubmitting ? "Сохранение профиля..." : "Завершить и войти"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteRegistrationPage;
