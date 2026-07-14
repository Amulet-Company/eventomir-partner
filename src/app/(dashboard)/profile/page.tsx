"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

import * as z from "zod";
import {
  Video,
  Mic2,
  Music,
  ChefHat,
  Palette,
  Copy,
  Loader2,
  Save,
  Download,
  Building2,
  User,
  Phone,
  MapPin,
  CreditCard,
  Link as LinkIcon,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Camera,
  Pencil,
  Globe,
  Send,
  Music2,
  CheckCircle2,
  CheckIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { usePartnerProfile, useUpdatePartnerProfile } from "@/services/partner";

// --- VALIDATION SCHEMA ---
const profileSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z
    .string()
    .min(1, "Телефон обязателен для заполнения")
    .regex(/^\+7 \d{3} \d{3} \d{2}-\d{2}$/, "Введите полный номер телефона"),
  companyName: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  inn: z
    .string()
    .regex(/^(\d{10}|\d{12})$/, "ИНН должен содержать 10 или 12 цифр")
    .optional()
    .or(z.literal("")),

  socialLinks: z.object({
    vk: z.string().url("Введите корректный URL").optional().or(z.literal("")),
    telegram: z.string().optional(),
    website: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
    instagram: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
    youtube: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
    facebook: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
    twitter: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
    tiktok: z
      .string()
      .url("Введите корректный URL")
      .optional()
      .or(z.literal("")),
  }),

  bankDetails: z
    .array(
      z.object({
        kpp: z
          .string()
          .regex(/^\d{9}$/, "КПП состоит из 9 цифр")
          .optional()
          .or(z.literal("")),
        bik: z
          .string()
          .regex(/^\d{9}$/, "БИК состоит из 9 цифр")
          .optional()
          .or(z.literal("")),
        bankName: z.string().optional(),
        accountNumber: z
          .string()
          .regex(/^\d{20}$/, "Расчетный счет состоит из 20 цифр")
          .optional()
          .or(z.literal("")),
        corrAccount: z
          .string()
          .regex(/^\d{20}$/, "Корр. счет состоит из 20 цифр")
          .optional()
          .or(z.literal("")),
      }),
    )
    .min(1),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ==========================================
// PHONE MASK HELPER
// ==========================================
const formatPhoneMask = (value: string) => {
  let cleaned = value.replace(/\D/g, "");
  if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.length === 0) return "";

  cleaned = cleaned.slice(0, 10);
  let res = "+7";
  if (cleaned.length > 0) res += " " + cleaned.substring(0, 3);
  if (cleaned.length > 3) res += " " + cleaned.substring(3, 6);
  if (cleaned.length > 6) res += " " + cleaned.substring(6, 8);
  if (cleaned.length > 8) res += "-" + cleaned.substring(8, 10);

  return res;
};

export default function PartnerProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const userId = session?.user?.id;
  const posterRef = useRef<HTMLDivElement>(null);

  const mainAppUrl =
    process.env.NEXT_PUBLIC_WEB_APP_URL || "https://app.eventomir.ru";

  const { data: profile, isLoading } = usePartnerProfile(userId);
  const updateMutation = useUpdatePartnerProfile();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      companyName: "",
      description: "",
      city: "",
      address: "",
      inn: "",
      socialLinks: {
        vk: "",
        telegram: "",
        website: "",
        instagram: "",
        youtube: "",
        facebook: "",
        twitter: "",
        tiktok: "",
      },
      bankDetails: [
        { kpp: "", bik: "", bankName: "", accountNumber: "", corrAccount: "" },
      ],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: profile.phone ? formatPhoneMask(profile.phone) : "",
        companyName: profile.companyName || "",
        description: profile.description || "",
        city: profile.city || "",
        address: profile.address || "",
        inn: profile.inn || "",
        socialLinks: {
          vk: profile.socialLinks?.vk || "",
          telegram: profile.socialLinks?.telegram || "",
          website: profile.socialLinks?.website || "",
          instagram: profile.socialLinks?.instagram || "",
          youtube: profile.socialLinks?.youtube || "",
          facebook: profile.socialLinks?.facebook || "",
          twitter: profile.socialLinks?.twitter || "",
          tiktok: (profile.socialLinks as any)?.tiktok || "",
        },
        bankDetails:
          profile.bankDetails?.length > 0
            ? profile.bankDetails
            : [
                {
                  kpp: "",
                  bik: "",
                  bankName: "",
                  accountNumber: "",
                  corrAccount: "",
                },
              ],
      });
      setAvatarUrl(profile.image);
    }
  }, [profile, form]);

  // Function to handle the poster download
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // High resolution for printing
        useCORS: true, // Allows loading external background images from Unsplash
        backgroundColor: "#0f172a", // Matches slate-900 fallback
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        logging: false, // Disable logging for cleaner console
      });

      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = image;
      link.download = "Eventomir_Referral_Poster.jpg";
      link.click();

      toast({
        title: "Успешно",
        variant: "success",
        description: "Постер начал скачиваться.",
      });
    } catch (error) {
      console.error("Error generating poster:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать изображение постера.",
      });
    }
  };

  // --- IMMEDIATE AVATAR UPLOAD ---
  const handleImmediateAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB.",
      });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUrl(URL.createObjectURL(file));

    updateMutation.mutate(
      { userId, data: { profilePictureFile: file } },
      {
        onSuccess: (res: any) => {
          setIsUploadingAvatar(false);
          toast({
            title: "Фото обновлено",
            description: "Логотип успешно сохранен.",
          });
          if (res?.profile?.profilePicture) {
            updateSession({ image: res.profile.profilePicture });
          }
        },
        onError: (err: any) => {
          setIsUploadingAvatar(false);
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: err.message || "Не удалось обновить фото.",
          });
        },
      },
    );
  };

  // --- MAIN FORM SUBMIT ---
  const onSubmit = (data: ProfileFormValues) => {
    if (!userId) return;
    updateMutation.mutate(
      { userId, data },
      {
        onSuccess: (res: any) => {
          toast({
            title: "Успешно",
            description: "Настройки профиля обновлены.",
          });
          if (res?.profile?.profilePicture) {
            updateSession({ image: res.profile.profilePicture });
          }
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: err.message || "Не удалось сохранить изменения.",
          });
        },
      },
    );
  };

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto pt-28 pb-10 max-w-5xl space-y-8 animate-pulse px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-2/3 md:w-[250px] rounded-xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  const referralLink = `${mainAppUrl}/register-performer?ref=${profile.referralId}`;

  const EditableInput = ({ field, placeholder, className = "" }: any) => (
    <div className="relative group">
      <Input
        placeholder={placeholder}
        className={`pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm ${className}`}
        {...field}
      />
      <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );

  return (
    // 🚨 DESIGN FIX: Added px-4 sm:px-6 lg:px-8 for perfect mobile edge spacing
    <div className="container mx-auto pt-24 pb-12 md:pt-32 md:pb-20 max-w-5xl animate-in fade-in duration-500 px-4 sm:px-6 lg:px-8">
      {/* Clean, Non-Sticky Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Настройки профиля
        </h1>
        <p className="text-muted-foreground text-base md:text-lg mt-2">
          Управляйте контактными данными, реквизитами и промо-материалами.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            {/* 🚨 DESIGN FIX: ScrollArea for Tabs on mobile */}
            <ScrollArea className="w-full mb-6 md:mb-8">
              <TabsList className="flex w-max min-w-full md:min-w-0 md:grid md:max-w-[600px] md:grid-cols-3 p-1 bg-slate-100 rounded-xl">
                <TabsTrigger value="general" className="rounded-lg flex-1">
                  Основное
                </TabsTrigger>
                <TabsTrigger value="bank" className="rounded-lg flex-1">
                  Реквизиты
                </TabsTrigger>
                <TabsTrigger value="promo" className="rounded-lg flex-1">
                  Промо-материалы
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            {/* ======================= TAB 1: GENERAL INFO ======================= */}
            <TabsContent value="general" className="space-y-6 md:space-y-8">
              <Card className="border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-slate-50/50 border-b p-4 md:p-6">
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Личная информация
                  </CardTitle>
                </CardHeader>
                {/* 🚨 DESIGN FIX: Adjusted internal card padding for mobile */}
                <CardContent className="p-4 md:p-6 pt-6 md:pt-8 space-y-6 md:space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
                        <AvatarImage
                          src={avatarUrl || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {isUploadingAvatar ? (
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                          <Camera className="w-8 h-8 text-white" />
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                        onChange={handleImmediateAvatarChange}
                        disabled={isUploadingAvatar}
                        title="Изменить фото"
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-slate-900 text-lg">
                        Логотип или Фото
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
                        Нажмите на фото, чтобы изменить его.{" "}
                        <span className="font-medium text-slate-700">
                          Изменения сохраняются автоматически.
                        </span>{" "}
                        Рекомендуется 500x500px до 5MB.
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            Контактное лицо{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="relative group">
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <FormControl>
                              <Input
                                placeholder="Иван Иванов"
                                className="pl-9 pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            Контактный телефон
                          </FormLabel>
                          <div className="relative group">
                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                              {...field}
                              onChange={(e) => {
                                const formatted = formatPhoneMask(
                                  e.target.value,
                                );
                                field.onChange(formatted);
                              }}
                              className="pl-9 pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                              placeholder="+7 ___ ___ __-__"
                              maxLength={16}
                            />
                            <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            Название компании (для отображения)
                          </FormLabel>
                          <div className="relative group">
                            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Например, ООО 'Ивент Агентство'"
                              className="pl-9 pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                              {...field}
                            />
                            <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            О компании / О себе
                          </FormLabel>
                          <div className="relative group">
                            <FormControl>
                              <Textarea
                                placeholder="Краткое описание вашей деятельности..."
                                className="resize-none min-h-[100px] bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white pr-10 border-slate-200 shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-slate-50/50 border-b p-4 md:p-6 pb-4 md:pb-6">
                  <CardTitle className="flex items-center text-base md:text-lg">
                    <LinkIcon className="w-5 h-5 mr-2 text-primary" />
                    Социальные сети
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm mt-1">
                    Ссылки повышают доверие и делают ваш профиль
                    привлекательнее.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <FormField
                      control={form.control}
                      name="socialLinks.website"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Globe className="w-4 h-4 text-slate-400" />{" "}
                            Основной Веб-сайт
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://вашлаэндинг.ру"
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Separator className="md:col-span-2 my-1 md:my-2 bg-slate-100" />

                    <FormField
                      control={form.control}
                      name="socialLinks.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Instagram className="w-4 h-4 text-pink-600" />{" "}
                            Instagram
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://instagram.com/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.telegram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Send className="w-4 h-4 text-sky-500" /> Telegram
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="t.me/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Youtube className="w-4 h-4 text-red-600" /> YouTube
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://youtube.com/c/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.vk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <span className="text-blue-600 font-bold text-[10px] bg-blue-100 px-1.5 py-0.5 rounded">
                              VK
                            </span>{" "}
                            ВКонтакте
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://vk.com/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Facebook className="w-4 h-4 text-blue-700" />{" "}
                            Facebook
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://facebook.com/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Music2 className="w-4 h-4 text-slate-800" /> TikTok
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://tiktok.com/@..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialLinks.twitter"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            <Twitter className="w-4 h-4 text-sky-400" /> Twitter
                            / X
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="https://twitter.com/..."
                                className="pr-10 h-11 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white transition-all border-slate-200 shadow-sm"
                                {...field}
                                value={field.value || ""}
                              />
                              <Pencil className="w-3.5 h-3.5 text-slate-300 absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* DEDICATED SAVE BUTTON FOR GENERAL SECTION */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto h-12 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 font-bold"
                  disabled={updateMutation.isPending || isUploadingAvatar}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  )}
                  Сохранить основные данные
                </Button>
              </div>
            </TabsContent>

            {/* ======================= TAB 2: BANK DETAILS ======================= */}
            <TabsContent value="bank" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <Card className="border-slate-200 shadow-sm md:col-span-2 hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="bg-slate-50/50 border-b p-4 md:p-6 pb-4 md:pb-6">
                    <CardTitle className="flex items-center text-base md:text-lg">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      Юридический адрес
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            Город регистрации
                          </FormLabel>
                          <FormControl>
                            <EditableInput
                              placeholder="г. Москва"
                              field={field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold text-xs md:text-sm uppercase md:none md:normal-case tracking-wider md:tracking-normal">
                            Точный адрес
                          </FormLabel>
                          <FormControl>
                            <EditableInput
                              placeholder="ул. Примерная, д. 1, оф. 12"
                              field={field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* ELEGANT BANK CARD UI */}
                <Card className="md:col-span-2 relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 group">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

                  <CardHeader className="relative z-10 p-5 md:p-6 pb-2">
                    <CardTitle className="flex items-center text-lg md:text-xl tracking-wide font-light text-white">
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6 mr-3 text-slate-300" />
                      Банковские Реквизиты
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs md:text-sm mt-1">
                      Используются для официальных выплат и формирования
                      закрывающих документов.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 p-5 md:p-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <FormField
                      control={form.control}
                      name="inn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            ИНН
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10 или 12 цифр"
                              maxLength={12}
                              className="font-mono h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner text-sm md:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.0.kpp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            КПП (для ООО)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="9 цифр"
                              maxLength={9}
                              className="font-mono h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner text-sm md:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.0.bankName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            Наименование банка
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ПАО Сбербанк г. Москва"
                              className="bg-white/5 h-11 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner text-sm md:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.0.bik"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            БИК
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="9 цифр"
                              maxLength={9}
                              className="font-mono h-11 text-base md:text-lg tracking-[0.2em] md:tracking-widest bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.0.accountNumber"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            Расчетный счет
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0000 0000 0000 0000 0000"
                              maxLength={20}
                              className="font-mono text-lg md:text-xl tracking-[0.1em] md:tracking-widest bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner py-5 md:py-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.0.corrAccount"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                            Корреспондентский счет
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0000 0000 0000 0000 0000"
                              maxLength={20}
                              className="font-mono h-11 text-base md:text-lg tracking-[0.1em] md:tracking-widest bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-white/30 transition-all hover:bg-white/10 shadow-inner"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* DEDICATED SAVE BUTTON FOR BANK SECTION */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto h-12 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 font-bold"
                  disabled={updateMutation.isPending || isUploadingAvatar}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}
                  Сохранить реквизиты
                </Button>
              </div>
            </TabsContent>

            {/* ======================= TAB 3: PROMO ======================= */}
            <TabsContent value="promo" className="space-y-6">
              {/* Referral Link Box */}
              <Card className="border-emerald-200 shadow-sm overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
                <CardHeader className="border-b border-emerald-100/50 p-4 md:p-6 pb-4 md:pb-6">
                  <CardTitle className="text-emerald-800 text-lg md:text-xl">
                    Ваша реферальная ссылка
                  </CardTitle>
                  <CardDescription className="text-emerald-700/70 text-xs md:text-sm mt-1">
                    Отправляйте эту ссылку клиентам, размещайте в шапке профиля
                    Instagram или закрепляйте в Telegram.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                  <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                    <Input
                      readOnly
                      value={referralLink}
                      className="bg-white border-emerald-300 font-mono text-sm md:text-base py-5 md:py-6 shadow-sm text-center sm:text-left focus-visible:ring-emerald-500"
                    />
                    <Button
                      type="button"
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-md hover:shadow-lg transition-all h-11 md:h-12"
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink);
                        toast({
                          title: "Скопировано",
                          description: "Ссылка скопирована в буфер обмена.",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 md:h-5 md:w-5 mr-2" />{" "}
                      Скопировать
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                {/* 🚨 NEW: Elegant Interactive Poster */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="p-4 md:p-6 pb-2">
                    <CardTitle className="text-base md:text-lg">
                      Печатный постер с QR-кодом
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1">
                      Идеально для размещения в гримерках, студиях или отправки
                      в PDF. QR-код уже содержит вашу уникальную ссылку.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 flex flex-col items-center bg-slate-50/50 flex-1 rounded-b-xl">
                    {/* POSTER ELEMENT */}
                    <div
                      ref={posterRef}
                      style={{
                        // This forces the browser to ignore sub-pixel anti-aliasing during capture
                        fontSmooth: "always",
                        WebkitFontSmoothing: "antialiased",
                        // This prevents text from jumping when the canvas renders
                        textRendering: "optimizeLegibility",
                      }}
                      // 🚨 FIX: Replaced aspect ratio with explicitly safe h-[480px] so it NEVER overflows and clips
                      className="relative w-full max-w-[320px] h-[480px] mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-900/5"
                    >
                      {/* WhatsApp-style Artist Doodle Texture */}
                      <div className="absolute inset-0 overflow-hidden bg-slate-950 flex flex-wrap justify-center items-center gap-5 p-2 opacity-[0.12] pointer-events-none">
                        {Array.from({ length: 45 }).map((_, i) => {
                          const icons = [
                            Camera,
                            Video,
                            Mic2,
                            Music,
                            ChefHat,
                            Palette,
                          ];
                          const Icon = icons[i % icons.length];
                          const rotate =
                            i % 2 === 0 ? "rotate-[-15deg]" : "rotate-[15deg]";
                          const size = i % 3 === 0 ? "w-5 h-5" : "w-7 h-7";

                          return (
                            <Icon
                              key={i}
                              className={`${size} ${rotate} text-primary`}
                            />
                          );
                        })}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/95"></div>

                      {/* Poster Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Header / Brand */}
                        <div className="pt-8 pb-2 text-center shrink-0">
                          <h2 className="text-3xl font-black text-white tracking-[0.1em] uppercase drop-shadow-lg">
                            Eventomir
                          </h2>
                          <div className="flex items-center justify-center gap-2 mt-1.5">
                            <div className="h-[1px] w-8 bg-primary/50"></div>
                            <p className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase drop-shadow-sm">
                              Для профессионалов
                            </p>
                            <div className="h-[1px] w-8 bg-primary/50"></div>
                          </div>
                        </div>

                        {/* Main Pitch & Features */}
                        <div className="flex-1 flex flex-col justify-center px-6 shrink-0 my-2">
                          <h3 className="text-white text-[20px] leading-tight font-bold mb-6 text-center drop-shadow-md">
                            Творите. Выступайте.
                            <br />
                            <span className="text-primary">Зарабатывайте.</span>
                          </h3>

                          <ul className="space-y-3 w-full">
                            {[
                              "Прямая связь с заказчиками",
                              "Гарантированная оплата",
                              "Календарь событий",
                            ].map((text, i) => (
                              <li
                                key={i}
                                // Use grid to strictly define the icon area and text area
                                className="grid grid-cols-[30px_1fr] items-center bg-slate-900/80 p-2.5 rounded-lg border border-primary/20 shadow-sm"
                              >
                                {/* Icon Area - Exactly 30px wide */}
                                <div className="flex justify-center items-center">
                                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <CheckIcon className="text-primary w-3 h-3" />
                                  </div>
                                </div>

                                {/* Text Area - No flex, no line-height tricks */}
                                <div className="flex items-center">
                                  <span className="text-slate-100 text-[13px] font-medium leading-tight">
                                    {text}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 🚨 THE FOOTER: Redesigned safely for html2canvas compatibility */}
                        <div className="p-4 shrink-0 w-full bg-slate-950/60 backdrop-blur-md border-t border-white/5">
                          <div className="bg-white rounded-xl p-3 shadow-lg relative flex items-center gap-4">
                            {/* Premium Accent Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl"></div>

                            {/* QR Code */}
                            <div className="flex-shrink-0 pl-2">
                              <QRCodeSVG
                                value={referralLink}
                                size={56}
                                level="H"
                                includeMargin={false}
                                fgColor="#0f172a"
                              />
                            </div>

                            {/* Call to action */}
                            <div className="flex flex-col justify-center flex-1 min-w-0 pr-1">
                              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 truncate">
                                Регистрация
                              </p>
                              <p className="text-[14px] text-slate-900 font-black leading-tight whitespace-nowrap">
                                Наведите камеру
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full max-w-[320px] font-medium h-11 md:h-12 mt-6 shadow-md bg-slate-900 hover:bg-slate-800 text-white transition-all hover:shadow-lg"
                      onClick={handleDownloadPoster}
                    >
                      <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Скачать постер (JPEG)
                    </Button>
                  </CardContent>
                </Card>

                {/* Brand Assets & IG Templates */}
                <div className="flex flex-col gap-5 md:gap-6">
                  <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">
                        Креативы для Stories (VK / IG)
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm mt-1">
                        Специально подготовленные форматы 9:16.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0 flex flex-col md:flex-row gap-4 items-center">
                      <div className="w-24 aspect-[9/16] shrink-0 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group">
                        <Instagram className="w-6 h-6 text-slate-400 opacity-50" />
                      </div>
                      <div className="flex-1 w-full flex flex-col justify-center">
                        <p className="text-sm text-slate-600 mb-3 text-center md:text-left">
                          Архив содержит 5 анимированных шаблонов для
                          привлечения исполнителей в ваши социальные сети.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full font-medium h-11"
                        >
                          <Download className="mr-2 h-4 w-4" /> Скачать архив
                          (ZIP)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg">
                        Брендбук и Логотипы
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm mt-1">
                        Официальные материалы Eventomir для вашего сайта.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0 md:pt-0 flex-1 flex flex-col">
                      <div className="flex-1 min-h-[120px] bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                        <span className="text-white font-extrabold text-2xl tracking-widest drop-shadow-md">
                          Eventomir
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full font-medium h-11 mt-auto"
                      >
                        <Download className="mr-2 h-4 w-4" /> Логотипы (SVG/PNG)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
