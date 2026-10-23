/**
 * Static content for the invite flow.
 * Menu items carry both languages; screens resolve them with the active locale.
 */

import type { Locale, Localized } from "@/lib/i18n";

export type TimeSlot = {
  /** Stable key kept in state instead of the display string, e.g. "1830". */
  id: string;
  hours: number;
  minutes: number;
};

/** First and last bookable times, in minutes after midnight. */
const FIRST_SLOT = 17 * 60; // 5:00 PM
const LAST_SLOT = 21 * 60 + 30; // 9:30 PM
const SLOT_STEP = 30;

function toSlot(total: number): TimeSlot {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return {
    id: `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`,
    hours,
    minutes,
  };
}

/** 17:00, 17:30, 18:00 … 21:30 */
export const TIME_SLOTS: TimeSlot[] = Array.from(
  { length: (LAST_SLOT - FIRST_SLOT) / SLOT_STEP + 1 },
  (_, index) => toSlot(FIRST_SLOT + index * SLOT_STEP),
);

/** "6:30 PM" in English, "18:30" in Vietnamese. */
export function formatSlotTime(slot: TimeSlot, locale: Locale): string {
  const mm = String(slot.minutes).padStart(2, "0");
  if (locale === "vi") return `${slot.hours}:${mm}`;
  const hours12 = slot.hours % 12 === 0 ? 12 : slot.hours % 12;
  return `${hours12}:${mm} ${slot.hours < 12 ? "AM" : "PM"}`;
}

export type MenuItem = {
  id: string;
  emoji: string;
  label: Localized;
  /** Tiny aside under the label. */
  note: Localized;
  /** The write-your-own card: picking it opens a text box. */
  custom?: boolean;
};

/** A menu item resolved into one language, ready to render. */
export type MenuOption = {
  id: string;
  emoji: string;
  label: string;
  note: string;
  custom?: boolean;
};

/** Id of the write-your-own card in both menus. */
export const CUSTOM_OPTION_ID = "other";

/** Longest write-in answer we accept (also enforced on the server). */
export const CUSTOM_TEXT_MAX = 120;

/** Part 1 of the date: dinner. */
export const FOOD_OPTIONS: MenuItem[] = [
  {
    id: "pizza",
    emoji: "🍕",
    label: { vi: "Pizza", en: "Pizza" },
    note: { vi: "chia đôi, tất nhiên", en: "shared, obviously" },
  },
  {
    id: "bbq-buffet",
    emoji: "🥩",
    label: { vi: "Buffet Nướng", en: "BBQ Buffet" },
    note: { vi: "anh nướng, em ăn", en: "I grill, you eat" },
  },
  {
    id: "hotpot",
    emoji: "🍲",
    label: { vi: "Lẩu", en: "Hotpot" },
    note: { vi: "ấm bụng, ấm lòng", en: "warm belly, warm heart" },
  },
  {
    id: "japanese",
    emoji: "🍣",
    label: { vi: "Đồ Nhật", en: "Japanese" },
    note: { vi: "em gọi, anh tin em", en: "you order, I trust you" },
  },
  {
    id: "fried-chicken",
    emoji: "🍗",
    label: { vi: "Gà rán", en: "Fried chicken" },
    note: { vi: "cần nhiều giấy ăn", en: "napkins required" },
  },
  {
    id: CUSTOM_OPTION_ID,
    emoji: "✍️",
    label: { vi: "Món khác", en: "Something else" },
    note: {
      vi: "Em iu muốn ăn gì thì điền thêm vào đây cho anh nhé",
      en: "Craving something else, babe? Write it in here for me",
    },
    custom: true,
  },
];

/** Part 2 of the date: after dinner. */
export const ACTIVITY_OPTIONS: MenuItem[] = [
  {
    id: "movie",
    emoji: "🎬",
    label: { vi: "Xem phim", en: "Movie" },
    note: { vi: "bắp rang anh lo", en: "popcorn's on me" },
  },
  {
    id: "walk",
    emoji: "🚶",
    label: { vi: "Dạo phố", en: "City stroll" },
    note: { vi: "đi chậm, nói nhiều", en: "slow steps, long talks" },
  },
  {
    id: "karaoke",
    emoji: "🎤",
    label: { vi: "Karaoke", en: "Karaoke" },
    note: { vi: "song ca là bắt buộc", en: "duets are mandatory" },
  },
  {
    id: "box-game",
    emoji: "🎮",
    label: { vi: "Box game", en: "Game box" },
    note: { vi: "ai thua bao trà sữa", en: "loser buys bubble tea" },
  },
  {
    id: "rooftop",
    emoji: "☕",
    label: { vi: "Rooftop cafe", en: "Rooftop café" },
    note: { vi: "ngắm phố về đêm", en: "city lights, just us" },
  },
  {
    id: CUSTOM_OPTION_ID,
    emoji: "✍️",
    label: { vi: "Chỗ khác", en: "Somewhere else" },
    note: {
      vi: "Em iu muốn đi đâu nữa thì điền vào đây nhé",
      en: "Want to go somewhere else, babe? Write it in here",
    },
    custom: true,
  },
];

/** Resolve a menu into one language. */
export function localizeMenu(items: MenuItem[], locale: Locale): MenuOption[] {
  return items.map((item) => ({
    ...item,
    label: item.label[locale],
    note: item.note[locale],
  }));
}

/** Look up a slot by id without exploding if state ever goes stale. */
export function findTimeSlot(id: string | null): TimeSlot | undefined {
  if (!id) return undefined;
  return TIME_SLOTS.find((slot) => slot.id === id);
}

/** True when the write-in card is ticked but nothing has been typed yet. */
export function isCustomMissing(ids: string[], customText: string): boolean {
  return ids.includes(CUSTOM_OPTION_ID) && customText.trim() === "";
}

/**
 * The picked options in menu order, with the write-in card's label swapped
 * for what was actually typed (and dropped if nothing was typed).
 */
export function pickedOptions(
  items: MenuItem[],
  ids: string[],
  customText: string,
  locale: Locale,
  customNote: string,
): MenuOption[] {
  const typed = customText.trim();
  return localizeMenu(items, locale)
    .filter((option) => ids.includes(option.id))
    .flatMap((option) => {
      if (!option.custom) return [option];
      return typed ? [{ ...option, label: typed, note: customNote }] : [];
    });
}
