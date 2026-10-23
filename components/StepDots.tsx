"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Progress indicator for the "real" steps of the flow.
 * The rejection screen is a detour, so it reuses step 1's position.
 */
export function StepDots({
  current,
  total,
  label,
  className,
}: {
  /** 1-based index of the active step. */
  current: number;
  total: number;
  /** Accessible name, e.g. "Step 2 of 5" — passed in so it can be translated. */
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={label}
    >
      <span className="mr-1 text-[11px] font-medium tracking-[0.14em] text-ink-faint uppercase tabular-nums">
        {current}/{total}
      </span>
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <motion.span
            key={step}
            layout
            className={cn(
              "h-1.5 rounded-full transition-colors duration-300",
              isActive
                ? "w-5 bg-wine"
                : isDone
                  ? "w-1.5 bg-wine/45"
                  : "w-1.5 bg-ink/12",
            )}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        );
      })}
    </div>
  );
}
