import React, { useEffect, useState } from "react";
import { getDailyMessageForDate } from "@/lib/life-in-dots/messages";

function getLocalDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DailyMessage() {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDateKey(getLocalDateKey(new Date()));
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const message = getDailyMessageForDate(new Date(`${dateKey}T00:00:00`));

  return (
    <div className="w-full py-6 border-b border-[#1F1F1F]">
      <div className="max-w-[640px]">
        <p className="font-monroe text-[18px] md:text-[22px] italic font-light text-[#EAEAEA] leading-relaxed">
          &ldquo;{message}&rdquo;
        </p>
      </div>
    </div>
  );
}
