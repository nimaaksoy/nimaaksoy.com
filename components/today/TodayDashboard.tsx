"use client";

import {
  IconArrowsExchange,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCurrencyDirham,
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconCurrencyLira,
  IconCurrencyPound,
  IconLanguage,
  IconLock,
  IconNote,
  IconNews,
  IconRestore,
  IconStar,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";

type LatestItem = {
  title: string;
  description: string;
  href: string;
  date?: string;
  image?: string;
  stars?: number;
};

type NewsItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  date?: string;
};

type TodayDashboardProps = {
  latestRadar: LatestItem[];
  latestPrompts: LatestItem[];
};

type Language = "en" | "fa";
type CalendarMode = "month" | "year";
type CurrencyCode = "USD" | "EUR" | "TRY" | "TOMAN" | "GBP" | "AED" | "CAD";
type CurrencyRates = Partial<Record<CurrencyCode, Partial<Record<CurrencyCode, number>>>>;
type CalendarEvent = {
  id: string;
  summary: string;
  start: string;
};
type CalendarEventsByDate = Record<string, CalendarEvent[]>;
type CurrencyPair = {
  id: string;
  from: CurrencyCode;
  to: CurrencyCode;
  amount: string;
  convertedAmount: string;
  activeSide: "from" | "to";
};
type DateParts = {
  year: number;
  month: number;
  day: number;
};
type CurrencyState = {
  status: "idle" | "loading" | "ready" | "error";
  updatedAt?: string;
  rates: CurrencyRates;
  pairs: CurrencyPair[];
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const NOTE_STORAGE_KEY = "nima-today-note";
const LANGUAGE_STORAGE_KEY = "nima-today-language";
const NEWS_REFRESH_INTERVAL = 60 * 60 * 1000;
const CURRENCIES: CurrencyCode[] = ["USD", "EUR", "TRY", "GBP", "AED", "CAD", "TOMAN"];
const DEFAULT_CURRENCY_PAIR: CurrencyPair = {
  id: "primary",
  from: "USD",
  to: "TOMAN",
  amount: "1",
  convertedAmount: "",
  activeSide: "from",
};

type CurrencyIcon = ComponentType<{
  size?: number | string;
  stroke?: number | string;
  className?: string;
}>;

const currencyIcons: Record<CurrencyCode, CurrencyIcon> = {
  USD: IconCurrencyDollar,
  EUR: IconCurrencyEuro,
  TRY: IconCurrencyLira,
  TOMAN: IconCurrencyDollar,
  GBP: IconCurrencyPound,
  AED: IconCurrencyDirham,
  CAD: IconCurrencyDollar,
};

const currencyLabels: Record<CurrencyCode, string> = {
  USD: "USD",
  EUR: "EUR",
  TRY: "TRY",
  TOMAN: "Toman",
  GBP: "GBP",
  AED: "AED",
  CAD: "CAD",
};

const persianMonthNamesEn = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
];

const persianMonthNamesFa = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const copy = {
  en: {
    language: "فارسی",
    calendar: "Calendar",
    month: "Month",
    year: "Year",
    connectGoogle: "Connect Google Calendar",
    reconnectGoogle: "Reconnect calendar",
    googleReady: "Calendar connected for this browser session.",
    weeks: "weeks",
    dateConverter: "Date converter",
    gregorianDate: "Gregorian date",
    persianDate: "Persian date",
    selectMonth: "Month",
    selectDay: "Day",
    selectYear: "Year",
    currency: "Currency converter",
    currencyError: "Could not load rates.",
    updated: "Updated",
    refresh: "Refresh",
    noteTitle: "Personal Note",
    notePlaceholder: "Write one thing worth remembering today...",
    privacy: "Saved only in local browser storage.",
    showNote: "Open note",
    hideNote: "Close note",
    radar: "Radar Updates",
    radarSubtitle: "Trending open source projects",
    prompts: "Prompts collection",
    promptsSubtitle: "Prompts make your life easier",
    news: "Latest news",
    newsSubtitle: "Vahid Online public Telegram posts",
    newsError: "Could not load news.",
  },
  fa: {
    language: "English",
    calendar: "تقویم",
    month: "ماه",
    year: "سال",
    connectGoogle: "اتصال به تقویم گوگل",
    reconnectGoogle: "اتصال دوباره تقویم",
    googleReady: "تقویم برای همین نشست مرورگر وصل شد.",
    weeks: "هفته",
    dateConverter: "تبدیل تاریخ",
    gregorianDate: "تاریخ میلادی",
    persianDate: "تاریخ شمسی",
    selectMonth: "ماه",
    selectDay: "روز",
    selectYear: "سال",
    currency: "تبدیل ارز",
    currencyError: "نرخ‌ها بارگذاری نشد.",
    updated: "به‌روز شد",
    refresh: "به‌روزرسانی",
    noteTitle: "یادداشت شخصی",
    notePlaceholder: "یک چیز مهم برای امروز بنویس...",
    privacy: "فقط در حافظه محلی مرورگر ذخیره می‌شود.",
    showNote: "باز کردن یادداشت",
    hideNote: "بستن یادداشت",
    radar: "به‌روزرسانی‌های رادار",
    radarSubtitle: "پروژه‌های متن‌باز ترند",
    prompts: "مجموعه پرامپت‌ها",
    promptsSubtitle: "پرامپت‌هایی که کارها را ساده‌تر می‌کنند",
    news: "آخرین خبرها",
    newsSubtitle: "سه پست آخر تلگرام عمومی وحید آنلاین",
    newsError: "خبرها بارگذاری نشد.",
  },
} as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatNumber(value: number, language: Language, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits,
  }).format(value);
}

function parseAmount(value: string) {
  const normalized = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const firstDot = normalized.indexOf(".");
  const cleaned =
    firstDot === -1
      ? normalized
      : `${normalized.slice(0, firstDot + 1)}${normalized.slice(firstDot + 1).replace(/\./g, "")}`;
  return Number(cleaned) || 0;
}

function formatAmountInput(value: string) {
  const normalized = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!normalized) {
    return "";
  }
  const [integerPart, ...decimalParts] = normalized.split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimalParts.length === 0) {
    return grouped;
  }
  return `${grouped}.${decimalParts.join("").slice(0, 6)}`;
}

function formatAmountValue(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: currency === "TOMAN" ? 0 : 8,
  }).format(value);
}

function formatPersianDayMonthTime(value: string) {
  const date = new Date(value);
  const parts = getPersianParts(date);
  const time = new Intl.DateTimeFormat("fa-IR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${formatNumber(parts.day, "fa")} ${persianMonthNamesFa[parts.month - 1]}، ${time}`;
}

function formatNewsDate(value: string, language: Language) {
  if (language === "fa") {
    return formatPersianDayMonthTime(value);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatUpdatedAt(value: string | undefined, language: Language) {
  if (!value) {
    return "";
  }
  if (language === "fa") {
    return formatPersianDayMonthTime(value);
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCalendarTooltipDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR-u-ca-persian" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatCalendarEventTime(value: string, language: Language) {
  const date = new Date(value);
  if (date.getHours() === 0 && date.getMinutes() === 0 && value.includes("T00:00:00")) {
    return language === "fa" ? "تمام روز" : "All day";
  }
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function groupEventsByDate(events: CalendarEvent[]) {
  return events.reduce<CalendarEventsByDate>((acc, event) => {
    const key = dateKey(new Date(event.start));
    acc[key] = [...(acc[key] ?? []), event];
    return acc;
  }, {});
}

function gregorianLocale(language: Language) {
  return language === "fa" ? "fa-IR-u-ca-gregory" : "en-US";
}

function formatDualMonthTitle(date: Date, language: Language) {
  return `${new Intl.DateTimeFormat(gregorianLocale(language), {
    month: "long",
    year: "numeric",
  }).format(date)} / ${new Intl.DateTimeFormat(
    language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian",
    {
      month: "long",
      year: "numeric",
    }
  ).format(date)}`;
}

function formatDualYearTitle(date: Date, language: Language) {
  const gregorianYear = new Intl.DateTimeFormat(gregorianLocale(language), {
    year: "numeric",
  }).format(date);
  const persianYear = new Intl.DateTimeFormat(
    language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian",
    {
      year: "numeric",
    }
  ).format(date);
  return `${gregorianYear} / ${persianYear}`;
}

function getGregorianParts(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function getPersianParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}

function partsToDate(parts: DateParts) {
  return new Date(parts.year, parts.month - 1, parts.day);
}

function weekStartsOn(language: Language) {
  return language === "fa" ? 6 : 0;
}

function getMonthDays(viewDate: Date, weekStart = 0) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(first);
  const offset = (first.getDay() - weekStart + 7) % 7;
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function getWeekCount(date: Date, weekStart = 0) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const offset = (first.getDay() - weekStart + 7) % 7;
  return Math.ceil((offset + last.getDate()) / 7);
}

function getDaysInMonth(system: "gregorian" | "persian", parts: DateParts) {
  if (system === "gregorian") {
    return new Date(parts.year, parts.month, 0).getDate();
  }
  if (parts.month <= 6) return 31;
  if (parts.month <= 11) return 30;
  return isPersianLeapYear(parts.year) ? 30 : 29;
}

function isPersianLeapYear(year: number) {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
}

function compareParts(a: DateParts, b: DateParts) {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function persianPartsToGregorian(parts: DateParts) {
  let low = new Date(parts.year + 620, 0, 1).getTime();
  let high = new Date(parts.year + 622, 11, 31).getTime();
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const midDate = new Date(mid);
    const midDay = new Date(midDate.getFullYear(), midDate.getMonth(), midDate.getDate());
    const comparison = compareParts(getPersianParts(midDay), parts);
    if (comparison === 0) return midDay;
    if (comparison < 0) {
      low = midDay.getTime() + 86400000;
    } else {
      high = midDay.getTime() - 86400000;
    }
  }
  return new Date();
}

function formatGregorianDateLong(date: Date, language: Language) {
  return new Intl.DateTimeFormat(gregorianLocale(language), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatPersianDateLong(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getInitialCurrency(): CurrencyState {
  return {
    status: "idle",
    rates: {},
    pairs: [DEFAULT_CURRENCY_PAIR],
  };
}

export default function TodayDashboard({ latestRadar, latestPrompts }: TodayDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [note, setNote] = useState("");
  const [viewDate, setViewDate] = useState<Date | null>(null);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [gregorianParts, setGregorianParts] = useState<DateParts>({ year: 2026, month: 8, day: 15 });
  const [persianParts, setPersianParts] = useState<DateParts>({ year: 1405, month: 5, day: 24 });
  const [currency, setCurrency] = useState<CurrencyState>(getInitialCurrency);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsStatus, setNewsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [dateConverterOpen, setDateConverterOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const t = copy[language];
  const isRtl = language === "fa";

  useEffect(() => {
    const initialNow = new Date();
    setMounted(true);
    setNow(initialNow);
    setViewDate(initialNow);
    setGregorianParts(getGregorianParts(initialNow));
    setPersianParts(getPersianParts(initialNow));
    setNote(window.localStorage.getItem(NOTE_STORAGE_KEY) ?? "");
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "fa" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(NOTE_STORAGE_KEY, note);
  }, [mounted, note]);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [mounted, language]);

  useEffect(() => {
    document.body.classList.add("today-vazirmatn-page");
    return () => {
      document.body.classList.remove("today-vazirmatn-page");
    };
  }, []);

  const loadCurrency = async () => {
    setCurrency((current) => ({ ...current, status: "loading" }));
    try {
      const response = await fetch("/api/today/currency", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Currency request failed");
      const data = (await response.json()) as {
        ok?: boolean;
        updatedAt?: string;
        rates?: CurrencyRates;
      };
      if (!data.ok || !data.rates) throw new Error("Currency response missing rates");

      const updatedAt = data.updatedAt ?? new Date().toISOString();
      const rates = data.rates ?? {};
      setCurrency((current) => ({
        ...current,
        status: "ready",
        updatedAt,
        rates,
      }));
    } catch {
      setCurrency((current) => ({ ...current, status: "error" }));
    }
  };

  useEffect(() => {
    if (mounted) void loadCurrency();
  }, [mounted]);

  const loadNews = async () => {
    setNewsStatus("loading");
    try {
      const response = await fetch("/api/today/news", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("News request failed");
      const data = (await response.json()) as {
        ok?: boolean;
        items?: NewsItem[];
      };
      if (!data.ok || !Array.isArray(data.items)) throw new Error("News response missing items");
      setNews(data.items);
      setNewsStatus("ready");
    } catch {
      setNewsStatus("error");
    }
  };

  useEffect(() => {
    if (!mounted) return;
    void loadNews();
    const timer = window.setInterval(() => void loadNews(), NEWS_REFRESH_INTERVAL);
    return () => window.clearInterval(timer);
  }, [mounted]);

  const monthDays = useMemo(
    () => (viewDate ? getMonthDays(viewDate, weekStartsOn(language)) : []),
    [viewDate, language]
  );
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  const connectGoogleCalendar = async () => {
    if (!GOOGLE_CLIENT_ID || !viewDate) {
      setCalendarStatus("error");
      return;
    }

    setCalendarStatus("loading");
    try {
      await loadGoogleIdentityScript();
      const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/calendar.events.readonly",
        callback: async (response) => {
          if (!response.access_token || response.error) {
            setCalendarStatus("error");
            return;
          }
          await loadCalendarEvents(response.access_token, viewDate);
        },
      });
      tokenClient?.requestAccessToken({ prompt: "consent" });
    } catch {
      setCalendarStatus("error");
    }
  };

  const loadCalendarEvents = async (accessToken: string, targetMonth: Date) => {
    const timeMin = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1).toISOString();
    const timeMax = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1).toISOString();
    const params = new URLSearchParams({
      singleEvents: "true",
      orderBy: "startTime",
      timeMin,
      timeMax,
      maxResults: "50",
    });
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      setCalendarStatus("error");
      return;
    }
    const data = (await response.json()) as {
      items?: Array<{ id?: string; summary?: string; start?: { date?: string; dateTime?: string } }>;
    };
    setEvents(
      (data.items ?? []).map((event, index) => ({
        id: event.id ?? String(index),
        summary: event.summary ?? "(No title)",
        start: event.start?.dateTime ?? `${event.start?.date ?? dateKey(targetMonth)}T00:00:00`,
      }))
    );
    setCalendarStatus("ready");
  };

  const updateCurrencyPair = (id: string, update: Partial<CurrencyPair>) => {
    setCurrency((current) => ({
      ...current,
      pairs: current.pairs.map((pair) => (pair.id === id ? { ...pair, ...update } : pair)),
    }));
  };

  if (!mounted || !now || !viewDate) {
    return (
      <div className="flex min-h-[460px] items-center justify-center font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
        Loading today...
      </div>
    );
  }

  const todayKey = dateKey(now);
  const googleMessage = calendarStatus === "ready" ? t.googleReady : null;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      lang={language}
      className="today-vazirmatn font-[var(--font-vazirmatn)]"
    >
      <div className="mx-auto grid max-w-[1280px] gap-5 px-4 py-5 md:px-8 md:py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="space-y-5">
          <CalendarPanel
            mode={calendarMode}
            setMode={setCalendarMode}
            monthTitle={
              calendarMode === "year"
                ? formatDualYearTitle(viewDate, language)
                : formatDualMonthTitle(viewDate, language)
            }
            viewDate={viewDate}
            setViewDate={setViewDate}
            monthDays={monthDays}
            eventsByDate={eventsByDate}
            todayKey={todayKey}
            language={language}
            t={t}
            events={events}
            googleMessage={googleMessage}
            calendarStatus={calendarStatus}
            googleConfigured={Boolean(GOOGLE_CLIENT_ID)}
            connectGoogleCalendar={connectGoogleCalendar}
          />

          <DateConverterPanel
            t={t}
            language={language}
            gregorianParts={gregorianParts}
            setGregorianParts={setGregorianParts}
            persianParts={persianParts}
            setPersianParts={setPersianParts}
            open={dateConverterOpen}
            setOpen={setDateConverterOpen}
          />

          <CurrencyPanel
            title={t.currency}
            status={currency.status}
            updatedAt={currency.updatedAt}
            errorLabel={t.currencyError}
            rates={currency.rates}
            pairs={currency.pairs}
            language={language}
            onUpdatePair={updateCurrencyPair}
            onReset={() => setCurrency((current) => ({ ...current, pairs: [DEFAULT_CURRENCY_PAIR] }))}
          />
        </div>

        <aside className="space-y-5">
          <NotePanel t={t} note={note} setNote={setNote} open={noteOpen} setOpen={setNoteOpen} />
          <LatestPanel title={t.radar} subtitle={t.radarSubtitle} items={latestRadar} showStars />
          <LatestPanel title={t.prompts} subtitle={t.promptsSubtitle} items={latestPrompts} media />
          <NewsPanel title={t.news} subtitle={t.newsSubtitle} errorLabel={t.newsError} items={news} status={newsStatus} language={language} />
          <button
            type="button"
            onClick={() => setLanguage((current) => (current === "en" ? "fa" : "en"))}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#2A2A2A] px-3 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#EAEAEA] transition hover:text-[#2CFF05] focus:border-[#2CFF05] focus:outline-none"
          >
            <IconLanguage size={16} stroke={1.7} />
            {t.language}
          </button>
        </aside>
      </div>
    </div>
  );
}

function CalendarPanel({
  mode,
  setMode,
  monthTitle,
  viewDate,
  setViewDate,
  monthDays,
  eventsByDate,
  todayKey,
  language,
  t,
  events,
  googleMessage,
  calendarStatus,
  googleConfigured,
  connectGoogleCalendar,
}: {
  mode: CalendarMode;
  setMode: (mode: CalendarMode) => void;
  monthTitle: string;
  viewDate: Date;
  setViewDate: (date: Date) => void;
  monthDays: Date[];
  eventsByDate: CalendarEventsByDate;
  todayKey: string;
  language: Language;
  t: typeof copy.en | typeof copy.fa;
  events: CalendarEvent[];
  googleMessage: string | null;
  calendarStatus: "idle" | "loading" | "ready" | "error";
  googleConfigured: boolean;
  connectGoogleCalendar: () => void;
}) {
  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">{t.calendar}</p>
          <h1 className="mt-1 font-monroe text-[30px] font-light leading-none text-[#EAEAEA]">{monthTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[#262626] bg-[#0D0D0D] p-1">
            {(["month", "year"] as CalendarMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`h-8 rounded px-3 font-jetbrains text-[10px] uppercase tracking-[0.12em] transition ${
                  mode === item ? "bg-[#2CFF05] text-[#0A0A0A]" : "text-[#9A9A9A] hover:text-[#EAEAEA]"
                }`}
              >
                {item === "month" ? t.month : t.year}
              </button>
            ))}
          </div>
          <IconButton
            label="Previous"
            onClick={() =>
              setViewDate(
                mode === "year"
                  ? new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)
                  : new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
              )
            }
          >
            {language === "fa" ? (
              <IconChevronRight size={16} stroke={1.8} />
            ) : (
              <IconChevronLeft size={16} stroke={1.8} />
            )}
          </IconButton>
          <IconButton
            label="Next"
            onClick={() =>
              setViewDate(
                mode === "year"
                  ? new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)
                  : new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
              )
            }
          >
            {language === "fa" ? (
              <IconChevronLeft size={16} stroke={1.8} />
            ) : (
              <IconChevronRight size={16} stroke={1.8} />
            )}
          </IconButton>
        </div>
      </div>

      {mode === "month" ? (
        <MonthGrid monthDays={monthDays} viewDate={viewDate} eventsByDate={eventsByDate} todayKey={todayKey} language={language} />
      ) : (
        <YearGrid now={viewDate} language={language} todayKey={todayKey} weekLabel={t.weeks} />
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!googleConfigured || calendarStatus === "loading"}
          onClick={connectGoogleCalendar}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1A1A1A] px-3 font-jetbrains text-[11px] uppercase tracking-[0.12em] text-[#A0A0A0] transition hover:bg-[#242424] hover:text-[#EAEAEA] focus:outline-none disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[#1A1A1A] disabled:hover:text-[#A0A0A0]"
        >
          <IconCalendar size={16} stroke={1.7} />
          {calendarStatus === "ready" ? t.reconnectGoogle : t.connectGoogle}
        </button>
        {googleMessage && <p className="max-w-xl text-[12px] leading-relaxed text-[#7F7F7F]">{googleMessage}</p>}
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {events.length ? (
          events.slice(0, 4).map((event) => (
            <div key={event.id} className="rounded-md border border-[#1F1F1F] bg-[#0D0D0D] px-3 py-2">
              <p className="text-[14px] text-[#EAEAEA]">{event.summary}</p>
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">
                {new Date(event.start).toLocaleDateString(language === "fa" ? "fa-IR" : "en-US")}
              </p>
            </div>
          ))
        ) : null}
      </div>
    </Panel>
  );
}

function MonthGrid({
  monthDays,
  viewDate,
  eventsByDate,
  todayKey,
  language,
}: {
  monthDays: Date[];
  viewDate: Date;
  eventsByDate: CalendarEventsByDate;
  todayKey: string;
  language: Language;
}) {
  return (
    <>
      <div className="grid grid-cols-7 gap-1 font-jetbrains text-[10px] uppercase tracking-[0.08em] text-[#7F7F7F]">
        {Array.from({ length: 7 }, (_, index) =>
          new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-US", {
            weekday: "long",
          }).format(new Date(2026, 7, 16 + weekStartsOn(language) + index))
        ).map((day) => (
          <div key={day} className="flex h-8 items-center justify-center text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          const key = dateKey(day);
          const isCurrentMonth = day.getMonth() === viewDate.getMonth();
          const isToday = key === todayKey;
          const dayEvents = eventsByDate[key] ?? [];
          const hasEvent = dayEvents.length > 0;
          return (
            <div
              key={key}
              tabIndex={hasEvent ? 0 : undefined}
              className={[
                "group relative flex min-h-[70px] flex-col items-center justify-center rounded-md border text-[16px] transition md:min-h-[82px]",
                isToday ? "border-[#2CFF05] bg-[#173312] text-[#2CFF05]" : "border-[#1F1F1F] bg-[#0D0D0D] text-[#DADADA]",
                isCurrentMonth ? "" : "opacity-35",
              ].join(" ")}
            >
              <span>{formatNumber(day.getDate(), language)}</span>
              <span className="mt-1 font-jetbrains text-[10px] text-[#7F7F7F]">
                {new Intl.DateTimeFormat(language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian", {
                  day: "numeric",
                }).format(day)}
              </span>
              {hasEvent && (
                <>
                  <span className="absolute bottom-2 size-1.5 rounded-full bg-[#2CFF05]" />
                  <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-[220px] -translate-x-1/2 translate-y-1 rounded-md bg-[#171717] p-3 text-left opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-[#2A2A2A] transition group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
                    <p className="mb-2 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">
                      {formatCalendarTooltipDate(day, language)}
                    </p>
                    <div className="space-y-2">
                      {dayEvents.slice(0, 4).map((event) => (
                        <div key={event.id} className="border-l border-[#2CFF05] pl-2">
                          <p className="line-clamp-2 text-[12px] leading-snug text-[#EAEAEA]">{event.summary}</p>
                          <p className="mt-1 font-jetbrains text-[9px] text-[#7F7F7F]">
                            {formatCalendarEventTime(event.start, language)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {dayEvents.length > 4 && (
                      <p className="mt-2 font-jetbrains text-[9px] uppercase tracking-[0.1em] text-[#7F7F7F]">
                        +{formatNumber(dayEvents.length - 4, language)} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function YearGrid({
  now,
  language,
  todayKey,
  weekLabel,
}: {
  now: Date;
  language: Language;
  todayKey: string;
  weekLabel: string;
}) {
  const months = Array.from({ length: 12 }, (_, index) => new Date(now.getFullYear(), index, 1));
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {months.map((month) => {
        const weekStart = weekStartsOn(language);
        const days = getMonthDays(month, weekStart);
        const active = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear();
        return (
          <div key={month.getMonth()} className={`rounded-md border bg-[#0D0D0D] p-3 ${active ? "border-[#2CFF05]" : "border-[#1F1F1F]"}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-jetbrains text-[11px] uppercase tracking-[0.1em] text-[#EAEAEA]">
                {new Intl.DateTimeFormat(gregorianLocale(language), { month: "short" }).format(month)}
              </p>
              <p className="truncate text-[10px] text-[#7F7F7F]">
                {new Intl.DateTimeFormat(language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian", {
                  month: "short",
                }).format(month)}
              </p>
              <p className="font-jetbrains text-[9px] uppercase tracking-[0.08em] text-[#7F7F7F]">
                {formatNumber(getWeekCount(month, weekStart), language)} {weekLabel}
              </p>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const key = dateKey(day);
                const isCurrentMonth = day.getMonth() === month.getMonth();
                const isToday = key === todayKey;
                return (
                  <span
                    key={key}
                    className={`flex aspect-square items-center justify-center rounded-sm text-[9px] ${
                      isToday
                        ? "bg-[#2CFF05] text-[#0A0A0A]"
                        : isCurrentMonth
                          ? "bg-[#151515] text-[#9A9A9A]"
                          : "bg-transparent text-[#333]"
                    }`}
                  >
                    {isCurrentMonth ? formatNumber(day.getDate(), language) : ""}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DateConverterPanel({
  t,
  language,
  gregorianParts,
  setGregorianParts,
  persianParts,
  setPersianParts,
  open,
  setOpen,
}: {
  t: typeof copy.en | typeof copy.fa;
  language: Language;
  gregorianParts: DateParts;
  setGregorianParts: (parts: DateParts) => void;
  persianParts: DateParts;
  setPersianParts: (parts: DateParts) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const gregorianDate = partsToDate(gregorianParts);
  const persianDate = persianPartsToGregorian(persianParts);
  const hasDateChanged = dateKey(gregorianDate) !== dateKey(new Date());

  const updateGregorian = (next: DateParts) => {
    const clamped = {
      ...next,
      day: Math.min(next.day, getDaysInMonth("gregorian", next)),
    };
    const date = partsToDate(clamped);
    setGregorianParts(clamped);
    setPersianParts(getPersianParts(date));
  };

  const updatePersian = (next: DateParts) => {
    const clamped = {
      ...next,
      day: Math.min(next.day, getDaysInMonth("persian", next)),
    };
    const date = persianPartsToGregorian(clamped);
    setPersianParts(clamped);
    setGregorianParts(getGregorianParts(date));
  };

  const resetToToday = () => {
    const today = new Date();
    setGregorianParts(getGregorianParts(today));
    setPersianParts(getPersianParts(today));
  };

  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
          aria-expanded={open}
        >
          <IconCalendar size={18} stroke={1.7} className="text-[#2CFF05]" />
          <h2 className="font-monroe text-[24px] font-light text-[#EAEAEA]">{t.dateConverter}</h2>
          <span className="ml-auto text-[#A0A0A0]">
            {open ? <IconChevronUp size={18} stroke={1.8} /> : <IconChevronDown size={18} stroke={1.8} />}
          </span>
        </button>
        {open && hasDateChanged && (
          <button
            type="button"
            onClick={resetToToday}
            className="inline-flex size-9 items-center justify-center rounded-md text-[#EAEAEA] transition hover:text-[#2CFF05] focus:outline-none"
            aria-label="Reset date converter to today"
          >
            <IconRestore size={16} stroke={1.8} />
          </button>
        )}
      </div>

      {open && (
      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-md bg-[#181818] p-3">
          <p className="text-[18px] leading-snug text-[#EAEAEA]">
            {formatGregorianDateLong(gregorianDate, language)}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <SelectField
              label={t.selectMonth}
              value={gregorianParts.month}
              onChange={(value) => updateGregorian({ ...gregorianParts, month: value })}
            >
              {new Array(12).fill(null).map((_, index) => {
                const month = new Intl.DateTimeFormat(gregorianLocale(language), {
                  month: "long",
                }).format(new Date(2026, index, 1));
                return (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                );
              })}
            </SelectField>
            <SelectField
              label={t.selectDay}
              value={gregorianParts.day}
              onChange={(value) => updateGregorian({ ...gregorianParts, day: value })}
            >
              {Array.from({ length: getDaysInMonth("gregorian", gregorianParts) }, (_, index) => index + 1).map((day) => (
                <option key={day} value={day}>
                  {formatNumber(day, language)}
                </option>
              ))}
            </SelectField>
            <SelectField
              label={t.selectYear}
              value={gregorianParts.year}
              onChange={(value) => updateGregorian({ ...gregorianParts, year: value })}
            >
              {Array.from({ length: 141 }, (_, index) => 1970 + index).map((year) => (
                <option key={year} value={year}>
                  {formatNumber(year, language)}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="rounded-md bg-[#181818] p-3">
          <p className="text-[18px] leading-snug text-[#EAEAEA]">
            {formatPersianDateLong(persianDate, language)}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <SelectField
              label={t.selectMonth}
              value={persianParts.month}
              onChange={(value) => updatePersian({ ...persianParts, month: value })}
            >
              {(language === "fa" ? persianMonthNamesFa : persianMonthNamesEn).map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </SelectField>
            <SelectField
              label={t.selectDay}
              value={persianParts.day}
              onChange={(value) => updatePersian({ ...persianParts, day: value })}
            >
              {Array.from({ length: getDaysInMonth("persian", persianParts) }, (_, index) => index + 1).map((day) => (
                <option key={day} value={day}>
                  {formatNumber(day, language)}
                </option>
              ))}
            </SelectField>
            <SelectField
              label={t.selectYear}
              value={persianParts.year}
              onChange={(value) => updatePersian({ ...persianParts, year: value })}
            >
              {Array.from({ length: 141 }, (_, index) => 1350 + index).map((year) => (
                <option key={year} value={year}>
                  {formatNumber(year, language)}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
      </div>
      )}
    </Panel>
  );
}

function CurrencyPanel({
  title,
  status,
  updatedAt,
  errorLabel,
  rates,
  pairs,
  language,
  onUpdatePair,
  onReset,
}: {
  title: string;
  status: CurrencyState["status"];
  updatedAt?: string;
  errorLabel: string;
  rates: CurrencyRates;
  pairs: CurrencyPair[];
  language: Language;
  onUpdatePair: (id: string, update: Partial<CurrencyPair>) => void;
  onReset: () => void;
}) {
  const pair = pairs[0] ?? DEFAULT_CURRENCY_PAIR;
  const hasCurrencyChanged =
    pair.from !== DEFAULT_CURRENCY_PAIR.from ||
    pair.to !== DEFAULT_CURRENCY_PAIR.to ||
    pair.amount !== DEFAULT_CURRENCY_PAIR.amount ||
    pair.activeSide !== DEFAULT_CURRENCY_PAIR.activeSide;

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <IconCurrencyDollar size={18} stroke={1.7} className="text-[#2CFF05]" />
            <h2 className="font-monroe text-[24px] font-light text-[#EAEAEA]">{title}</h2>
          </div>
          {updatedAt && (
            <p className="mt-1 font-jetbrains text-[10px] uppercase tracking-[0.1em] text-[#7F7F7F]">
              {copy[language].updated}: {formatUpdatedAt(updatedAt, language)}
            </p>
          )}
        </div>
        {hasCurrencyChanged && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex size-9 items-center justify-center rounded-md text-[#EAEAEA] transition hover:text-[#2CFF05] focus:outline-none"
            aria-label="Reset currency converter to 1 USD to Toman"
          >
            <IconRestore size={16} stroke={1.8} />
          </button>
        )}
      </div>
      <div className="space-y-3">
        {[pair].map((pair) => {
          const rate = rates[pair.from]?.[pair.to];
          const fromAmount =
            pair.activeSide === "to" && typeof rate === "number" && rate > 0
              ? formatAmountValue(parseAmount(pair.convertedAmount) / rate, pair.from)
              : pair.amount;
          const toAmount =
            pair.activeSide === "from" && typeof rate === "number"
              ? formatAmountValue(parseAmount(pair.amount) * rate, pair.to)
              : pair.convertedAmount;
          return (
            <div key={pair.id} className="grid gap-3 rounded-md bg-[#181818] p-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <CurrencyAmountInput
                amount={fromAmount}
                currency={pair.from}
                onAmountChange={(amountValue) => {
                  const nextAmount = formatAmountInput(amountValue);
                  const nextConverted =
                    typeof rate === "number" ? formatAmountValue(parseAmount(nextAmount) * rate, pair.to) : "";
                  onUpdatePair(pair.id, {
                    amount: nextAmount,
                    convertedAmount: nextConverted,
                    activeSide: "from",
                  });
                }}
                onCurrencyChange={(currencyValue) =>
                  onUpdatePair(pair.id, { from: currencyValue, activeSide: "from" })
                }
              />
              <button
                type="button"
                onClick={() => {
                  onUpdatePair(pair.id, {
                    from: pair.to,
                    to: pair.from,
                    amount: toAmount || "1",
                    convertedAmount: fromAmount,
                    activeSide: "from",
                  });
                }}
                className="inline-flex size-10 items-center justify-center rounded-md text-[#9A9A9A] transition hover:text-[#2CFF05] focus:outline-none"
                aria-label="Swap currency"
              >
                <IconArrowsExchange size={17} stroke={1.8} />
              </button>
              <CurrencyAmountInput
                amount={toAmount}
                currency={pair.to}
                onAmountChange={(amountValue) => {
                  const nextConverted = formatAmountInput(amountValue);
                  const nextAmount =
                    typeof rate === "number" && rate > 0
                      ? formatAmountValue(parseAmount(nextConverted) / rate, pair.from)
                      : "";
                  onUpdatePair(pair.id, {
                    amount: nextAmount,
                    convertedAmount: nextConverted,
                    activeSide: "to",
                  });
                }}
                onCurrencyChange={(currencyValue) =>
                  onUpdatePair(pair.id, { to: currencyValue, activeSide: "from" })
                }
              />
            </div>
          );
        })}
      </div>
      {status === "error" && (
        <p className="mt-4 text-[12px] leading-relaxed text-[#7F7F7F]">
          {errorLabel}
        </p>
      )}
    </Panel>
  );
}

function CurrencyAmountInput({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: {
  amount: string;
  currency: CurrencyCode;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: CurrencyCode) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_132px] gap-2">
      <input
        inputMode="decimal"
        value={amount}
        onChange={(event) => onAmountChange(event.target.value)}
        className="h-16 min-w-0 rounded-md bg-[#101010] px-3 font-jetbrains text-[30px] text-[#EAEAEA] outline-none transition focus:ring-1 focus:ring-[#2CFF05]"
      />
      <CurrencySelect value={currency} onChange={onCurrencyChange} />
    </div>
  );
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}) {
  const Icon = currencyIcons[value];
  return (
    <div className="relative">
      <Icon
        size={15}
        stroke={1.8}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7F7F7F]"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
        className="h-16 w-full appearance-none rounded-md bg-[#101010] bg-[linear-gradient(45deg,transparent_50%,#EAEAEA_50%),linear-gradient(135deg,#EAEAEA_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-18px)_26px,calc(100%-13px)_26px] bg-no-repeat pl-8 pr-8 font-jetbrains text-[13px] text-[#EAEAEA] outline-none transition focus:ring-1 focus:ring-[#2CFF05]"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>
            {currencyLabels[currency]}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full appearance-none rounded-md bg-[#0A0A0A] bg-[linear-gradient(45deg,transparent_50%,#EAEAEA_50%),linear-gradient(135deg,#EAEAEA_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-18px)_18px,calc(100%-13px)_18px] bg-no-repeat px-3 pr-8 text-[13px] text-[#EAEAEA] outline-none ring-0 transition focus:ring-1 focus:ring-[#2CFF05]"
      >
        {children}
      </select>
    </label>
  );
}

function NotePanel({
  t,
  note,
  setNote,
  open,
  setOpen,
}: {
  t: typeof copy.en | typeof copy.fa;
  note: string;
  setNote: (value: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <Panel>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 text-left focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <IconNote size={18} stroke={1.7} className="text-[#2CFF05]" />
          <h2 className="font-monroe text-[24px] font-light text-[#EAEAEA]">{t.noteTitle}</h2>
        </div>
        <span className="inline-flex size-9 items-center justify-center rounded-md text-[#A0A0A0] transition hover:text-[#2CFF05]">
          {open ? <IconChevronUp size={18} stroke={1.8} /> : <IconChevronDown size={18} stroke={1.8} />}
        </span>
      </button>
      {open && (
        <div className="mt-4">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t.notePlaceholder}
            className="min-h-[130px] w-full resize-none rounded-md bg-[#0A0A0A] p-4 text-[15px] leading-relaxed text-[#EAEAEA] outline-none transition placeholder:text-[#555] focus:ring-1 focus:ring-[#2CFF05]"
          />
          <p className="mt-3 inline-flex items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">
            <IconLock size={14} stroke={1.8} />
            {t.privacy}
          </p>
        </div>
      )}
    </Panel>
  );
}

function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Identity failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Identity failed to load"));
    document.head.appendChild(script);
  });
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg bg-[#181818] p-5 md:p-6 ${className}`}>
      {children}
    </section>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-md border border-[#2A2A2A] text-[#EAEAEA] transition hover:text-[#2CFF05] focus:border-[#2CFF05] focus:outline-none"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function LatestPanel({
  title,
  subtitle,
  items,
  media = false,
  showStars = false,
}: {
  title: string;
  subtitle: string;
  items: LatestItem[];
  media?: boolean;
  showStars?: boolean;
}) {
  return (
    <Panel>
      <h2 className="font-monroe text-[24px] font-light text-[#EAEAEA]">{title}</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-[#7F7F7F]">{subtitle}</p>
      <div className="mt-4 space-y-3">
        {items.slice(0, 3).map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block border-b border-[#1F1F1F] pb-3 transition hover:border-[#2CFF05] last:border-b-0 last:pb-0"
          >
            <div className={media ? "grid grid-cols-[72px_minmax(0,1fr)] gap-3" : ""}>
              {media && (
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-[#252525] bg-[#0D0D0D]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-jetbrains text-[18px] text-[#2CFF05]">{pad(index + 1)}</span>
                  )}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[16px] leading-tight text-[#EAEAEA]">{item.title}</h3>
                  {showStars && typeof item.stars === "number" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#151515] px-2 py-1 font-jetbrains text-[10px] text-[#A0A0A0]">
                      <IconStar size={12} stroke={1.7} />
                      {formatNumber(item.stars, "en")}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#9A9A9A]">{item.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Panel>
  );
}

function NewsPanel({
  title,
  subtitle,
  errorLabel,
  items,
  status,
  language,
}: {
  title: string;
  subtitle: string;
  errorLabel: string;
  items: NewsItem[];
  status: "idle" | "loading" | "ready" | "error";
  language: Language;
}) {
  return (
    <Panel>
      <div className="flex items-start gap-2">
        <IconNews size={18} stroke={1.7} className="mt-1 text-[#2CFF05]" />
        <div>
          <h2 className="font-monroe text-[24px] font-light text-[#EAEAEA]">{title}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#7F7F7F]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3" dir="rtl">
        {status === "error" && !items.length ? (
          <p className="text-[13px] text-[#7F7F7F]">{errorLabel}</p>
        ) : null}
        {status === "loading" && !items.length ? (
          <p className="font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F]">Loading...</p>
        ) : null}
        {items.slice(0, 3).map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block border-b border-[#1F1F1F] pb-3 transition hover:border-[#2CFF05] last:border-b-0 last:pb-0"
          >
            <h3 className="line-clamp-2 text-[15px] leading-relaxed text-[#EAEAEA]">{item.title}</h3>
            <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-[#9A9A9A]">{item.description}</p>
            {item.date && (
              <p className="mt-2 font-jetbrains text-[10px] uppercase tracking-[0.08em] text-[#7F7F7F]" dir={language === "fa" ? "rtl" : "ltr"}>
                {formatNewsDate(item.date, language)}
              </p>
            )}
          </a>
        ))}
      </div>
    </Panel>
  );
}
