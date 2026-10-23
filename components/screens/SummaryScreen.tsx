"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarHeart,
  Check,
  Copy,
  Loader2,
  Mail,
  RotateCcw,
  Sparkles,
  Utensils,
} from "lucide-react";

import { useLocale } from "@/components/LocaleProvider";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildPlanText,
  formatActivities,
  formatFood,
  formatWhen,
  type DatePlan,
  type SendStatus,
} from "@/lib/plan";

export function SummaryScreen({
  plan,
  sendStatus,
  onRetrySend,
  onRestart,
}: {
  plan: DatePlan;
  sendStatus: SendStatus;
  onRetrySend: () => void;
  onRestart: () => void;
}) {
  const { locale, t } = useLocale();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending "Copied!" reset if the screen unmounts first.
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    const text = buildPlanText(plan, locale);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older/locked-down browsers (and non-HTTPS origins) reject the async
      // clipboard API — fall back to a throwaway textarea + execCommand.
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="smitten" className="mx-auto" />

        {/* Handwritten-feeling note above the summary. */}
        <p className="font-display text-[15px] italic text-ink-soft">
          {t.summary.note}
        </p>

        <CardTitle className="text-[clamp(1.55rem,7.2vw,2rem)]">
          {t.summary.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-6 gap-5">
        <div className="overflow-hidden rounded-3xl border border-ink/8 bg-cream">
          <SummaryRow
            icon={<CalendarHeart className="size-4 text-wine" />}
            label={t.summary.when}
            value={formatWhen(plan, locale)}
          />
          <div className="h-px bg-ink/8" />
          <SummaryRow
            icon={<Utensils className="size-4 text-wine" />}
            label={t.summary.food}
            value={formatFood(plan, locale)}
            hint={
              plan.foodIds.length > 1
                ? t.summary.foodManyHint
                : undefined
            }
          />
          <div className="h-px bg-ink/8" />
          <SummaryRow
            icon={<Sparkles className="size-4 text-wine" />}
            label={t.summary.after}
            value={formatActivities(plan, locale)}
            hint={
              plan.activityIds.length > 1
                ? t.summary.afterManyHint
                : undefined
            }
          />
        </div>

        <SendNotice status={sendStatus} onRetry={onRetrySend} />

        <div className="flex flex-col gap-2">
          <Button size="lg" className="w-full text-[17px]" onClick={handleCopy}>
            {copied ? (
              <Check className="size-4" strokeWidth={3} />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? t.summary.copied : t.summary.copy}
          </Button>

          {/* The toast sits on a reserved row in normal flow, so it can never
              cover the summary above it and never shifts the buttons.
              The live region has to exist before the toast is inserted for
              screen readers to announce it. */}
          <div
            className="flex h-8 items-center justify-center"
            aria-live="polite"
          >
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.94 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-card"
                >
                  {t.summary.copiedToast}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mx-auto"
            onClick={onRestart}
          >
            <RotateCcw className="size-3.5" />
            {t.summary.restart}
          </Button>
        </div>
      </CardContent>
    </>
  );
}

/** One quiet line telling my date the plan has (or hasn't) reached my inbox. */
function SendNotice({
  status,
  onRetry,
}: {
  status: SendStatus;
  onRetry: () => void;
}) {
  const { t } = useLocale();
  if (status === "idle") return null;

  return (
    <p
      className="flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft"
      aria-live="polite"
    >
      {status === "sending" && (
        <>
          <Loader2 className="size-3.5 animate-spin text-wine" />
          {t.summary.sending}
        </>
      )}
      {status === "sent" && (
        <>
          <Mail className="size-3.5 text-wine" />
          {t.summary.sent}
        </>
      )}
      {status === "error" && (
        <>
          {t.summary.sendError}
          <button
            type="button"
            onClick={onRetry}
            className="font-medium text-wine underline underline-offset-4"
          >
            {t.summary.retry}
          </button>
        </>
      )}
    </p>
  );
}

/** One WHEN/FOOD/AFTER line in the summary block. */
function SummaryRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-wine-tint">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-[0.14em] text-ink-faint uppercase">
          {label}
        </p>
        <p className="font-display text-[17px] leading-snug font-semibold text-pretty text-ink">
          {value}
        </p>
        {hint && <p className="mt-0.5 text-xs text-ink-soft">{hint}</p>}
      </div>
    </div>
  );
}
