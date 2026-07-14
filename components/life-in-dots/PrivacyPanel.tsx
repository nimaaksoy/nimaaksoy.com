import React, { useState } from "react";
import { clearAllLifeInDotsData } from "@/lib/life-in-dots/storage";

interface PrivacyPanelProps {
  onReset: () => void;
}

export default function PrivacyPanel({ onReset }: PrivacyPanelProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleConfirmReset = () => {
    clearAllLifeInDotsData();
    setShowConfirm(false);
    onReset();
  };

  return (
    <div className="w-full py-8 border-b border-[#1F1F1F] space-y-6">
      <div className="flex flex-col">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#7F7F7F]">
          Security
        </span>
        <h3 className="mt-2 font-monroe text-[18px] text-[#EAEAEA] font-normal">
          Private by design
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 font-monroe text-[14px] text-[#9A9A9A] leading-relaxed">
          <p>
            Your birthday, name, settings, and daily intentions stay inside your browser. Life in Dots does not require an account and does not send this information to any server.
          </p>
          <p className="text-[12px] text-[#7F7F7F] italic">
            Your birthday, name and notes stay in this browser. Nothing is sent to a server.
          </p>
        </div>

        <div className="space-y-4">
          <ul className="space-y-1.5 font-jetbrains text-[12px] text-[#9A9A9A] list-disc list-inside">
            <li>No account required</li>
            <li>No databases or remote logs</li>
            <li>No personal data upload</li>
            <li>Clear local reset controls</li>
          </ul>

          <div className="pt-2">
            {showConfirm ? (
              <div className="space-y-3 p-4 rounded-xl border border-red-500/20 bg-red-950/10">
                <p className="font-monroe text-[13px] text-[#EAEAEA]">
                  Are you sure? This will permanently delete your profile, calculations, and daily intentions from this device.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-jetbrains text-[11px] uppercase tracking-[0.08em] transition-colors"
                  >
                    Yes, Forget my data
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#9A9A9A] rounded-lg font-jetbrains text-[11px] uppercase tracking-[0.08em] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResetClick}
                className="px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/5 text-red-500 hover:text-red-400 rounded-lg font-jetbrains text-[11px] uppercase tracking-[0.08em] transition-all"
              >
                Forget my data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
