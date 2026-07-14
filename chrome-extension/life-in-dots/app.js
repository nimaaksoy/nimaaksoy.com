// 1. Original 60 Daily Messages
const DAILY_MESSAGES = [
  "You do not need to fix everything today.",
  "A small good day still counts.",
  "There is time for one meaningful thing.",
  "Notice something worth remembering.",
  "You are allowed to enjoy an ordinary day.",
  "Use today gently, but use it.",
  "Some progress is invisible at first.",
  "Call someone you are glad exists.",
  "Let yourself breathe between the tasks.",
  "The world is busy, but you can go at your own pace.",
  "Focus on the ground beneath your feet.",
  "Give yourself permission to rest.",
  "You are doing better than you realize.",
  "It is enough to simply be present today.",
  "One step at a time is still movement.",
  "Find a quiet moment to just look around.",
  "You don't have to prove anything today.",
  "Small choices shape a peaceful day.",
  "Be kind to your own mind.",
  "Let go of what you couldn't finish yesterday.",
  "Today is a canvas of ordinary moments.",
  "Take a breath and start where you are.",
  "Listen to the quiet spaces in your day.",
  "A slow day is not a wasted day.",
  "Small efforts add up quietly.",
  "Notice the light in the room right now.",
  "You have solved difficult days before.",
  "Choose one small thing that brings you peace.",
  "You don't have to carry it all at once.",
  "The stars are there even when the sky is cloudy.",
  "Take time to appreciate a simple cup of tea or coffee.",
  "Today is one of your days. Make it yours.",
  "A gentle word to yourself goes a long way.",
  "There is beauty in things that take time.",
  "Let the day unfold without forcing it.",
  "Focus on what you can control right now.",
  "You belong in this moment.",
  "Rest is part of the work, not the reward.",
  "Enjoy the quiet before the day gets loud.",
  "Be patient with your own progress.",
  "Small acts of care are never wasted.",
  "Look at how far you have already come.",
  "You are the author of your own calm.",
  "Keep your eyes on the small wonders.",
  "Today has its own rhythm. Find yours.",
  "You do not have to be perfect to be helpful.",
  "Give your attention to what is right in front of you.",
  "Remember to stretch, look up, and breathe.",
  "A simple day can be a very good day.",
  "Your energy is a resource to be protected.",
  "Allow yourself to change your mind today.",
  "The best part of today might be a quiet evening.",
  "Take a moment to feel the fresh air.",
  "You are allowed to take up space.",
  "It is okay if today is just about getting through.",
  "Notice the sounds around you.",
  "Let today be a little lighter if you can.",
  "There is a quiet strength in staying steady.",
  "Celebrate the small, invisible victories.",
  "Today is a gift you get to open one hour at a time."
];

// 2. Storage Adapter (chrome.storage.local fallback to localStorage)
const STORAGE_PREFIX = "life-in-dots:";
const STORAGE_KEYS = {
  PROFILE: `${STORAGE_PREFIX}profile`,
  PREFERENCES: `${STORAGE_PREFIX}preferences`,
  INTENTIONS: `${STORAGE_PREFIX}intentions`
};

const storage = {
  isExtension: typeof chrome !== "undefined" && chrome.storage && chrome.storage.local,

  async get(key, defaultValue) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    } else {
      const val = localStorage.getItem(key);
      if (val === null) return defaultValue;
      try {
        return JSON.parse(val);
      } catch {
        return defaultValue;
      }
    }
  },

  async set(key, value) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  async remove(key) {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], resolve);
      });
    } else {
      localStorage.removeItem(key);
    }
  }
};

// 3. Calculation Utilities
function parseDateOnly(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getBirthdayInYear(birthDate, year) {
  const bMonth = birthDate.getMonth();
  const bDate = birthDate.getDate();
  if (bMonth === 1 && bDate === 29 && !isLeapYear(year)) {
    return new Date(year, 2, 1, 0, 0, 0, 0);
  }
  return new Date(year, bMonth, bDate, 0, 0, 0, 0);
}

function calculateAge(birthDate, today) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getDaysBetween(startDate, endDate) {
  const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

function getNextBirthday(birthDate, today) {
  const currentYear = today.getFullYear();
  let nextBday = getBirthdayInYear(birthDate, currentYear);
  if (nextBday <= today) {
    nextBday = getBirthdayInYear(birthDate, currentYear + 1);
  }
  return nextBday;
}

function getNextMilestone(daysLived) {
  const step = 1000;
  const milestone = Math.floor(daysLived / step) * step + step;
  return { milestone, daysUntil: milestone - daysLived };
}

function performLifeCalculations(birthDate, today, targetAge) {
  const daysLived = getDaysBetween(birthDate, today) + 1;
  const ageYears = calculateAge(birthDate, today);
  
  let monthsLived = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) {
    monthsLived = Math.max(0, monthsLived - 1);
  }

  const hoursLived = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60));
  const targetBirthday = getBirthdayInYear(birthDate, birthDate.getFullYear() + targetAge);
  
  const totalDaysInTimeline = getDaysBetween(birthDate, targetBirthday);
  const daysAheadInTimeline = Math.max(0, totalDaysInTimeline - daysLived);
  const percentageLivedOfTimeline = Math.min(100, Math.max(0, (daysLived / totalDaysInTimeline) * 100));

  const nextBirthdayDate = getNextBirthday(birthDate, today);
  const daysToNextBirthday = getDaysBetween(today, nextBirthdayDate);

  const newYearsExperienced = Math.max(0, today.getFullYear() - birthDate.getFullYear() + (birthDate.getMonth() === 0 && birthDate.getDate() === 1 ? 1 : 0));

  const { milestone, daysUntil } = getNextMilestone(daysLived);
  const milestoneDate = new Date(birthDate);
  milestoneDate.setDate(birthDate.getDate() + milestone - 1);

  return {
    daysLived,
    ageYears,
    monthsLived,
    hoursLived,
    daysAheadInTimeline,
    percentageLivedOfTimeline,
    nextBirthdayDate,
    daysToNextBirthday,
    newYearsExperienced,
    nextMilestone: milestone,
    daysToNextMilestone: daysUntil,
    nextMilestoneDate: milestoneDate
  };
}

// 4. Deterministic Message Selector
function getDailyMessage(date) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}

// State variables
let userProfile = null;
let userPreferences = { selectedUnit: "Days" };
let userIntentions = {};
let daysViewMode = "current-year"; // current-year vs overview

// DOM Elements
const onboardingView = document.getElementById("onboarding-view");
const dashboardView = document.getElementById("dashboard-view");
const settingsOverlay = document.getElementById("settings-overlay");

// Onboarding Elements
const obNameText = document.getElementById("ob-name-text");
const obNameInput = document.getElementById("ob-name-input");
const obBdayText = document.getElementById("ob-bday-text");
const obBdayInput = document.getElementById("ob-bday-input");
const obAgeText = document.getElementById("ob-age-text");
const obAgeInput = document.getElementById("ob-age-input");
const obWarning = document.getElementById("ob-warning");
const startBtn = document.getElementById("start-btn");

// Dashboard Elements
const currentDateLbl = document.getElementById("current-date-lbl");
const greetingLbl = document.getElementById("greeting-lbl");
const dailyMessageLbl = document.getElementById("daily-message-lbl");
const daysLivedLbl = document.getElementById("days-lived-lbl");
const currentDayLbl = document.getElementById("current-day-lbl");
const timelineAheadTitle = document.getElementById("timeline-ahead-title");
const daysAheadLbl = document.getElementById("days-ahead-lbl");
const domGrid = document.getElementById("dom-grid");
const lifeCanvas = document.getElementById("life-canvas");
const canvasTooltip = document.getElementById("canvas-tooltip");
const subToggleRow = document.getElementById("days-view-options");
const milestoneLbl = document.getElementById("milestone-lbl");
const factsGrid = document.getElementById("facts-grid");

// Intention Elements
const intentionDisplayBtn = document.getElementById("intention-display-btn");
const intentionTextLbl = document.getElementById("intention-text-lbl");
const intentionEditor = document.getElementById("intention-editor");
const intentionTextarea = document.getElementById("intention-textarea");
const charCounter = document.getElementById("char-counter");

// Settings Elements
const toggleSettingsBtn = document.getElementById("toggle-settings-btn");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const setNameText = document.getElementById("set-name-text");
const setNameInput = document.getElementById("set-name-input");
const setBdayText = document.getElementById("set-bday-text");
const setBdayInput = document.getElementById("set-bday-input");
const setAgeText = document.getElementById("set-age-text");
const setAgeInput = document.getElementById("set-age-input");
const setSleepText = document.getElementById("set-sleep-text");
const setSleepInput = document.getElementById("set-sleep-input");
const setCustomAgeRow = document.getElementById("set-custom-age-row");
const forgetDataBtn = document.getElementById("forget-data-btn");
const resetConfirmBox = document.getElementById("reset-confirm-box");
const confirmResetBtn = document.getElementById("confirm-reset-btn");
const cancelResetBtn = document.getElementById("cancel-reset-btn");

// App Initialization
async function init() {
  userProfile = await storage.get(STORAGE_KEYS.PROFILE, null);
  userPreferences = await storage.get(STORAGE_KEYS.PREFERENCES, { selectedUnit: "Days" });
  userIntentions = await storage.get(STORAGE_KEYS.INTENTIONS, {});

  // Date Check
  const today = new Date();
  currentDateLbl.textContent = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  dailyMessageLbl.innerHTML = `&ldquo;${getDailyMessage(today)}&rdquo;`;

  setupEventListeners();

  if (userProfile && userProfile.birthday) {
    showDashboard();
  } else {
    showOnboarding();
  }
}

// Navigation helpers
function showOnboarding() {
  onboardingView.classList.remove("hidden");
  dashboardView.classList.add("hidden");
}

function showDashboard() {
  onboardingView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  renderDashboard();
}

// Event Bindings
function setupEventListeners() {
  // Onboarding Editing
  setupInlineEdit(obNameText, obNameInput, (val) => {
    obNameText.textContent = val || "Add your name";
    checkOnboardingValid();
  });

  setupInlineEdit(obBdayText, obBdayInput, (val) => {
    obBdayText.textContent = val || "Select birthday";
    checkOnboardingValid();
  });

  setupInlineEdit(obAgeText, obAgeInput, (val) => {
    obAgeText.textContent = val || "90";
    checkOnboardingValid();
  });

  startBtn.addEventListener("click", () => {
    const name = obNameInput.value.trim();
    const birthday = obBdayInput.value;
    const targetAge = parseInt(obAgeInput.value) || 90;

    userProfile = {
      name: name || undefined,
      birthday,
      targetAge,
      timelineMode: targetAge === 90 ? "default" : "custom",
      sleepHours: 8,
      storageMode: "persistent"
    };

    storage.set(STORAGE_KEYS.PROFILE, userProfile);
    showDashboard();
  });

  // Settings Slide out
  toggleSettingsBtn.addEventListener("click", () => {
    populateSettingsDrawer();
    settingsOverlay.classList.remove("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsOverlay.classList.add("hidden");
  });

  settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) {
      settingsOverlay.classList.add("hidden");
    }
  });

  // Settings Inputs
  setupInlineEdit(setNameText, setNameInput, (val) => {
    setNameText.textContent = val || "Add your name";
    userProfile.name = val || undefined;
    storage.set(STORAGE_KEYS.PROFILE, userProfile);
    renderDashboard();
  });

  setupInlineEdit(setBdayText, setBdayInput, (val) => {
    if (!val) return;
    setBdayText.textContent = val;
    userProfile.birthday = val;
    storage.set(STORAGE_KEYS.PROFILE, userProfile);
    renderDashboard();
  });

  setupInlineEdit(setAgeText, setAgeInput, (val) => {
    const age = parseInt(val);
    if (!age || age < 1 || age > 120) return;
    setAgeText.textContent = String(age);
    userProfile.targetAge = age;
    storage.set(STORAGE_KEYS.PROFILE, userProfile);
    renderDashboard();
  });

  setupInlineEdit(setSleepText, setSleepInput, (val) => {
    const hours = parseInt(val);
    if (!hours || hours < 4 || hours > 12) return;
    setSleepText.textContent = String(hours);
    userProfile.sleepHours = hours;
    storage.set(STORAGE_KEYS.PROFILE, userProfile);
    renderDashboard();
  });

  // Timeline drawer modes
  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const mode = e.target.dataset.mode;
      document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      if (mode === "default") {
        userProfile.targetAge = 90;
        userProfile.timelineMode = "default";
        setCustomAgeRow.classList.add("hidden");
      } else if (mode === "expectancy") {
        userProfile.targetAge = 74; // approximate
        userProfile.timelineMode = "expectancy";
        setCustomAgeRow.classList.add("hidden");
      } else {
        userProfile.timelineMode = "custom";
        setCustomAgeRow.classList.remove("hidden");
        setAgeText.textContent = String(userProfile.targetAge);
        setAgeInput.value = String(userProfile.targetAge);
      }

      storage.set(STORAGE_KEYS.PROFILE, userProfile);
      renderDashboard();
    });
  });

  // Danger Reset
  forgetDataBtn.addEventListener("click", () => {
    resetConfirmBox.classList.remove("hidden");
    forgetDataBtn.classList.add("hidden");
  });

  cancelResetBtn.addEventListener("click", () => {
    resetConfirmBox.classList.add("hidden");
    forgetDataBtn.classList.remove("hidden");
  });

  confirmResetBtn.addEventListener("click", async () => {
    await storage.remove(STORAGE_KEYS.PROFILE);
    await storage.remove(STORAGE_KEYS.PREFERENCES);
    await storage.remove(STORAGE_KEYS.INTENTIONS);
    
    userProfile = null;
    userPreferences = { selectedUnit: "Days" };
    userIntentions = {};

    resetConfirmBox.classList.add("hidden");
    forgetDataBtn.classList.remove("hidden");
    settingsOverlay.classList.add("hidden");
    
    showOnboarding();
  });

  // Intention Input
  intentionDisplayBtn.addEventListener("click", () => {
    intentionDisplayBtn.classList.add("hidden");
    intentionEditor.classList.remove("hidden");
    intentionTextarea.value = intentionTextLbl.textContent === "Click to write one small thing" ? "" : intentionTextLbl.textContent;
    intentionTextarea.focus();
    charCounter.textContent = `${intentionTextarea.value.length} / 160`;
  });

  intentionTextarea.addEventListener("input", () => {
    charCounter.textContent = `${intentionTextarea.value.length} / 160`;
  });

  intentionTextarea.addEventListener("blur", saveIntention);
  intentionTextarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveIntention();
    } else if (e.key === "Escape") {
      intentionEditor.classList.add("hidden");
      intentionDisplayBtn.classList.remove("hidden");
    }
  });

  // View tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      
      userPreferences.selectedUnit = e.target.dataset.unit;
      storage.set(STORAGE_KEYS.PREFERENCES, userPreferences);
      
      renderGrid();
    });
  });

  // Day sub-toggles
  document.getElementById("toggle-days-detail").addEventListener("click", () => {
    daysViewMode = "current-year";
    document.getElementById("toggle-days-detail").classList.add("active");
    document.getElementById("toggle-days-canvas").classList.remove("active");
    renderGrid();
  });

  document.getElementById("toggle-days-canvas").addEventListener("click", () => {
    daysViewMode = "overview";
    document.getElementById("toggle-days-detail").classList.remove("active");
    document.getElementById("toggle-days-canvas").classList.add("active");
    renderGrid();
  });

  // Canvas events
  lifeCanvas.addEventListener("mousemove", handleCanvasMouseMove);
  lifeCanvas.addEventListener("mouseleave", handleCanvasMouseLeave);
}

// Inline Editing helper
function setupInlineEdit(textEl, inputEl, onSave) {
  textEl.addEventListener("click", () => {
    textEl.classList.add("hidden");
    inputEl.classList.remove("hidden");
    inputEl.focus();
    if (inputEl.type !== "date") {
      inputEl.select();
    }
  });

  const save = () => {
    const val = inputEl.value.trim();
    const success = onSave(val);
    if (success !== false) {
      inputEl.classList.add("hidden");
      textEl.classList.remove("hidden");
    }
  };

  inputEl.addEventListener("blur", save);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      save();
    } else if (e.key === "Escape") {
      inputEl.value = textEl.textContent === "Add your name" || textEl.textContent === "Select birthday" ? "" : textEl.textContent;
      inputEl.classList.add("hidden");
      textEl.classList.remove("hidden");
    }
  });
}

function checkOnboardingValid() {
  const birthday = obBdayInput.value;
  const targetAge = parseInt(obAgeInput.value) || 90;
  
  if (!birthday) {
    startBtn.classList.add("hidden");
    obWarning.classList.add("hidden");
    return;
  }

  const birthDate = parseDateOnly(birthday);
  const today = new Date();
  const currentAge = calculateAge(birthDate, today);

  if (birthDate >= today) {
    startBtn.classList.add("hidden");
    obWarning.classList.add("hidden");
    return;
  }

  if (currentAge >= targetAge) {
    startBtn.classList.add("hidden");
    obWarning.classList.remove("hidden");
  } else {
    obWarning.classList.add("hidden");
    startBtn.classList.remove("hidden");
  }
}

function populateSettingsDrawer() {
  setNameText.textContent = userProfile.name || "Add your name";
  setNameInput.value = userProfile.name || "";
  setBdayText.textContent = userProfile.birthday;
  setBdayInput.value = userProfile.birthday;
  setSleepText.textContent = String(userProfile.sleepHours || 8);
  setSleepInput.value = String(userProfile.sleepHours || 8);

  const mode = userProfile.timelineMode;
  document.querySelectorAll(".preset-btn").forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (mode === "custom") {
    setCustomAgeRow.classList.remove("hidden");
    setAgeText.textContent = String(userProfile.targetAge);
    setAgeInput.value = String(userProfile.targetAge);
  } else {
    setCustomAgeRow.classList.add("hidden");
  }
}

function saveIntention() {
  const val = intentionTextarea.value.trim().slice(0, 160);
  const todayKey = getTodayKey();
  
  if (val) {
    userIntentions[todayKey] = val;
    intentionTextLbl.textContent = val;
    intentionTextLbl.classList.remove("italic-placeholder");
  } else {
    delete userIntentions[todayKey];
    intentionTextLbl.textContent = "Click to write one small thing";
    intentionTextLbl.classList.add("italic-placeholder");
  }

  storage.set(STORAGE_KEYS.INTENTIONS, userIntentions);
  intentionEditor.classList.add("hidden");
  intentionDisplayBtn.classList.remove("hidden");
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Rendering Core
function renderDashboard() {
  if (!userProfile) return;

  const today = new Date();
  const birthDate = parseDateOnly(userProfile.birthday);
  const targetAge = userProfile.targetAge;

  // Greeting
  const hour = today.getHours();
  let greeting = "This is one of your days";
  if (userProfile.name) {
    if (hour < 12) greeting = `Good morning, ${userProfile.name}`;
    else if (hour < 17) greeting = `Good afternoon, ${userProfile.name}`;
    else greeting = `Good evening, ${userProfile.name}`;
  }
  greetingLbl.textContent = greeting;

  // Calculations
  const calcs = performLifeCalculations(birthDate, today, targetAge);

  daysLivedLbl.textContent = calcs.daysLived.toLocaleString();
  currentDayLbl.textContent = calcs.daysLived.toLocaleString();
  timelineAheadTitle.textContent = `Your possible ${targetAge}-year timeline`;
  daysAheadLbl.textContent = `~${calcs.daysAheadInTimeline.toLocaleString()}`;

  // Milestone
  if (calcs.daysToNextMilestone === 0) {
    milestoneLbl.innerHTML = `Today is your <span class="highlight-text font-semibold">${calcs.nextMilestone.toLocaleString()}th</span> day alive!`;
  } else {
    milestoneLbl.innerHTML = `Your next major milestone—your <span class="highlight-text font-semibold">${calcs.nextMilestone.toLocaleString()}th day</span>—is in <span class="highlight-text font-semibold">${calcs.daysToNextMilestone} days</span> (${calcs.nextMilestoneDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}).`;
  }

  // Intention Load
  const todayKey = getTodayKey();
  const todayIntention = userIntentions[todayKey] || "";
  if (todayIntention) {
    intentionTextLbl.textContent = todayIntention;
    intentionTextLbl.classList.remove("italic-placeholder");
  } else {
    intentionTextLbl.textContent = "Click to write one small thing";
    intentionTextLbl.classList.add("italic-placeholder");
  }

  // Pre-load tab button state
  document.querySelectorAll(".tab-btn").forEach(btn => {
    if (btn.dataset.unit === userPreferences.selectedUnit) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderGrid();
  renderFacts(calcs);
}

function renderFacts(calcs) {
  const sleepHours = userProfile.sleepHours || 8;
  const sleepDays = calcs.daysLived * (sleepHours / 24);
  const sleepYears = (sleepDays / 365.25).toFixed(1);

  const facts = [
    { label: "Days Lived", value: calcs.daysLived.toLocaleString() },
    { label: "Months Lived", value: calcs.monthsLived.toLocaleString() },
    { label: "Sunrises witnessed", value: calcs.daysLived.toLocaleString() },
    { label: "New Year days experienced", value: calcs.newYearsExperienced },
    { label: "Possible birthdays ahead", value: Math.max(0, userProfile.targetAge - calcs.ageYears) },
    { label: "Sleeping estimate", value: `~${sleepYears} years` }
  ];

  factsGrid.innerHTML = facts.map(f => `
    <div class="fact-card">
      <span class="fact-card-lbl">${f.label}</span>
      <span class="fact-card-val">${f.value}</span>
    </div>
  `).join("");
}

// Tab Grid render manager
function renderGrid() {
  const unit = userPreferences.selectedUnit;
  
  // Set unit labels in legend
  document.querySelectorAll(".legend-unit-name").forEach(el => {
    el.textContent = unit.endsWith("s") ? unit.slice(0, -1).toLowerCase() : unit.toLowerCase();
  });

  if (unit === "Days" && daysViewMode === "overview") {
    domGrid.classList.add("hidden");
    lifeCanvas.classList.remove("hidden");
    subToggleRow.classList.remove("hidden");
    drawDaysCanvas();
  } else {
    domGrid.classList.remove("hidden");
    lifeCanvas.classList.add("hidden");
    canvasTooltip.classList.add("hidden");
    
    if (unit === "Days") {
      subToggleRow.classList.remove("hidden");
    } else {
      subToggleRow.classList.add("hidden");
    }

    renderDOMGrid(unit);
  }
}

// Render DOM lists (Years, Months, Hours, Day Current year)
function renderDOMGrid(unit) {
  domGrid.innerHTML = "";
  
  const today = new Date();
  const birthDate = parseDateOnly(userProfile.birthday);
  const targetAge = userProfile.targetAge;

  if (unit === "Years") {
    domGrid.className = "dom-dot-grid cols-10";
    const currentAge = calculateAge(birthDate, today);
    
    for (let i = 0; i < targetAge; i++) {
      const isLived = i < currentAge;
      const isCurrent = i === currentAge;
      
      const wrapper = document.createElement("div");
      wrapper.className = "dom-dot-wrapper";
      
      const dot = document.createElement("button");
      dot.className = `dom-dot size-md ${isCurrent ? "current pulsing" : isLived ? "lived" : "future"}`;
      dot.setAttribute("aria-label", `Age ${i} - ${isCurrent ? "Current" : isLived ? "Lived" : "Future"}`);
      
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip-box";
      tooltip.textContent = `Age ${i} ${isCurrent ? "— Current" : isLived ? "— Completed" : "— Future"}`;

      wrapper.appendChild(dot);
      wrapper.appendChild(tooltip);
      domGrid.appendChild(wrapper);
    }
  } 
  
  else if (unit === "Months") {
    domGrid.className = "dom-dot-grid cols-12";
    
    let monthsLived = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
      monthsLived = Math.max(0, monthsLived - 1);
    }

    const totalMonths = targetAge * 12;

    for (let i = 0; i < totalMonths; i++) {
      const isLived = i < monthsLived;
      const isCurrent = i === monthsLived;
      
      const wrapper = document.createElement("div");
      wrapper.className = "dom-dot-wrapper";
      
      const dot = document.createElement("button");
      dot.className = `dom-dot size-sm ${isCurrent ? "current pulsing" : isLived ? "lived" : "future"}`;
      
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip-box";
      
      // Calculate month details lazily when mouse interacts or just inline
      wrapper.addEventListener("mouseenter", () => {
        const monthOffset = i;
        const totalMonthsFromBirth = birthDate.getMonth() + monthOffset;
        const calendarMonth = totalMonthsFromBirth % 12;
        const calendarYear = birthDate.getFullYear() + Math.floor(totalMonthsFromBirth / 12);
        const age = Math.floor(monthOffset / 12);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        tooltip.textContent = `${months[calendarMonth]} ${calendarYear} — age ${age}`;
      });

      wrapper.appendChild(dot);
      wrapper.appendChild(tooltip);
      domGrid.appendChild(wrapper);
    }
  } 
  
  else if (unit === "Days") {
    // Current year DOM view (7 cols)
    domGrid.className = "dom-dot-grid cols-7";
    const currentAge = calculateAge(birthDate, today);
    const yearStart = getBirthdayInYear(birthDate, birthDate.getFullYear() + currentAge);
    const yearEnd = getBirthdayInYear(birthDate, birthDate.getFullYear() + currentAge + 1);
    
    const daysTotal = getDaysBetween(yearStart, yearEnd);
    let livedDays = 0;
    if (today >= yearEnd) {
      livedDays = daysTotal;
    } else if (today >= yearStart) {
      livedDays = getDaysBetween(yearStart, today) + 1;
    }

    for (let i = 0; i < daysTotal; i++) {
      const isLived = i < livedDays;
      const isCurrent = i === livedDays - 1;

      const wrapper = document.createElement("div");
      wrapper.className = "dom-dot-wrapper";
      
      const dot = document.createElement("button");
      dot.className = `dom-dot size-md ${isCurrent ? "current pulsing" : isLived ? "lived" : "future"}`;
      
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip-box";
      tooltip.textContent = `Day ${i + 1} ${isCurrent ? "— Today" : isLived ? "— Passed" : "— Future"}`;

      wrapper.appendChild(dot);
      wrapper.appendChild(tooltip);
      domGrid.appendChild(wrapper);
    }
  } 
  
  else if (unit === "Hours") {
    domGrid.className = "dom-dot-grid cols-12";
    const currentHour = today.getHours();
    
    for (let i = 0; i < 24; i++) {
      const isLived = i < currentHour;
      const isCurrent = i === currentHour;

      const wrapper = document.createElement("div");
      wrapper.className = "dom-dot-wrapper";
      
      const dot = document.createElement("button");
      dot.className = `dom-dot size-md ${isCurrent ? "current pulsing" : isLived ? "lived" : "future"}`;
      
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip-box";
      const displayHour = i === 0 ? "12 AM" : i === 12 ? "12 PM" : i > 12 ? `${i - 12} PM` : `${i} AM`;
      tooltip.textContent = `${displayHour} ${isCurrent ? "— Current" : isLived ? "— Passed" : "— Future"}`;

      wrapper.appendChild(dot);
      wrapper.appendChild(tooltip);
      domGrid.appendChild(wrapper);
    }
  }
}

// Draw full days grid on Canvas
function drawDaysCanvas() {
  const birthDate = parseDateOnly(userProfile.birthday);
  const targetAge = userProfile.targetAge;
  const today = new Date();

  const width = Math.max(320, domGrid.parentElement.clientWidth);
  const columns = 366;
  const rows = targetAge;
  
  const dotSize = Math.max(1, (width - columns * 0.8) / columns);
  const gapX = 0.8;
  const gapY = 2;
  const rowHeight = dotSize + gapY;
  const height = rows * rowHeight;

  const dpr = window.devicePixelRatio || 1;
  lifeCanvas.width = width * dpr;
  lifeCanvas.height = height * dpr;
  lifeCanvas.style.width = `${width}px`;
  lifeCanvas.style.height = `${height}px`;

  const ctx = lifeCanvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  for (let y = 0; y < rows; y++) {
    const yearStart = getBirthdayInYear(birthDate, birthDate.getFullYear() + y);
    const yearEnd = getBirthdayInYear(birthDate, birthDate.getFullYear() + y + 1);
    const daysInYear = getDaysBetween(yearStart, yearEnd);

    let livedDaysCount = 0;
    let isCurrentYear = false;

    if (today < yearStart) {
      livedDaysCount = 0;
    } else if (today >= yearEnd) {
      livedDaysCount = daysInYear;
    } else {
      livedDaysCount = getDaysBetween(yearStart, today) + 1;
      isCurrentYear = true;
    }

    const rowY = y * rowHeight;

    for (let x = 0; x < daysInYear; x++) {
      const dotX = x * (dotSize + gapX);
      const isLived = x < livedDaysCount;
      const isCurrentDay = isCurrentYear && x === livedDaysCount - 1;

      if (isCurrentDay) {
        ctx.fillStyle = "#2cff05";
        ctx.fillRect(dotX, rowY, dotSize, dotSize);
      } else if (isLived) {
        ctx.fillStyle = "#eaeaea";
        ctx.fillRect(dotX, rowY, dotSize, dotSize);
      } else {
        ctx.strokeStyle = "rgba(127, 127, 127, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(dotX, rowY, dotSize, dotSize);
      }
    }
  }
}

function handleCanvasMouseMove(e) {
  if (!userProfile) return;
  const rect = lifeCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const width = rect.width;
  const columns = 366;
  const rows = userProfile.targetAge;
  const dotSize = Math.max(1, (width - columns * 0.8) / columns);
  const gapX = 0.8;
  const gapY = 2;
  const rowHeight = dotSize + gapY;

  const yearIndex = Math.floor(mouseY / rowHeight);
  const dayIndex = Math.floor(mouseX / (dotSize + gapX));

  if (yearIndex >= 0 && yearIndex < rows && dayIndex >= 0) {
    const birthDate = parseDateOnly(userProfile.birthday);
    const yearStart = getBirthdayInYear(birthDate, birthDate.getFullYear() + yearIndex);
    const yearEnd = getBirthdayInYear(birthDate, birthDate.getFullYear() + yearIndex + 1);
    const daysInYear = getDaysBetween(yearStart, yearEnd);

    if (dayIndex < daysInYear) {
      const dotDate = new Date(yearStart);
      dotDate.setDate(yearStart.getDate() + dayIndex);

      let livedDaysCount = 0;
      let isCurrentYear = false;
      const today = new Date();

      if (today < yearStart) {
        livedDaysCount = 0;
      } else if (today >= yearEnd) {
        livedDaysCount = daysInYear;
      } else {
        livedDaysCount = getDaysBetween(yearStart, today) + 1;
        isCurrentYear = true;
      }

      const isLived = dayIndex < livedDaysCount;
      const isToday = isCurrentYear && dayIndex === livedDaysCount - 1;

      // Find overall day of life
      let dayOfLife = dayIndex + 1;
      for (let i = 0; i < yearIndex; i++) {
        const start = getBirthdayInYear(birthDate, birthDate.getFullYear() + i);
        const end = getBirthdayInYear(birthDate, birthDate.getFullYear() + i + 1);
        dayOfLife += getDaysBetween(start, end);
      }

      canvasTooltip.classList.remove("hidden");
      canvasTooltip.style.left = `${Math.min(lifeCanvas.clientWidth - 160, mouseX + 12)}px`;
      canvasTooltip.style.top = `${mouseY - 45}px`;
      
      const formatted = dotDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      canvasTooltip.innerHTML = `
        <div style="font-weight:600;">${formatted}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">Day ${dayOfLife.toLocaleString()} of life</div>
        <div style="font-size:10px;color:var(--accent);margin-top:2px;">Age ${yearIndex} • ${isToday ? "Today" : isLived ? "Completed" : "Possible future"}</div>
      `;
      return;
    }
  }
  canvasTooltip.classList.add("hidden");
}

function handleCanvasMouseLeave() {
  canvasTooltip.classList.add("hidden");
}

// Window resize redraw for canvas
window.addEventListener("resize", () => {
  if (userProfile && userPreferences.selectedUnit === "Days" && daysViewMode === "overview" && !lifeCanvas.classList.contains("hidden")) {
    drawDaysCanvas();
  }
});

// Run
document.addEventListener("DOMContentLoaded", init);
