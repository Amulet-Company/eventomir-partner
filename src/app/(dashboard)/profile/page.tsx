"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
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
  phone: z.string().optional(),
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

export default function PartnerProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const userId = session?.user?.id;

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
        phone: profile.phone || "",
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
                          <FormControl>
                            <EditableInput
                              placeholder="Иван Иванов"
                              field={field}
                            />
                          </FormControl>
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
                              placeholder="+7 (999) 000-00-00"
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
                            <EditableInput
                              placeholder="https://вашлаэндинг.ру"
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://instagram.com/..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="t.me/..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://youtube.com/c/..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://vk.com/..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://facebook.com/..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://tiktok.com/@..."
                              field={field}
                            />
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
                            <EditableInput
                              placeholder="https://twitter.com/..."
                              field={field}
                            />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">
                      Креативы для Stories (VK / IG)
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1">
                      Специально подготовленные форматы 9:16.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <div className="aspect-[9/16] bg-slate-100 rounded-xl flex items-center justify-center mb-4 md:mb-6 border-2 border-dashed border-slate-300 relative overflow-hidden group">
                      <span className="text-slate-400 font-medium z-10 flex flex-col items-center text-sm md:text-base">
                        <Instagram className="w-6 h-6 md:w-8 md:h-8 mb-2 opacity-50" />
                        Превью шаблона
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-medium h-11 md:h-12"
                    >
                      <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />{" "}
                      Скачать архив (ZIP)
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">
                      Брендбук и Логотипы
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1">
                      Официальные материалы Eventomir для вашего сайта.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0 flex-1 flex flex-col">
                    <div className="flex-1 min-h-[160px] aspect-video bg-slate-900 rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-inner relative overflow-hidden group">
                      <span className="text-white font-extrabold text-2xl md:text-3xl tracking-widest z-10 drop-shadow-md">
                        Eventomir
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-medium h-11 md:h-12 mt-auto"
                    >
                      <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />{" "}
                      Логотипы (SVG/PNG)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
