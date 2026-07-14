export const DAILY_MESSAGES: string[] = [
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

/**
 * Returns a message from the list of messages deterministically.
 * The message will remain the same throughout that local calendar day.
 */
export function getDailyMessageForDate(date: Date): string {
  // Use local date string YYYY-MM-DD to create a stable hash
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  
  // Simple hash function for the date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}
