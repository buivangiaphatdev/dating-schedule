"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type MascotMood = "hopeful" | "sad" | "planning" | "hungry" | "smitten";

/**
 * The little haloed bird that sits above every headline.
 * One SVG, five expressions — the mood drives the eyes, the blush and the
 * small prop it's holding, so it reads as the same character throughout.
 */
export function Mascot({
  mood = "hopeful",
  className,
}: {
  mood?: MascotMood;
  className?: string;
}) {
  const isSad = mood === "sad";

  return (
    <motion.div
      className={cn("relative size-20 shrink-0", className)}
      initial={{ scale: 0.7, opacity: 0, rotate: isSad ? 6 : -6 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      {/* Idle bob: a slow float when happy, a nervous shiver when rejected. */}
      <motion.div
        animate={
          isSad
            ? { x: [0, -1.5, 1.5, -1.5, 0], y: [0, 1, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: isSad ? 0.45 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 96 96" className="size-20" aria-hidden="true">
          {/* Halo */}
          <ellipse
            cx="48"
            cy="17"
            rx="14"
            ry="4.5"
            fill="none"
            stroke="var(--color-olive)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={isSad ? 0.4 : 0.9}
          />

          {/* Wings, tucked behind the body but wide enough to actually read */}
          <ellipse
            cx="17"
            cy="59"
            rx="10"
            ry="14"
            fill="var(--color-cream-deep)"
            stroke="var(--color-wine)"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            transform={isSad ? "rotate(26 17 59)" : "rotate(-18 17 59)"}
          />
          <ellipse
            cx="79"
            cy="59"
            rx="10"
            ry="14"
            fill="var(--color-cream-deep)"
            stroke="var(--color-wine)"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            transform={isSad ? "rotate(-26 79 59)" : "rotate(18 79 59)"}
          />

          {/* Body */}
          <ellipse
            cx="48"
            cy="56"
            rx="27"
            ry="25"
            fill="#fffaf3"
            stroke="var(--color-wine)"
            strokeOpacity="0.18"
            strokeWidth="2"
          />

          {/* Cheeks */}
          <ellipse
            cx="33"
            cy="60"
            rx="5"
            ry="3.2"
            fill="var(--color-wine)"
            opacity="0.22"
          />
          <ellipse
            cx="63"
            cy="60"
            rx="5"
            ry="3.2"
            fill="var(--color-wine)"
            opacity="0.22"
          />

          {/* Eyes */}
          {mood === "smitten" ? (
            <>
              <Heart x={34} y={48} scale={0.42} />
              <Heart x={56} y={48} scale={0.42} />
            </>
          ) : isSad ? (
            <>
              {/* Worried upward arcs */}
              <path
                d="M32 51c2-3.4 6.4-3.4 8.4 0"
                stroke="var(--color-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M55.6 51c2-3.4 6.4-3.4 8.4 0"
                stroke="var(--color-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === "hungry" ? (
            <>
              {/* Squinty "food is coming" eyes */}
              <path
                d="M32 49c2 2.6 6.4 2.6 8.4 0"
                stroke="var(--color-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M55.6 49c2 2.6 6.4 2.6 8.4 0"
                stroke="var(--color-ink)"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <circle cx="37" cy="49" r="2.9" fill="var(--color-ink)" />
              <circle cx="59" cy="49" r="2.9" fill="var(--color-ink)" />
            </>
          )}

          {/* Beak / mouth */}
          {isSad ? (
            <path
              d="M43 65c2.6-2.6 7.4-2.6 10 0"
              stroke="var(--color-olive-dark)"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M44 62h8l-4 5.5z"
              fill="var(--color-olive)"
              stroke="var(--color-olive-dark)"
              strokeWidth="0.8"
            />
          )}

          {/* Feet */}
          <path
            d="M40 80v3M56 80v3"
            stroke="var(--color-olive-dark)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Mood-specific prop, tucked into the top-right corner. */}
      <MascotProp mood={mood} />
    </motion.div>
  );
}

/** Small filled heart used for the smitten eyes. */
function Heart({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <path
      d="M0 4.2C-6 -0.6 -4 -6 0 -4 4 -6 6 -0.6 0 4.2z"
      fill="var(--color-wine)"
      transform={`translate(${x} ${y}) scale(${scale * 2})`}
    />
  );
}

/** The tiny object the mascot is holding for each step. */
function MascotProp({ mood }: { mood: MascotMood }) {
  const prop: Record<MascotMood, string | null> = {
    hopeful: "💌",
    sad: "💔",
    planning: "🗓️",
    hungry: "🍴",
    smitten: "✨",
  };

  const glyph = prop[mood];
  if (!glyph) return null;

  return (
    <motion.span
      key={mood}
      className="absolute -right-3 -bottom-1 grid size-8 place-items-center rounded-full border-2 border-white bg-cream text-base shadow-[0_6px_14px_-6px_rgb(43_37_33_/_0.35)]"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: mood === "sad" ? -8 : 0 }}
      transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 14 }}
    >
      {glyph}
    </motion.span>
  );
}
