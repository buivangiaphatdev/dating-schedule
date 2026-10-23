import { format } from "date-fns";

import { DICTIONARIES, type Locale } from "@/lib/i18n";
import {
  findTimeSlot,
  formatSlotTime,
  type MenuOption,
} from "@/lib/mock-data";
import {
  formatDay,
  formatWhen,
  pickedActivities,
  pickedFood,
  type DatePlan,
} from "@/lib/plan";

/**
 * HTML version of the plan email.
 * Email clients ignore <style> blocks and modern CSS, so everything here is
 * table layout + inline styles, using the same palette as the app.
 */

const C = {
  cream: "#f7f3ec",
  creamDeep: "#ece5d9",
  ink: "#1f1b18",
  inkSoft: "#5e5650",
  inkFaint: "#958c84",
  wine: "#9b2c2c",
  wineDark: "#7c2121",
  wineTint: "#f2e2de",
  olive: "#6b7445",
  oliveTint: "#e8e9da",
  line: "#e2d9cb",
};

// Georgia has no precomposed Vietnamese glyphs (ồ, ế…) and stacks the accents
// wrongly, so Vietnamese mail uses serifs that ship full Vietnamese coverage.
const SERIF_BY_LOCALE: Record<Locale, string> = {
  en: "Georgia, 'Times New Roman', serif",
  vi: "'Noto Serif', 'Times New Roman', Times, serif",
};
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** How long the calendar event blocks out. */
const DATE_LENGTH_HOURS = 4;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** "Add to Google Calendar" link, or null when the day or time isn't set. */
function calendarLink(
  plan: DatePlan,
  title: string,
  details: string,
): string | null {
  const slot = findTimeSlot(plan.timeSlotId);
  if (!plan.date || !slot) return null;

  const start = new Date(plan.date);
  start.setHours(slot.hours, slot.minutes, 0, 0);
  const end = new Date(start.getTime() + DATE_LENGTH_HOURS * 60 * 60 * 1000);
  const stamp = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: "Asia/Ho_Chi_Minh",
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** One pill-shaped chip per picked option: emoji, label and its little note. */
function chips(picked: MenuOption[], tint: string, emptyText: string): string {
  if (picked.length === 0) {
    return `<p style="margin:0;font-family:${SANS};font-size:14px;color:${C.inkSoft};">${escapeHtml(emptyText)}</p>`;
  }

  return picked
    .map(
      (option) => `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 8px;">
          <tr>
            <td style="background:${tint};border-radius:14px;padding:12px 14px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="font-size:24px;line-height:1;padding-right:12px;">${option.emoji}</td>
                  <td valign="middle">
                    <p style="margin:0;font-family:${SANS};font-size:15px;font-weight:600;color:${C.ink};">${escapeHtml(option.label)}</p>
                    <p style="margin:2px 0 0;font-family:${SANS};font-size:12px;color:${C.inkSoft};">${escapeHtml(option.note)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`,
    )
    .join("");
}

/** A numbered section: small caps label, serif heading, then the chips. */
function section(
  serif: string,
  part: string,
  title: string,
  body: string,
  accent: string,
): string {
  return `
    <tr>
      <td style="padding:0 32px 24px;">
        <p style="margin:0 0 4px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${accent};">${escapeHtml(part)}</p>
        <p style="margin:0 0 12px;font-family:${serif};font-size:20px;font-weight:600;color:${C.ink};">${escapeHtml(title)}</p>
        ${body}
      </td>
    </tr>`;
}

export function buildPlanEmailHtml(
  plan: DatePlan,
  plainText: string,
  locale: Locale,
): string {
  const dict = DICTIONARIES[locale];
  const t = dict.email;
  const SERIF = SERIF_BY_LOCALE[locale];
  const slot = findTimeSlot(plan.timeSlotId);
  const dayLine = formatDay(plan.date, locale);
  const calendarUrl = calendarLink(plan, t.calendarEvent, plainText);

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>${escapeHtml(t.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.creamDeep};">
  <!-- Preheader: the grey preview line in the inbox list. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(t.preheader(formatWhen(plan, locale)))}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.creamDeep};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;background:${C.cream};border:1px solid ${C.line};border-radius:20px;overflow:hidden;">

          <!-- Header band -->
          <tr>
            <td align="center" style="background:#ffffff;border-top:6px solid ${C.wine};border-bottom:1px solid ${C.line};padding:36px 32px 30px;">
              <p style="margin:0 0 10px;font-size:40px;line-height:1;">💌</p>
              <p style="margin:0;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.wine};">${escapeHtml(t.eyebrow)}</p>
              <h1 style="margin:8px 0 0;font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:600;color:${C.ink};">${escapeHtml(t.title)}</h1>
              <p style="margin:10px 0 0;font-family:${SERIF};font-size:15px;font-style:italic;color:${C.inkSoft};">${escapeHtml(t.subtitle)}</p>
            </td>
          </tr>

          <!-- When -->
          <tr>
            <td style="padding:28px 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:1px solid ${C.line};border-radius:20px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${C.inkFaint};">${escapeHtml(t.when)}</p>
                    <p style="margin:0;font-family:${SERIF};font-size:22px;font-weight:600;color:${C.ink};">${escapeHtml(dayLine)}</p>
                    ${
                      slot
                        ? `<p style="margin:4px 0 0;font-family:${SANS};font-size:15px;font-weight:600;color:${C.wineDark};">${escapeHtml(formatSlotTime(slot, locale))}</p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${section(SERIF, t.part1, t.part1Title, chips(pickedFood(plan, locale), C.wineTint, dict.plan.nothingPicked), C.wine)}

          ${section(SERIF, t.part2, t.part2Title, chips(pickedActivities(plan, locale), C.oliveTint, dict.plan.nothingPicked), C.olive)}

          ${
            calendarUrl
              ? `<!-- Calendar button -->
          <tr>
            <td align="center" style="padding:4px 32px 32px;">
              <a href="${escapeHtml(calendarUrl)}" target="_blank" style="display:inline-block;background:${C.wine};color:#ffffff;font-family:${SANS};font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:8px;">${escapeHtml(t.calendarButton)}</a>
            </td>
          </tr>`
              : ""
          }

          <!-- Footer -->
          <tr>
            <td align="center" style="border-top:1px solid ${C.line};padding:20px 32px 26px;">
              <p style="margin:0;font-family:${SERIF};font-size:14px;font-style:italic;color:${C.inkSoft};">${escapeHtml(t.footer)}</p>
              <p style="margin:6px 0 0;font-family:${SANS};font-size:11px;color:${C.inkFaint};">${escapeHtml(t.footerSmall)}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
