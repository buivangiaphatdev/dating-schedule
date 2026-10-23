"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

import { sendPlanEmail } from "@/app/actions";
import { FloatingHearts } from "@/components/FloatingHearts";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";
import { StepDots } from "@/components/StepDots";
import { ActivityScreen } from "@/components/screens/ActivityScreen";
import { FoodScreen } from "@/components/screens/FoodScreen";
import { InviteScreen } from "@/components/screens/InviteScreen";
import { RejectionScreen } from "@/components/screens/RejectionScreen";
import { ScheduleScreen } from "@/components/screens/ScheduleScreen";
import { SummaryScreen } from "@/components/screens/SummaryScreen";
import { Card } from "@/components/ui/card";
import type { SendStatus } from "@/lib/plan";

/**
 * 1 invite · 2 playful rejection · 3 schedule ·
 * 4 food (part 1) · 5 after-dinner activity (part 2) · 6 summary
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6;

/** Step 2 is a detour, so it shares step 1's slot in the progress indicator. */
const PROGRESS_INDEX: Record<Step, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};
const TOTAL_PROGRESS_STEPS = 5;

/** Where the footer "back" link leads from each middle step. */
const BACK_LINKS: Partial<
  Record<Step, { to: Step; label: "startOver" | "backToCalendar" | "backToFood" }>
> = {
  3: { to: 1, label: "startOver" },
  4: { to: 3, label: "backToCalendar" },
  5: { to: 4, label: "backToFood" },
};

/** Add the id if it's missing, remove it if it's there. */
function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export function DateInviteFlow() {
  // All flow state lives here and is passed down to the screens as props.
  const { locale, t } = useLocale();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [saidYes, setSaidYes] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [foodIds, setFoodIds] = useState<string[]>([]);
  const [activityIds, setActivityIds] = useState<string[]>([]);
  const [foodCustom, setFoodCustom] = useState("");
  const [activityCustom, setActivityCustom] = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");

  /** Email the finished plan to me. Fired once when the summary opens. */
  const sendPlan = useCallback(async () => {
    setSendStatus("sending");
    try {
      const result = await sendPlanEmail({
        date: date ? format(date, "yyyy-MM-dd") : null,
        timeSlotId,
        foodIds,
        foodCustom,
        activityIds,
        activityCustom,
        locale,
      });
      setSendStatus(result.ok ? "sent" : "error");
    } catch {
      setSendStatus("error");
    }
  }, [
    date,
    timeSlotId,
    foodIds,
    foodCustom,
    activityIds,
    activityCustom,
    locale,
  ]);

  /** Move to a step, remembering which way the cards should slide. */
  const goTo = useCallback(
    (next: Step, slideDirection: 1 | -1 = 1) => {
      setDirection(slideDirection);
      setStep(next);
    },
    [],
  );

  const handleYes = useCallback(() => {
    setSaidYes(true);
    goTo(3);
  }, [goTo]);

  const handleNo = useCallback(() => {
    setSaidYes(false);
    goTo(2);
  }, [goTo]);

  /** "okay okay" on the rejection screen — treated as a yes, straight to step 3. */
  const handleReconsider = useCallback(() => {
    setSaidYes(true);
    goTo(3);
  }, [goTo]);

  const toggleFood = useCallback((id: string) => {
    setFoodIds((current) => toggleId(current, id));
  }, []);

  const toggleActivity = useCallback((id: string) => {
    setActivityIds((current) => toggleId(current, id));
  }, []);

  const handleRestart = useCallback(() => {
    setSaidYes(false);
    setDate(undefined);
    setTimeSlotId(null);
    setFoodIds([]);
    setActivityIds([]);
    setFoodCustom("");
    setActivityCustom("");
    setSendStatus("idle");
    goTo(1, -1);
  }, [goTo]);

  const backLink = BACK_LINKS[step];

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-cream px-4 py-10">
      <FloatingHearts />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-3 flex justify-end px-2">
          <LanguageToggle />
        </div>

        {/* Progress indicator sits just above the card. */}
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="font-display text-sm font-semibold text-ink-soft">
            {t.flow.brand}
          </span>
          <StepDots
            current={PROGRESS_INDEX[step]}
            total={TOTAL_PROGRESS_STEPS}
            label={t.flow.stepLabel(PROGRESS_INDEX[step], TOTAL_PROGRESS_STEPS)}
          />
        </div>

        <Card className="overflow-hidden px-6 py-8 sm:px-8">
          {/* One screen at a time, cross-faded and slid horizontally. */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 44, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: direction * -44, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && (
                <InviteScreen onYes={handleYes} onNo={handleNo} />
              )}

              {step === 2 && (
                <RejectionScreen onReconsider={handleReconsider} />
              )}

              {step === 3 && (
                <ScheduleScreen
                  date={date}
                  timeSlotId={timeSlotId}
                  onDateChange={setDate}
                  onTimeSlotChange={setTimeSlotId}
                  onNext={() => goTo(4)}
                />
              )}

              {step === 4 && (
                <FoodScreen
                  selectedFoodIds={foodIds}
                  onToggleFood={toggleFood}
                  customText={foodCustom}
                  onCustomTextChange={setFoodCustom}
                  onNext={() => goTo(5)}
                />
              )}

              {step === 5 && (
                <ActivityScreen
                  selectedActivityIds={activityIds}
                  onToggleActivity={toggleActivity}
                  customText={activityCustom}
                  onCustomTextChange={setActivityCustom}
                  onNext={() => {
                    goTo(6);
                    void sendPlan();
                  }}
                />
              )}

              {step === 6 && (
                <SummaryScreen
                  plan={{
                    date,
                    timeSlotId,
                    foodIds,
                    foodCustom,
                    activityIds,
                    activityCustom,
                  }}
                  sendStatus={sendStatus}
                  onRetrySend={sendPlan}
                  onRestart={handleRestart}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Footer: the locked-in answer, then a back link for the middle steps. */}
        {saidYes && step === 3 && (
          <p className="mt-4 text-center text-[11px] tracking-[0.12em] text-ink-faint uppercase">
            {t.flow.answerLocked}
          </p>
        )}

        {backLink && (
          <button
            type="button"
            onClick={() => goTo(backLink.to, -1)}
            className="mx-auto mt-3 block text-xs text-ink-faint underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-ink-soft"
          >
            {t.flow[backLink.label]}
          </button>
        )}
      </div>
    </main>
  );
}
