"use server";

import { isValid, parseISO } from "date-fns";
import nodemailer from "nodemailer";

import {
  ACTIVITY_OPTIONS,
  CUSTOM_TEXT_MAX,
  FOOD_OPTIONS,
  TIME_SLOTS,
} from "@/lib/mock-data";
import { DEFAULT_LOCALE, DICTIONARIES, isLocale, type Locale } from "@/lib/i18n";
import { buildPlanEmailHtml } from "@/lib/plan-email";
import { buildPlanText, formatWhen, type DatePlan } from "@/lib/plan";

/** What the client sends: the date travels as "yyyy-MM-dd", not a Date. */
export type PlanPayload = {
  date: string | null;
  timeSlotId: string | null;
  foodIds: string[];
  foodCustom: string;
  activityIds: string[];
  activityCustom: string;
  locale: Locale;
};

export type SendResult = { ok: true } | { ok: false; error: string };

/** Keep only ids that exist in a menu — this endpoint is reachable by any POST. */
function knownIds(ids: unknown, options: { id: string }[]): string[] {
  if (!Array.isArray(ids)) return [];
  return options.map((o) => o.id).filter((id) => ids.includes(id));
}

/** Trimmed, length-capped write-in text; anything that is not a string becomes "". */
function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, CUSTOM_TEXT_MAX);
}

/**
 * Emails the finished plan to the owner's Gmail.
 * The recipient is fixed by env vars, so the endpoint can't be used to mail anyone else.
 */
export async function sendPlanEmail(payload: PlanPayload): Promise<SendResult> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.NOTIFY_EMAIL || user;
  if (!user || !pass || !to) {
    console.error("sendPlanEmail: GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return { ok: false, error: "Email is not configured yet." };
  }

  const parsedDate = payload?.date ? parseISO(payload.date) : undefined;
  const plan: DatePlan = {
    date: parsedDate && isValid(parsedDate) ? parsedDate : undefined,
    timeSlotId: TIME_SLOTS.some((s) => s.id === payload?.timeSlotId)
      ? payload.timeSlotId
      : null,
    foodIds: knownIds(payload?.foodIds, FOOD_OPTIONS),
    foodCustom: cleanText(payload?.foodCustom),
    activityIds: knownIds(payload?.activityIds, ACTIVITY_OPTIONS),
    activityCustom: cleanText(payload?.activityCustom),
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const locale = isLocale(payload?.locale) ? payload.locale : DEFAULT_LOCALE;
  const text = buildPlanText(plan, locale);

  try {
    await transporter.sendMail({
      from: `"Date planner 💌" <${user}>`,
      to,
      subject: DICTIONARIES[locale].email.subject(formatWhen(plan, locale)),
      // Plain text stays as the fallback for clients that block HTML.
      text,
      html: buildPlanEmailHtml(plan, text, locale),
    });
    return { ok: true };
  } catch (error) {
    console.error("sendPlanEmail failed:", error);
    return { ok: false, error: "Couldn't send the email." };
  }
}
