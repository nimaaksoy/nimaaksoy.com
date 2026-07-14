/**
 * Parses a date string in YYYY-MM-DD format safely in local timezone at midnight.
 */
export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Gets the birthday date in a target year.
 * If born on Feb 29, the birthday is observed on March 1 in non-leap years.
 */
export function getBirthdayInYear(birthDate: Date, year: number): Date {
  const bMonth = birthDate.getMonth();
  const bDate = birthDate.getDate();
  if (bMonth === 1 && bDate === 29 && !isLeapYear(year)) {
    // February 29 observed on March 1st in non-leap years
    return new Date(year, 2, 1, 0, 0, 0, 0);
  }
  return new Date(year, bMonth, bDate, 0, 0, 0, 0);
}

/**
 * Calculates full age of a person in years.
 */
export function calculateAge(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculates calendar days between start and end dates.
 * Handles daylight saving transitions correctly.
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
  const s = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const e = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffTime = e - s;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates the next birthday.
 */
export function getNextBirthday(birthDate: Date, today: Date): Date {
  const currentYear = today.getFullYear();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  );
  let nextBday = getBirthdayInYear(birthDate, currentYear);
  
  if (nextBday < todayDateOnly) {
    nextBday = getBirthdayInYear(birthDate, currentYear + 1);
  }
  return nextBday;
}

/**
 * Calculates details for the next 1,000-day milestone.
 */
export function getNextMilestone(daysLived: number): { milestone: number; daysUntil: number } {
  const step = 1000;
  // If daysLived is 15000, we find 16000. If 15001, we find 16000.
  const nextMilestone = Math.floor(daysLived / step) * step + step;
  const daysUntil = nextMilestone - daysLived;
  return { milestone: nextMilestone, daysUntil };
}

/**
 * Calculates the date of a specific day of life (1-indexed).
 * Day 1 is the birthdate.
 */
export function getDateOfLifeDay(birthDate: Date, dayIndex: number): Date {
  const d = new Date(birthDate);
  d.setDate(d.getDate() + dayIndex - 1);
  return d;
}

/**
 * Fully packs all calculations needed for Life in Dots.
 */
export interface LifeCalculations {
  daysLived: number;
  todayLivedIndex: number;
  nextBirthdayDate: Date;
  daysToNextBirthday: number;
  ageYears: number;
  monthsLived: number;
  hoursLived: number;
  
  totalDaysInTimeline: number;
  daysAheadInTimeline: number;
  percentageLivedOfTimeline: number;
  targetBirthday: Date;
  
  // Interesting stats
  birthdaysCelebrated: number;
  seasonsExperienced: number;
  weekendsExperienced: number;
  sunrisesHappened: number;
  newYearsExperienced: number;
  
  // Future expectations
  possibleWeekendsAhead: number;
  possibleBirthdaysAhead: number;
  possibleSeasonsAhead: number;
  
  // Milestones
  nextMilestone: number;
  daysToNextMilestone: number;
  nextMilestoneDate: Date;
}

export function performLifeCalculations(
  birthDate: Date,
  today: Date,
  targetAge: number
): LifeCalculations {
  const daysLived = getDaysBetween(birthDate, today) + 1; // including today as day 1
  const todayLivedIndex = daysLived;
  const ageYears = calculateAge(birthDate, today);
  
  // Calculate months lived:
  // Approximate month count. Let's do month-level difference:
  let monthsLived = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) {
    monthsLived = Math.max(0, monthsLived - 1);
  }
  
  // Hours lived: we calculate standard hours since birth date at midnight to today at current time
  const msDiff = today.getTime() - birthDate.getTime();
  const hoursLived = Math.floor(msDiff / (1000 * 60 * 60));
  
  // Target birthday
  const targetBirthday = getBirthdayInYear(birthDate, birthDate.getFullYear() + targetAge);
  
  // If target birthday is in the past (user is older than target age)
  const actualTargetBirthday = targetBirthday;
  
  const totalDaysInTimeline = getDaysBetween(birthDate, actualTargetBirthday);
  const daysAheadInTimeline = Math.max(0, totalDaysInTimeline - daysLived);
  const percentageLivedOfTimeline = Math.min(100, Math.max(0, (daysLived / totalDaysInTimeline) * 100));
  
  // Next Birthday
  const nextBirthdayDate = getNextBirthday(birthDate, today);
  const daysToNextBirthday = getDaysBetween(today, nextBirthdayDate);
  
  // Celebrated birthdays: matches age in years, plus birth itself? No, birthdays celebrated is just age in years
  const birthdaysCelebrated = ageYears;
  
  // Seasons: 4 seasons per year. We can approximate seasons experienced as:
  // ageYears * 4 + seasons in current year. Or just days / 91.25. Let's use (daysLived / 91.25) or a stable formula.
  const seasonsExperienced = Math.floor(daysLived / 91.25);
  
  // Weekends: Saturday and Sunday. In daysLived, how many Saturdays and Sundays?
  // 2 / 7 of days lived.
  const weekendsExperienced = Math.floor((daysLived / 7) * 2);
  
  // Sunrises: 1 sunrise per day lived
  const sunrisesHappened = daysLived;
  
  // New Years experienced: number of Jan 1sts between birthday and today
  let newYears = today.getFullYear() - birthDate.getFullYear();
  // if birthday was in Jan 1, or today has already passed Jan 1
  // Simple check: how many Jan 1st dates fell in this range
  if (birthDate.getMonth() === 0 && birthDate.getDate() === 1) {
    newYears++; // counted birth new year
  }
  const newYearsExperienced = Math.max(0, newYears);
  
  // Future approximations
  const possibleBirthdaysAhead = Math.max(0, targetAge - ageYears);
  const possibleWeekendsAhead = Math.floor((daysAheadInTimeline / 7) * 2);
  const possibleSeasonsAhead = Math.floor(daysAheadInTimeline / 91.25);
  
  // Milestones
  const { milestone, daysUntil } = getNextMilestone(daysLived);
  const nextMilestoneDate = getDateOfLifeDay(birthDate, milestone);
  
  return {
    daysLived,
    todayLivedIndex,
    nextBirthdayDate,
    daysToNextBirthday,
    ageYears,
    monthsLived,
    hoursLived,
    totalDaysInTimeline,
    daysAheadInTimeline,
    percentageLivedOfTimeline,
    targetBirthday: actualTargetBirthday,
    birthdaysCelebrated,
    seasonsExperienced,
    weekendsExperienced,
    sunrisesHappened,
    newYearsExperienced,
    possibleWeekendsAhead,
    possibleBirthdaysAhead,
    possibleSeasonsAhead,
    nextMilestone: milestone,
    daysToNextMilestone: daysUntil,
    nextMilestoneDate,
  };
}
