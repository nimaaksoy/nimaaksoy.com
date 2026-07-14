import React, { useState, useEffect, useMemo } from "react";
import { loadIntentions, saveIntentions } from "@/lib/life-in-dots/storage";
import { IconTrash, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

function getLocalDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DailyIntention() {
  const [intentions, setIntentions] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Get stable today key YYYY-MM-DD
  const [todayKey, setTodayKey] = useState(() => getLocalDateKey(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTodayKey(getLocalDateKey(new Date()));
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  // Load intentions on mount
  useEffect(() => {
    const loaded = loadIntentions();
    setIntentions(loaded);
    if (loaded[todayKey]) {
      setInputText(loaded[todayKey]);
    }
  }, [todayKey]);

  const todayIntention = intentions[todayKey] || "";

  const handleSave = () => {
    const trimmed = inputText.trim().slice(0, 160);
    const updated = { ...intentions };
    
    if (trimmed) {
      updated[todayKey] = trimmed;
    } else {
      delete updated[todayKey];
    }

    setIntentions(updated);
    saveIntentions(updated);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setInputText(todayIntention);
      setIsEditing(false);
    }
  };

  const handleDelete = (key: string) => {
    const updated = { ...intentions };
    delete updated[key];
    setIntentions(updated);
    saveIntentions(updated);
    if (key === todayKey) {
      setInputText("");
    }
  };

  // Filter history (exclude today)
  const historyEntries = useMemo(() => {
    return Object.entries(intentions)
      .filter(([key]) => key !== todayKey)
      .sort((a, b) => b[0].localeCompare(a[0])); // descending order
  }, [intentions, todayKey]);

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] space-y-4">
      <div className="flex flex-col items-start max-w-[640px]">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Daily Intention
        </span>
        <h3 className="mt-2 font-monroe text-[18px] text-[#EAEAEA] font-normal">
          What would make today count?
        </h3>

        {/* Input/Display area */}
        <div className="mt-3 w-full">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 160))}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder="It does not need to be big."
                className="w-full min-h-[60px] bg-[#111111] border border-[#2CFF05] text-[#EAEAEA] font-monroe text-[15px] p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2CFF05] resize-none"
                autoFocus
              />
              <div className="flex justify-between items-center text-[11px] font-jetbrains text-[#7F7F7F]">
                <span>{inputText.length} / 160 characters</span>
                <span>Press Enter to save, Esc to cancel</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full text-left p-4 rounded-lg bg-[#111111] border border-[#1F1F1F] hover:border-[#2CFF05]/40 hover:bg-[#151515] transition-all group"
            >
              {todayIntention ? (
                <span className="font-monroe text-[15px] text-[#EAEAEA]">
                  {todayIntention}
                </span>
              ) : (
                <span className="font-monroe text-[14px] text-[#7F7F7F] italic group-hover:text-[#9A9A9A]">
                  Click to write one small thing
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Optional Past Days History */}
      {historyEntries.length > 0 && (
        <div className="space-y-2 max-w-[640px]">
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="flex items-center gap-1.5 font-jetbrains text-[11px] uppercase tracking-[0.08em] text-[#7F7F7F] hover:text-[#EAEAEA] transition-colors"
          >
            <span>Past Days Intentions</span>
            {showHistory ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
          </button>

          {showHistory && (
            <div className="space-y-2 mt-2 bg-[#111111]/30 border border-[#1F1F1F]/40 p-4 rounded-xl max-h-[200px] overflow-y-auto">
              {historyEntries.map(([dateKey, text]) => {
                const dateObj = new Date(dateKey + "T00:00:00");
                const formatted = dateObj.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <div key={dateKey} className="flex justify-between items-start gap-4 py-1.5 border-b border-[#1F1F1F]/30 last:border-b-0">
                    <div className="font-monroe text-[13px] text-[#9A9A9A]">
                      <span className="font-jetbrains text-[10px] text-[#7F7F7F] mr-3">{formatted}</span>
                      {text}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(dateKey)}
                      aria-label={`Delete intention for ${formatted}`}
                      className="text-[#7F7F7F] hover:text-red-400 transition-colors self-center p-1"
                    >
                      <IconTrash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
