import {
  calculateAge,
  getBirthdayInYear,
  getDaysBetween,
  getNextBirthday,
  getNextMilestone,
  isLeapYear,
  parseDateOnly,
} from "../lib/life-in-dots/calculations";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runTests() {
  console.log("Starting Life in Dots calculation tests...");

  // 1. Test leap year detection
  assert(isLeapYear(2000) === true, "2000 is a leap year");
  assert(isLeapYear(2024) === true, "2024 is a leap year");
  assert(isLeapYear(2100) === false, "2100 is not a leap year");
  assert(isLeapYear(2026) === false, "2026 is not a leap year");
  console.log("✓ Leap year detection passed");

  // 2. Test parseDateOnly
  const d1 = parseDateOnly("1990-05-15");
  assert(d1.getFullYear() === 1990, "Year should be 1990");
  assert(d1.getMonth() === 4, "Month should be 4 (May)");
  assert(d1.getDate() === 15, "Date should be 15");
  console.log("✓ parseDateOnly passed");

  // 3. Test age calculation (before vs after birthday)
  const bday = parseDateOnly("1990-05-15");
  // Before birthday
  const todayBefore = parseDateOnly("2026-05-14");
  assert(calculateAge(bday, todayBefore) === 35, "Age before birthday should be 35");
  // On birthday
  const todayOn = parseDateOnly("2026-05-15");
  assert(calculateAge(bday, todayOn) === 36, "Age on birthday should be 36");
  // After birthday
  const todayAfter = parseDateOnly("2026-05-16");
  assert(calculateAge(bday, todayAfter) === 36, "Age after birthday should be 36");
  console.log("✓ Age calculation passed");

  // 4. Test Feb 29 birthday observation in non-leap years
  const feb29Bday = parseDateOnly("2000-02-29");
  // In a leap year (2024)
  const bday2024 = getBirthdayInYear(feb29Bday, 2024);
  assert(bday2024.getMonth() === 1 && bday2024.getDate() === 29, "Should be Feb 29 in leap year 2024");
  // In a non-leap year (2026)
  const bday2026 = getBirthdayInYear(feb29Bday, 2026);
  assert(bday2026.getMonth() === 2 && bday2026.getDate() === 1, "Should observe on March 1st in non-leap year 2026");
  console.log("✓ Leap year birthday observation passed");

  // 5. Test next birthday
  const todayJune = parseDateOnly("2026-06-15");
  const nextBday = getNextBirthday(bday, todayJune);
  assert(nextBday.getFullYear() === 2027 && nextBday.getMonth() === 4 && nextBday.getDate() === 15, "Next birthday should be May 15, 2027");

  const todayApril = parseDateOnly("2026-04-15");
  const nextBdayBefore = getNextBirthday(bday, todayApril);
  assert(nextBdayBefore.getFullYear() === 2026 && nextBdayBefore.getMonth() === 4 && nextBdayBefore.getDate() === 15, "Next birthday should be May 15, 2026");

  const nextBdayToday = getNextBirthday(bday, todayOn);
  assert(nextBdayToday.getFullYear() === 2026 && nextBdayToday.getMonth() === 4 && nextBdayToday.getDate() === 15, "Next birthday should be today when today is the birthday");
  console.log("✓ Next birthday calculation passed");

  // 6. Test days lived calculations
  const startDay = parseDateOnly("2020-01-01");
  const endDay = parseDateOnly("2021-01-01"); // spans a leap year (2020)
  const daysBetween = getDaysBetween(startDay, endDay);
  assert(daysBetween === 366, "Span across 2020 leap year should be 366 days");
  console.log("✓ Calendar days between calculation passed");

  // 7. Test next milestones
  const { milestone, daysUntil } = getNextMilestone(9950);
  assert(milestone === 10000, "Next milestone should be 10000");
  assert(daysUntil === 50, "Days until should be 50");
  console.log("✓ Milestone calculation passed");

  console.log("All calculations verified successfully! ✓");
}

runTests();
