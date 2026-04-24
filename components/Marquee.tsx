"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
  className?: string;
  duration?: number;
}

export default function Marquee({
  text,
  className = "",
  duration = 38,
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex min-w-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
      </motion.div>
    </div>
  );
}
