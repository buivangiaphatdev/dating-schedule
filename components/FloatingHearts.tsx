"use client";

import { motion } from "framer-motion";

/**
 * Subtle hearts/petals drifting up behind the card.
 * The positions are a hard-coded table rather than Math.random() so the server
 * and client render the same markup (no hydration mismatch).
 */
const PARTICLES = [
  { left: "6%", size: 18, delay: 0, duration: 17, drift: 26, glyph: "♥" },
  { left: "17%", size: 12, delay: 3.4, duration: 21, drift: -18, glyph: "❀" },
  { left: "28%", size: 22, delay: 7.1, duration: 19, drift: 34, glyph: "♥" },
  { left: "39%", size: 14, delay: 1.8, duration: 24, drift: -28, glyph: "♥" },
  { left: "52%", size: 19, delay: 9.6, duration: 18, drift: 20, glyph: "❀" },
  { left: "63%", size: 13, delay: 5.2, duration: 22, drift: -34, glyph: "♥" },
  { left: "74%", size: 24, delay: 11.4, duration: 20, drift: 16, glyph: "♥" },
  { left: "85%", size: 15, delay: 2.6, duration: 23, drift: -22, glyph: "❀" },
  { left: "94%", size: 17, delay: 8.2, duration: 19, drift: 30, glyph: "♥" },
];

export function FloatingHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute bottom-[-8%] text-wine/22 select-none"
          style={{ left: particle.left, fontSize: particle.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "-118vh"],
            x: [0, particle.drift, 0],
            opacity: [0, 1, 1, 0],
            rotate: [0, particle.drift > 0 ? 24 : -24],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {particle.glyph}
        </motion.span>
      ))}
    </div>
  );
}
