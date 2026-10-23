import { format } from "date-fns";

import { DATE_LOCALES, DICTIONARIES, type Locale } from "@/lib/i18n";
import {
  ACTIVITY_OPTIONS,
  FOOD_OPTIONS,
  findTimeSlot,
  formatSlotTime,
  pickedOptions,
  type MenuOption,
} from "@/lib/mock-data";

export type DatePlan = {
  date: Date | undefined;
  timeSlotId: string | null;
  /** Part 1 of the date: the meal. */
  foodIds: string[];
  /** What was typed into the write-your-own food card. */
  foodCustom: string;
  /** Part 2 of the date: what we do after the meal. */
  activityIds: string[];
  /** What was typed into the write-your-own activity card. */
  activityCustom: string;
};

/** Where the "email me the plan" request is at. */
export type SendStatus = "idle" | "sending" | "sent" | "error";

/** Capitalise the first letter — date-fns writes "thứ Tư" in lower case. */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** "Wednesday, October 28th" / "Thứ Tư, ngày 28 tháng 10" */
export function formatDay(date: Date | undefined, locale: Locale): string {
  const t = DICTIONARIES[locale].plan;
  if (!date) return t.dayTbd;
  return capitalize(
    format(date, t.dayFormat, { locale: DATE_LOCALES[locale] }),
  );
}

/** "Wednesday, October 28th at 6:30 PM" / "Thứ Tư, ngày 28 tháng 10 lúc 18:30" */
export function formatWhen(plan: DatePlan, locale: Locale): string {
  const slot = findTimeSlot(plan.timeSlotId);
  const day = formatDay(plan.date, locale);
  if (!slot) return day;
  return `${day} ${DICTIONARIES[locale].plan.at} ${formatSlotTime(slot, locale)}`;
}

export function pickedFood(plan: DatePlan, locale: Locale): MenuOption[] {
  return pickedOptions(
    FOOD_OPTIONS,
    plan.foodIds,
    plan.foodCustom,
    locale,
    DICTIONARIES[locale].plan.customNote,
  );
}

export function pickedActivities(plan: DatePlan, locale: Locale): MenuOption[] {
  return pickedOptions(
    ACTIVITY_OPTIONS,
    plan.activityIds,
    plan.activityCustom,
    locale,
    DICTIONARIES[locale].plan.customNote,
  );
}

/** "Pizza, Lẩu & Gà rán" — a comma list with an ampersand before the last. */
function joinLabels(options: MenuOption[], locale: Locale): string {
  const t = DICTIONARIES[locale].plan;
  const labels = options.map((option) => option.label);
  if (labels.length === 0) return t.nothingPicked;
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} ${t.and} ${labels[labels.length - 1]}`;
}

export function formatFood(plan: DatePlan, locale: Locale): string {
  return joinLabels(pickedFood(plan, locale), locale);
}

export function formatActivities(plan: DatePlan, locale: Locale): string {
  return joinLabels(pickedActivities(plan, locale), locale);
}

/** The plain-text blob that lands on the clipboard (and the email fallback). */
export function buildPlanText(plan: DatePlan, locale: Locale): string {
  const t = DICTIONARIES[locale].plan;
  return [
    t.textHeader,
    "",
    `${t.textWhen}: ${formatWhen(plan, locale)}`,
    `${t.textFood}: ${formatFood(plan, locale)}`,
    `${t.textAfter}: ${formatActivities(plan, locale)}`,
    "",
    t.textFooter,
  ].join("\n");
}
