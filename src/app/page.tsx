"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { motion, Variants } from "framer-motion";
import {
  TrendingUp,
  Users,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  CalendarCheck,
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const float: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function PartnerLandingPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    // 🚨 EDGE FIX CONFIRMED: w-full overflow-x-hidden relative
    <div className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden relative">
      {/* =========================================================
          HERO SECTION (Light/Modern SaaS B2B Aesthetic)
          ========================================================= */}
      <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 bg-slate-50 text-slate-900 overflow-hidden">
        {/* Background Gradients & Glows (Lightened) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-multiply pointer-events-none"></div>

        <div className=" mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* HERO TEXT */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-sm font-bold text-slate-700">
                  Платформа для профессионалов
                </span>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h1 className="text-3xl md:text-4xl xxl:text-[4rem] font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
                  Масштабируйте <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                    ивент-бизнес
                  </span>{" "}
                  с нами
                </h1>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-md md:text-lg text-slate-500 mb-10 leading-relaxed font-medium"
              >
                Eventomir помогает найти исполнителей и заказчиков(клиентов)
                ивент-мероприятий. Участвуй в программе и зарабатывай вместе с
                нами.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2">
                      Перейти в Дашборд
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2">
                      Стать партнером
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                )}
                <Link href="#benefits">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-bold transition-all shadow-sm hover:shadow flex items-center justify-center">
                    Узнать больше
                  </button>
                </Link>
              </motion.div>
            </motion.div>

            {/* HERO ANIMATED DATA GRAPHICS (Light Mode) */}
            <div className="relative h-[400px] lg:h-[500px] hidden md:block">
              {/* Floating Card 1 */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={float}
                className="absolute top-10 right-10 p-5 rounded-2xl bg-white/90 border border-white backdrop-blur-xl shadow-2xl shadow-slate-200/50 w-64 z-20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200/50">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Рост выручки
                    </p>
                    <p className="text-xl font-black text-slate-900">+145%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-[85%] shadow-sm"></div>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={float}
                transition={{
                  delay: 0.5,
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-20 left-10 p-5 rounded-2xl bg-white/90 border border-white backdrop-blur-xl shadow-2xl shadow-slate-200/50 w-72 z-30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl border border-blue-200/50">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Новые заявки
                    </p>
                    <p className="text-2xl font-black text-slate-900">24</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                    <p className="text-sm font-semibold text-slate-600">
                      Корпоратив на 50 чел.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                    <p className="text-sm font-semibold text-slate-600">
                      Свадебный банкет
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Center Main Graphic (Abstract UI) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-full blur-3xl z-0"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[360px] bg-white/80 border border-white backdrop-blur-2xl shadow-2xl shadow-slate-200/60 rounded-3xl z-10 p-6 flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Дашборд</h3>
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 bg-slate-200 rounded-full w-full"></div>
                        <div className="h-2.5 bg-slate-200 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BENEFITS SECTION
          ========================================================= */}
      <section
        id="benefits"
        className="py-24 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            >
              Почему выбирают Eventomir?
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="text-lg text-slate-500 font-medium"
            >
              Мы создали экосистему, в которой Вы сможете стабильно(регулярно
              получать) зарабатывать на привлечение исполнителей на наш сервис.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Benefit 1 */}
            <motion.div
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm border border-blue-100/50">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Огромная аудитория
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Наш сервис предоставляет широкий выбор категорий.
              </p>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
                <Wallet className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Прозрачные выплаты
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Получайте прозрачные выплаты с каждого оплаченного исполнителем
                тарифа
              </p>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 shadow-sm border border-purple-100/50">
                <BarChart3 className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Мощная аналитика
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Отслеживайте регистрацию, статистику, клики, переходы и оплату в
                личном кабинете партнера в режиме реального времени
              </p>
            </motion.div>

            {/* Benefit 4 */}
            {/* <motion.div
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 shadow-sm border border-orange-100/50">
                <CalendarCheck className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Календарь занятости
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Встроенный календарь позволяет легко управлять занятостью,
                избегать накладок и автоматически принимать заявки.
              </p>
            </motion.div> */}

            {/* Benefit 5 */}
            <motion.div
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 shadow-sm border border-indigo-100/50">
                <ShieldCheck className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Выплаты</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Ежедневные зачисления на кошелек
              </p>
            </motion.div>

            {/* CTA Card inside grid */}
            <motion.div
              variants={fadeUp}
              className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 text-white flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-2xl font-black mb-4 relative z-10">
                Готовы начать?
              </h3>
              <p className="text-primary-50 font-medium mb-8 relative z-10">
                Создайте профиль партнера и привлекайте исполнителей уже сегодня
              </p>

              {!isLoggedIn && (
                <Link href="/register" className="relative z-10 mt-auto">
                  <button className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Создать аккаунт
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS (Simple Steps)
          ========================================================= */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight"
              >
                Как это работает
              </motion.h2>
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Зарегистрируйтесь",
                    desc: "Заполните данные о вашей компании.",
                  },
                  {
                    step: "2",
                    title: "Продвигайте платформу",
                    desc: "Используйте реферальную ссылку.",
                  },
                  {
                    step: "3",
                    title: "Получайте выплаты",
                    desc: "Выплаты с каждого оплаченного исполнителем тарифа",
                  },
                  // {
                  //   step: "4",
                  //   title: "Зарабатывайте",
                  //   desc: "Успешно проводите мероприятия и выводите средства.",
                  // },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm text-primary font-black text-xl flex items-center justify-center">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] aspect-square md:aspect-[4/3] p-8 relative overflow-hidden"
              >
                {/* Mock UI for "How it works" */}
                <div className="absolute inset-x-8 -bottom-10 h-full bg-slate-50 rounded-t-3xl shadow-2xl border border-slate-200 p-8">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div>
                        <div className="h-3 w-32 bg-slate-200 rounded-full mb-3"></div>
                        <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/50">
                      Новый заказ
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-4/5 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-2/3 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="mt-10 flex gap-4">
                    <div className="h-12 flex-1 bg-primary rounded-xl shadow-sm"></div>
                    <div className="h-12 flex-1 bg-white border border-slate-200 rounded-xl"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA SECTION
          ========================================================= */}
      {!isLoggedIn && (
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/noise.svg')] mix-blend-overlay"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-6"
            >
              Начните зарабатывать больше с Eventomir
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary-foreground/80 text-md md:text-lg max-w-3xl mx-auto mb-10"
            >
              Создайте профиль партнера и привлекайте исполнителей уже сегодня
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/register">
                <button className="px-10 py-5 bg-white text-primary text-lg font-bold rounded-2xl hover:scale-105 hover:shadow-2xl transition-all flex items-center justify-center gap-2 mx-auto">
                  Создать аккаунт
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
