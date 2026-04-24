"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.2,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-[#2CFF05]/80"
      style={{ scaleX }}
    />
  );
}
