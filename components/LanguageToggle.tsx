"use client";

import { useLocale } from "@/components/LocaleProvider";
import { LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Small VI | EN segmented switch. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.flow.languageLabel}
      className={cn(
        "inline-flex rounded-full border border-ink/12 bg-white p-0.5",
        className,
      )}
    >
      {LOCALES.map((option) => {
        const isActive = option === locale;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLocale(option)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors",
              "focus-visible:ring-2 focus-visible:ring-wine/40 focus-visible:outline-none",
              isActive ? "bg-ink text-white" : "text-ink-soft hover:text-ink",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
