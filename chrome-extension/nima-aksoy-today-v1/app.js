(() => {
  const SITE = "https://nimaaksoy.com";
  const STORAGE = {
    language: "nima-today-extension-language",
    note: "nima-today-extension-note",
    noteOpen: "nima-today-extension-note-open",
    dateOpen: "nima-today-extension-date-open",
  };

  const CURRENCIES = ["USD", "EUR", "TRY", "GBP", "AED", "CAD", "TOMAN"];
  const FALLBACK_RADAR = [
    {
      title: "CLI-Anything",
      description: "Make any desktop app agent-native with structured CLIs for real software.",
      href: "https://nimaaksoy.com/radar/cli-anything",
      date: "2026-08-16",
      stars: 0,
    },
    {
      title: "Open Design",
      description: "Open-source Claude Design alternative for local coding-agent design work.",
      href: "https://nimaaksoy.com/radar/open-design",
      date: "2026-08-15",
      stars: 0,
    },
    {
      title: "Anthropic Skills",
      description: "Public Agent Skills repo with loadable instruction packs for specialized work.",
      href: "https://nimaaksoy.com/radar/anthropic-skills",
      date: "2026-08-14",
      stars: 0,
    },
  ];

  const FALLBACK_PROMPTS = [
    {
      title: "Ranidee Character Reveal Trailer",
      description: "Premium illustrated character-reveal trailer prompt with cinematic title cards.",
      href: "https://nimaaksoy.com/prompts/ranidee-character-reveal-trailer",
      date: "2026-08-15",
    },
    {
      title: "End Times Surfing",
      description: "Cinematic prompt for a lone surfer riding through apocalyptic collapse.",
      href: "https://nimaaksoy.com/prompts/end-times-surfing",
      date: "2026-08-10",
    },
    {
      title: "Mid-Century American City Picture Book",
      description: "Prompt for charming travel picture-book city illustrations in gouache color.",
      href: "https://nimaaksoy.com/prompts/mid-century-american-city-picture-book",
      date: "2026-08-09",
    },
  ];

  const PERSIAN_MONTHS_EN = [
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

  const PERSIAN_MONTHS_FA = [
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

  const COPY = {
    en: {
      calendar: "Calendar",
      month: "Month",
      year: "Year",
      openSiteCalendar: "Open site for Google Calendar",
      dateConverter: "Date converter",
      gregorianDate: "Gregorian date",
      persianDate: "Persian date",
      monthLabel: "Month",
      dayLabel: "Day",
      yearLabel: "Year",
      currency: "Currency converter",
      reset: "Reset",
      personalNote: "Personal Note",
      notePlaceholder: "Write one thing worth remembering today...",
      localOnly: "Saved only in this browser.",
      radar: "Radar Updates",
      radarSubtitle: "Trending open source projects",
      prompts: "Prompts collection",
      promptsSubtitle: "Prompts make your life easier",
      news: "Latest news",
      newsSubtitle: "Three latest public Vahid Online posts",
      couldNotLoadNews: "Could not load news.",
      couldNotLoadRates: "Could not load rates.",
      updated: "Updated",
      loading: "Loading...",
      more: "more",
      languageLabel: "فارسی",
      weeks: "weeks",
    },
    fa: {
      calendar: "تقویم",
      month: "ماه",
      year: "سال",
      openSiteCalendar: "باز کردن سایت برای تقویم گوگل",
      dateConverter: "تبدیل تاریخ",
      gregorianDate: "تاریخ میلادی",
      persianDate: "تاریخ شمسی",
      monthLabel: "ماه",
      dayLabel: "روز",
      yearLabel: "سال",
      currency: "تبدیل ارز",
      reset: "بازنشانی",
      personalNote: "یادداشت شخصی",
      notePlaceholder: "یک چیز مهم برای امروز بنویس...",
      localOnly: "فقط در همین مرورگر ذخیره می‌شود.",
      radar: "به‌روزرسانی‌های رادار",
      radarSubtitle: "پروژه‌های متن‌باز ترند",
      prompts: "مجموعه پرامپت‌ها",
      promptsSubtitle: "پرامپت‌هایی که کارها را ساده‌تر می‌کنند",
      news: "آخرین خبرها",
      newsSubtitle: "سه پست آخر تلگرام عمومی وحید آنلاین",
      couldNotLoadNews: "خبرها بارگذاری نشد.",
      couldNotLoadRates: "نرخ‌ها بارگذاری نشد.",
      updated: "به‌روز شد",
      loading: "در حال بارگذاری...",
      more: "بیشتر",
      languageLabel: "English",
      weeks: "هفته",
    },
  };

  const state = {
    language: "en",
    viewDate: new Date(),
    calendarMode: "month",
    gregorianParts: getGregorianParts(new Date()),
    persianParts: getPersianParts(new Date()),
    rates: {},
    updatedAt: "",
    leftCode: "USD",
    rightCode: "TOMAN",
    leftAmount: "1",
    rightAmount: "",
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function locale() {
    return state.language === "fa" ? "fa-IR" : "en-US";
  }

  function gregorianLocale() {
    return state.language === "fa" ? "fa-IR-u-ca-gregory" : "en-US";
  }

  function persianLocale() {
    return state.language === "fa" ? "fa-IR-u-ca-persian" : "en-US-u-ca-persian";
  }

  function formatNumber(value, max = 0) {
    return new Intl.NumberFormat(locale(), { maximumFractionDigits: max }).format(value);
  }

  function normalizeDigits(value) {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const ar = "٠١٢٣٤٥٦٧٨٩";
    return String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
      const faIndex = fa.indexOf(digit);
      return String(faIndex >= 0 ? faIndex : ar.indexOf(digit));
    });
  }

  function parseAmount(value) {
    const normalized = normalizeDigits(value).replace(/,/g, "").replace(/[^\d.]/g, "");
    const firstDot = normalized.indexOf(".");
    const cleaned =
      firstDot === -1
        ? normalized
        : `${normalized.slice(0, firstDot + 1)}${normalized.slice(firstDot + 1).replace(/\./g, "")}`;
    return Number(cleaned) || 0;
  }

  function formatAmountInput(value) {
    const normalized = normalizeDigits(value).replace(/,/g, "").replace(/[^\d.]/g, "");
    if (!normalized) return "";
    const parts = normalized.split(".");
    const integer = parts.shift() || "0";
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length ? `${grouped}.${parts.join("").slice(0, 6)}` : grouped;
  }

  function formatAmountValue(value, currency) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: currency === "TOMAN" ? 0 : 8,
    }).format(value);
  }

  function readLocal(key) {
    return new Promise((resolve) => {
      if (globalThis.chrome?.storage?.local) {
        chrome.storage.local.get(key, (result) => resolve(result[key]));
        return;
      }
      resolve(localStorage.getItem(key));
    });
  }

  function writeLocal(key, value) {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.set({ [key]: value });
      return;
    }
    localStorage.setItem(key, value);
  }

  function getGregorianParts(date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  function getPersianParts(date) {
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

  function partsToDate(parts) {
    return new Date(parts.year, parts.month - 1, parts.day);
  }

  function compareParts(a, b) {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  }

  function persianPartsToGregorian(parts) {
    let low = new Date(parts.year + 620, 0, 1).getTime();
    let high = new Date(parts.year + 622, 11, 31).getTime();
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      const midDate = new Date(mid);
      const day = new Date(midDate.getFullYear(), midDate.getMonth(), midDate.getDate());
      const comparison = compareParts(getPersianParts(day), parts);
      if (comparison === 0) return day;
      if (comparison < 0) low = day.getTime() + 86400000;
      else high = day.getTime() - 86400000;
    }
    return new Date();
  }

  function isPersianLeapYear(year) {
    return [1, 5, 9, 13, 17, 22, 26, 30].includes(year % 33);
  }

  function getDaysInMonth(system, parts) {
    if (system === "gregorian") return new Date(parts.year, parts.month, 0).getDate();
    if (parts.month <= 6) return 31;
    if (parts.month <= 11) return 30;
    return isPersianLeapYear(parts.year) ? 30 : 29;
  }

  function weekStartsOn() {
    return state.language === "fa" ? 6 : 0;
  }

  function getMonthDays(viewDate) {
    const startDay = weekStartsOn();
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() - startDay + 7) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }

  function getWeekCount(date) {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Math.ceil(((first.getDay() - weekStartsOn() + 7) % 7 + last.getDate()) / 7);
  }

  function formatDualMonthTitle(date) {
    const gregorian = new Intl.DateTimeFormat(gregorianLocale(), { month: "long", year: "numeric" }).format(date);
    const persian = new Intl.DateTimeFormat(persianLocale(), { month: "long", year: "numeric" }).format(date);
    return `${gregorian} / ${persian}`;
  }

  function formatDualYearTitle(date) {
    const gregorian = new Intl.DateTimeFormat(gregorianLocale(), { year: "numeric" }).format(date);
    const persian = new Intl.DateTimeFormat(persianLocale(), { year: "numeric" }).format(date);
    return `${gregorian} / ${persian}`;
  }

  function formatGregorianLong(date) {
    return new Intl.DateTimeFormat(gregorianLocale(), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function formatPersianLong(date) {
    if (state.language === "fa") {
      const parts = getPersianParts(date);
      const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(date);
      return `${formatNumber(parts.day)} ${PERSIAN_MONTHS_FA[parts.month - 1]} ${formatNumber(parts.year)}، ${weekday}`;
    }
    return new Intl.DateTimeFormat("en-US-u-ca-persian", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function formatUpdated(value) {
    if (!value) return "";
    const date = new Date(value);
    if (state.language === "fa") {
      const parts = getPersianParts(date);
      const time = new Intl.DateTimeFormat("fa-IR", { hour: "numeric", minute: "2-digit" }).format(date);
      return `${COPY.fa.updated}: ${formatNumber(parts.day)} ${PERSIAN_MONTHS_FA[parts.month - 1]}، ${time}`;
    }
    return `${COPY.en.updated}: ${new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)}`;
  }

  function populateSelect(select, values, currentValue) {
    select.replaceChildren(
      ...values.map((item) => {
        const option = document.createElement("option");
        option.value = String(item.value);
        option.textContent = item.label;
        option.selected = item.value === currentValue;
        return option;
      })
    );
  }

  function renderText() {
    const t = COPY[state.language];
    document.documentElement.lang = state.language;
    document.body.dir = state.language === "fa" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((node) => {
      node.textContent = t[node.dataset.i18n] || node.textContent;
    });
    $$("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = t[node.dataset.i18nPlaceholder] || "";
    });
    $("[data-language-label]").textContent = t.languageLabel;
  }

  function renderCalendar() {
    $(".calendar-title").textContent =
      state.calendarMode === "year" ? formatDualYearTitle(state.viewDate) : formatDualMonthTitle(state.viewDate);
    $$("[data-calendar-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.calendarMode === state.calendarMode);
    });
    if (state.calendarMode === "year") renderYearCalendar();
    else renderMonthCalendar();
  }

  function renderMonthCalendar() {
    const grid = $("[data-calendar-grid]");
    const days = getMonthDays(state.viewDate);
    const weekRow = document.createElement("div");
    weekRow.className = "week-row";
    for (let index = 0; index < 7; index += 1) {
      const day = new Date(2026, 7, 16 + weekStartsOn() + index);
      const cell = document.createElement("div");
      cell.className = "weekday";
      cell.textContent = new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(day);
      weekRow.append(cell);
    }
    const monthGrid = document.createElement("div");
    monthGrid.className = "month-grid";
    const todayKey = dateKey(new Date());
    days.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = "day-cell";
      if (day.getMonth() !== state.viewDate.getMonth()) cell.classList.add("muted");
      if (dateKey(day) === todayKey) cell.classList.add("today");
      cell.innerHTML = `<span class="day-main">${formatNumber(day.getDate())}</span><span class="day-alt">${new Intl.DateTimeFormat(
        persianLocale(),
        { day: "numeric" }
      ).format(day)}</span>`;
      monthGrid.append(cell);
    });
    grid.replaceChildren(weekRow, monthGrid);
  }

  function renderYearCalendar() {
    const grid = $("[data-calendar-grid]");
    const yearGrid = document.createElement("div");
    yearGrid.className = "year-grid";
    const todayKey = dateKey(new Date());
    Array.from({ length: 12 }, (_, index) => new Date(state.viewDate.getFullYear(), index, 1)).forEach((month) => {
      const block = document.createElement("div");
      block.className = "mini-month";
      if (month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()) {
        block.classList.add("active");
      }
      const days = getMonthDays(month);
      const title = new Intl.DateTimeFormat(gregorianLocale(), { month: "short" }).format(month);
      const persian = new Intl.DateTimeFormat(persianLocale(), { month: "short" }).format(month);
      block.innerHTML = `<div class="mini-head"><span>${title}</span><span>${persian}</span><span>${formatNumber(
        getWeekCount(month)
      )} ${COPY[state.language].weeks}</span></div>`;
      const miniDays = document.createElement("div");
      miniDays.className = "mini-days";
      days.forEach((day) => {
        const span = document.createElement("span");
        if (day.getMonth() !== month.getMonth()) span.className = "empty";
        else span.textContent = formatNumber(day.getDate());
        if (dateKey(day) === todayKey) span.className = "today";
        miniDays.append(span);
      });
      block.append(miniDays);
      yearGrid.append(block);
    });
    grid.replaceChildren(yearGrid);
  }

  function renderDateConverter() {
    const gregorianDate = partsToDate(state.gregorianParts);
    const persianDate = persianPartsToGregorian(state.persianParts);
    $("[data-gregorian-readable]").textContent = formatGregorianLong(gregorianDate);
    $("[data-persian-readable]").textContent = formatPersianLong(persianDate);
    $("[data-date-summary]").textContent = formatPersianLong(gregorianDate);

    populateSelect(
      $("[data-gregorian-month]"),
      Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: new Intl.DateTimeFormat(gregorianLocale(), { month: "long" }).format(new Date(2026, index, 1)),
      })),
      state.gregorianParts.month
    );
    populateSelect(
      $("[data-gregorian-day]"),
      Array.from({ length: getDaysInMonth("gregorian", state.gregorianParts) }, (_, index) => ({
        value: index + 1,
        label: formatNumber(index + 1),
      })),
      state.gregorianParts.day
    );
    populateSelect(
      $("[data-gregorian-year]"),
      Array.from({ length: 181 }, (_, index) => ({ value: 1940 + index, label: formatNumber(1940 + index) })),
      state.gregorianParts.year
    );
    populateSelect(
      $("[data-persian-month]"),
      (state.language === "fa" ? PERSIAN_MONTHS_FA : PERSIAN_MONTHS_EN).map((label, index) => ({
        value: index + 1,
        label,
      })),
      state.persianParts.month
    );
    populateSelect(
      $("[data-persian-day]"),
      Array.from({ length: getDaysInMonth("persian", state.persianParts) }, (_, index) => ({
        value: index + 1,
        label: formatNumber(index + 1),
      })),
      state.persianParts.day
    );
    populateSelect(
      $("[data-persian-year]"),
      Array.from({ length: 181 }, (_, index) => ({ value: 1320 + index, label: formatNumber(1320 + index) })),
      state.persianParts.year
    );

    const hasChanged = dateKey(gregorianDate) !== dateKey(new Date());
    $("[data-reset-date]").classList.toggle("hidden", !hasChanged);
  }

  function setGregorianPart(key, value) {
    const next = { ...state.gregorianParts, [key]: Number(value) };
    next.day = Math.min(next.day, getDaysInMonth("gregorian", next));
    const date = partsToDate(next);
    state.gregorianParts = next;
    state.persianParts = getPersianParts(date);
    renderDateConverter();
  }

  function setPersianPart(key, value) {
    const next = { ...state.persianParts, [key]: Number(value) };
    next.day = Math.min(next.day, getDaysInMonth("persian", next));
    const date = persianPartsToGregorian(next);
    state.persianParts = next;
    state.gregorianParts = getGregorianParts(date);
    renderDateConverter();
  }

  function resetDate() {
    const today = new Date();
    state.gregorianParts = getGregorianParts(today);
    state.persianParts = getPersianParts(today);
    renderDateConverter();
  }

  function rateFor(from, to) {
    if (from === to) return 1;
    const direct = state.rates?.[from]?.[to];
    if (typeof direct === "number") return direct;
    const reverse = state.rates?.[to]?.[from];
    if (typeof reverse === "number" && reverse !== 0) return 1 / reverse;
    return 0;
  }

  function renderCurrency(activeSide = "left") {
    const leftSelect = $("[data-currency-left-code]");
    const rightSelect = $("[data-currency-right-code]");
    const options = CURRENCIES.map((code) => ({ value: code, label: code === "TOMAN" ? "Toman" : code }));
    populateSelect(leftSelect, options, state.leftCode);
    populateSelect(rightSelect, options, state.rightCode);

    const rate = rateFor(state.leftCode, state.rightCode);
    if (activeSide === "left") {
      const rightValue = parseAmount(state.leftAmount) * rate;
      state.rightAmount = rate ? formatAmountValue(rightValue, state.rightCode) : "";
    } else {
      const leftValue = rate ? parseAmount(state.rightAmount) / rate : 0;
      state.leftAmount = rate ? formatAmountValue(leftValue, state.leftCode) : "";
    }

    $("[data-currency-left]").value = state.leftAmount;
    $("[data-currency-right]").value = state.rightAmount;
    const t = COPY[state.language];
    $("[data-rate-line]").textContent = rate ? `1 ${state.leftCode} = ${formatAmountValue(rate, state.rightCode)} ${state.rightCode}` : t.couldNotLoadRates;
    $("[data-updated-at]").textContent = formatUpdated(state.updatedAt);
    $("[data-reset-currency]").classList.toggle(
      "hidden",
      state.leftCode === "USD" && state.rightCode === "TOMAN" && parseAmount(state.leftAmount) === 1
    );
  }

  async function loadCurrency() {
    $("[data-updated-at]").textContent = COPY[state.language].loading;
    try {
      const response = await fetch(`${SITE}/api/today/currency`, { cache: "no-store" });
      if (!response.ok) throw new Error("rates");
      const data = await response.json();
      if (!data.ok || !data.rates) throw new Error("rates");
      state.rates = data.rates;
      state.updatedAt = data.updatedAt || new Date().toISOString();
      renderCurrency("left");
    } catch {
      $("[data-rate-line]").textContent = COPY[state.language].couldNotLoadRates;
      $("[data-updated-at]").textContent = "";
    }
  }

  function renderCards(selector, items, options = {}) {
    const root = $(selector);
    root.replaceChildren(
      ...items.slice(0, 3).map((item, index) => {
        const link = document.createElement("a");
        link.className = options.media ? "content-card media" : "content-card";
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener";
        const meta = item.stars ? `★ ${formatNumber(item.stars)} · ${item.date || ""}` : item.date || "";
        const media = options.media ? '<span class="thumb" aria-hidden="true"></span>' : "";
        link.innerHTML = `${media}<span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(
          item.description || ""
        )}</p><span class="card-meta">${escapeHtml(meta)}</span></span>`;
        link.style.setProperty("--thumb-index", index);
        return link;
      })
    );
  }

  async function loadNews() {
    const root = $("[data-news-list]");
    root.innerHTML = `<div class="content-card"><p>${COPY[state.language].loading}</p></div>`;
    try {
      const response = await fetch(`${SITE}/api/today/news`, { cache: "no-store" });
      if (!response.ok) throw new Error("news");
      const data = await response.json();
      if (!data.ok || !Array.isArray(data.items)) throw new Error("news");
      renderCards("[data-news-list]", data.items.map((item) => ({ ...item, href: item.href || "https://t.me/VahidOnline" })));
    } catch {
      root.innerHTML = `<div class="content-card"><p>${COPY[state.language].couldNotLoadNews}</p></div>`;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
    });
  }

  function bindEvents() {
    $("[data-language]").addEventListener("click", () => {
      state.language = state.language === "en" ? "fa" : "en";
      writeLocal(STORAGE.language, state.language);
      renderAll();
      void loadNews();
    });

    $$("[data-calendar-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.calendarMode = button.dataset.calendarMode;
        renderCalendar();
      });
    });

    $("[data-calendar-prev]").addEventListener("click", () => {
      state.viewDate =
        state.calendarMode === "year"
          ? new Date(state.viewDate.getFullYear() - 1, state.viewDate.getMonth(), 1)
          : new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() - 1, 1);
      renderCalendar();
    });

    $("[data-calendar-next]").addEventListener("click", () => {
      state.viewDate =
        state.calendarMode === "year"
          ? new Date(state.viewDate.getFullYear() + 1, state.viewDate.getMonth(), 1)
          : new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + 1, 1);
      renderCalendar();
    });

    $$("[data-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.dataset.toggle;
        const body = $(`[data-panel="${name}"]`);
        const open = !body.classList.contains("open");
        body.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
        writeLocal(name === "note" ? STORAGE.noteOpen : STORAGE.dateOpen, String(open));
      });
    });

    $("[data-reset-date]").addEventListener("click", (event) => {
      event.stopPropagation();
      resetDate();
    });

    $("[data-gregorian-month]").addEventListener("change", (event) => setGregorianPart("month", event.target.value));
    $("[data-gregorian-day]").addEventListener("change", (event) => setGregorianPart("day", event.target.value));
    $("[data-gregorian-year]").addEventListener("change", (event) => setGregorianPart("year", event.target.value));
    $("[data-persian-month]").addEventListener("change", (event) => setPersianPart("month", event.target.value));
    $("[data-persian-day]").addEventListener("change", (event) => setPersianPart("day", event.target.value));
    $("[data-persian-year]").addEventListener("change", (event) => setPersianPart("year", event.target.value));

    $("[data-currency-left]").addEventListener("input", (event) => {
      state.leftAmount = formatAmountInput(event.target.value);
      renderCurrency("left");
    });
    $("[data-currency-right]").addEventListener("input", (event) => {
      state.rightAmount = formatAmountInput(event.target.value);
      renderCurrency("right");
    });
    $("[data-currency-left-code]").addEventListener("change", (event) => {
      state.leftCode = event.target.value;
      renderCurrency("left");
    });
    $("[data-currency-right-code]").addEventListener("change", (event) => {
      state.rightCode = event.target.value;
      renderCurrency("left");
    });
    $("[data-swap-currency]").addEventListener("click", () => {
      [state.leftCode, state.rightCode] = [state.rightCode, state.leftCode];
      [state.leftAmount, state.rightAmount] = [state.rightAmount || "1", state.leftAmount || "1"];
      renderCurrency("left");
    });
    $("[data-reset-currency]").addEventListener("click", () => {
      state.leftCode = "USD";
      state.rightCode = "TOMAN";
      state.leftAmount = "1";
      renderCurrency("left");
    });

    $("[data-note]").addEventListener("input", (event) => {
      writeLocal(STORAGE.note, event.target.value);
    });
  }

  function renderAll() {
    renderText();
    renderCalendar();
    renderDateConverter();
    renderCurrency("left");
    renderCards("[data-radar-list]", FALLBACK_RADAR);
    renderCards("[data-prompt-list]", FALLBACK_PROMPTS, { media: true });
  }

  async function init() {
    const [language, note, noteOpen, dateOpen] = await Promise.all([
      readLocal(STORAGE.language),
      readLocal(STORAGE.note),
      readLocal(STORAGE.noteOpen),
      readLocal(STORAGE.dateOpen),
    ]);
    if (language === "fa" || language === "en") state.language = language;
    $("[data-note]").value = note || "";
    if (noteOpen === "true") {
      $("[data-panel=\"note\"]").classList.add("open");
      $("[data-toggle=\"note\"]").setAttribute("aria-expanded", "true");
    }
    if (dateOpen === "true") {
      $("[data-panel=\"date\"]").classList.add("open");
      $("[data-toggle=\"date\"]").setAttribute("aria-expanded", "true");
    }
    bindEvents();
    renderAll();
    await loadCurrency();
    await loadNews();
    setInterval(loadNews, 60 * 60 * 1000);
  }

  void init();
})();
