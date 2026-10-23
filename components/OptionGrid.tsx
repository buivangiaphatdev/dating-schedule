"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

import { CUSTOM_TEXT_MAX, type MenuOption } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * 2-column grid of multi-select cards, shared by the food and activity steps.
 * Picking the write-your-own card opens a text box under the grid.
 * Rows size to their own content, so the long write-in note only stretches its row.
 */
export function OptionGrid({
  options,
  selectedIds,
  onToggle,
  customText,
  onCustomTextChange,
  customPlaceholder,
}: {
  options: MenuOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  customPlaceholder: string;
}) {
  const customOption = options.find((option) => option.custom);
  const showCustomInput =
    customOption !== undefined && selectedIds.includes(customOption.id);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => {
          const isSelected = selectedIds.includes(option.id);
          return (
            <motion.button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.28 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative flex flex-col items-start gap-1 rounded-3xl border-2 p-4 text-left transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-wine/45 focus-visible:ring-offset-2 focus-visible:outline-none",
                isSelected
                  ? "border-wine bg-wine-tint"
                  : option.custom
                    ? "border-dashed border-ink/20 bg-white hover:border-wine/35 hover:bg-cream"
                    : "border-ink/8 bg-white hover:border-wine/35 hover:bg-cream",
              )}
            >
              <span className="text-2xl leading-none">{option.emoji}</span>
              <span className="mt-1 text-sm font-semibold text-ink">
                {option.label}
              </span>
              <span
                className={cn(
                  "text-[11px] leading-snug transition-colors",
                  isSelected ? "text-wine-dark" : "text-ink-faint",
                )}
              >
                {option.note}
              </span>

              {/* Check badge in the corner of a selected card. */}
              {isSelected && (
                <motion.span
                  layoutId={`check-${option.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 18,
                  }}
                  className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-wine text-white shadow-pill"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <label className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] font-medium tracking-[0.14em] text-ink-faint uppercase">
                {customOption.label}
              </span>
              <textarea
                autoFocus
                rows={2}
                maxLength={CUSTOM_TEXT_MAX}
                value={customText}
                onChange={(event) => onCustomTextChange(event.target.value)}
                placeholder={customPlaceholder}
                className="w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-wine focus:outline-none"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
