import React from "react";
import { LifeCalculations } from "@/lib/life-in-dots/calculations";
import { UserProfile } from "@/lib/life-in-dots/types";

interface ShareCardButtonProps {
  profile: UserProfile;
  calcs: LifeCalculations;
  date: Date;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export default function ShareCardButton({
  profile,
  calcs,
  date,
}: ShareCardButtonProps) {
  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    const width = 1200;
    const height = 630;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#1F1F1F";
    ctx.lineWidth = 1;
    drawRoundRect(ctx, 56, 56, width - 112, height - 112, 24);
    ctx.stroke();

    ctx.fillStyle = "#7F7F7F";
    ctx.font = "500 18px monospace";
    ctx.fillText("LIFE IN DOTS", 96, 112);

    ctx.fillStyle = "#EAEAEA";
    ctx.font = "300 54px sans-serif";
    const headline = profile.name
      ? `${profile.name}'s day ${calcs.todayLivedIndex.toLocaleString()}`
      : `Day ${calcs.todayLivedIndex.toLocaleString()}`;
    ctx.fillText(headline, 96, 190);

    ctx.fillStyle = "#9A9A9A";
    ctx.font = "300 26px sans-serif";
    ctx.fillText(
      date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      96,
      235
    );

    const dotSize = 9;
    const gap = 7;
    const startX = 96;
    const startY = 310;
    const cols = 52;
    const totalDots = 260;
    const livedRatio = Math.min(1, calcs.percentageLivedOfTimeline / 100);
    const livedDots = Math.round(totalDots * livedRatio);

    for (let i = 0; i < totalDots; i += 1) {
      const x = startX + (i % cols) * (dotSize + gap);
      const y = startY + Math.floor(i / cols) * (dotSize + gap);
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
      if (i < livedDots) {
        ctx.fillStyle = "#EAEAEA";
        ctx.fill();
      } else if (i === livedDots) {
        ctx.fillStyle = "#2CFF05";
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(234, 234, 234, 0.28)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#EAEAEA";
    ctx.font = "300 34px sans-serif";
    ctx.fillText(`${calcs.daysLived.toLocaleString()} days lived`, 96, 485);

    ctx.fillStyle = "#2CFF05";
    ctx.font = "300 34px sans-serif";
    ctx.fillText(`~${calcs.daysAheadInTimeline.toLocaleString()} days ahead`, 600, 485);

    ctx.fillStyle = "#7F7F7F";
    ctx.font = "500 16px monospace";
    ctx.fillText("nimaaksoy.com/life-in-dots", 870, 560);

    const link = document.createElement("a");
    link.download = "life-in-dots-share-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center rounded-full border border-[#1F1F1F] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.12em] text-[#7F7F7F] transition-all hover:border-[#2CFF05]/50 hover:text-[#2CFF05] focus:outline-none focus:ring-1 focus:ring-[#2CFF05]/60"
    >
      Download share card
    </button>
  );
}
