import type { Locale as DateFnsLocale } from "date-fns";
import { enUS, vi } from "date-fns/locale";

/**
 * Every piece of copy in the app, in both languages.
 * Screens read from `t` (via useLocale) instead of hard-coding strings,
 * and the server reads the same dictionary to write the email.
 */

export type Locale = "en" | "vi";

export const LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "vi";
}

/** A string that exists in every language. */
export type Localized = Record<Locale, string>;

export const DATE_LOCALES: Record<Locale, DateFnsLocale> = { en: enUS, vi };

const en = {
  flow: {
    brand: "a small proposal",
    answerLocked: "answer locked in · yes",
    startOver: "start over",
    backToCalendar: "back to the calendar",
    backToFood: "back to the food",
    stepLabel: (current: number, total: number) =>
      `Step ${current} of ${total}`,
    languageLabel: "Language",
  },
  invite: {
    tag: "drafted 11 times, sent once",
    title: "So… would you go on a date with me?",
    description:
      "No pressure. I've got a few ideas for what we could eat, a free evening, and absolutely no chill about it.",
    yes: "Yes, obviously",
    no: "no",
    noGaveUp: "fine, no",
    hintIdle: "One of these buttons is bigger for a reason.",
    hintDodging: "Hey — that one keeps moving. Weird.",
    hintGaveUp: "Okay, it stopped running. Your call.",
  },
  rejection: {
    title: "no. no no no. no?",
    titleAccent: "no.",
    description:
      "Respectfully, I have already told three friends this was happening. They are going to have questions.",
    heartRate: "heart rate",
    statusLabel: "Status:",
    statusValue: "dramatically unwell",
    prognosis: "Prognosis: reversible with one small yes",
    reconsider: "okay okay, I'll go",
    footnote: "The no button was never load-bearing.",
  },
  schedule: {
    title: "When are you free?",
    description:
      "Pick whatever is easiest for you. I will rearrange my entire week around it and pretend that was the plan.",
    dateLabel: "Pick a date",
    datePlaceholder: "Choose a day that works",
    timeLabel: "Pick a time",
    timePlaceholder: "Choose a time",
    next: "Okay, next",
    hint: "Both a day and a time, please. I need to look organised.",
  },
  food: {
    part: "Part 1 · Dinner",
    title: "What are you craving?",
    description:
      "Pick as many as you want. There is no wrong answer here and there is definitely no judgement.",
    next: "This one!",
    picked: (count: number) => `${count} picked — excellent taste, as expected.`,
    none: "Pick at least one so I can book something.",
    customPlaceholder: "e.g. noodle soup, street snacks…",
  },
  activity: {
    part: "Part 2 · After dinner",
    title: "And then where to?",
    description: "The night is young. Pick whatever sounds fun once we are full.",
    next: "Let's do it!",
    picked: (count: number) => `${count} picked — this night is getting good.`,
    none: "Pick at least one so the night doesn't end at dessert.",
    customPlaceholder: "e.g. the beach, a museum, the park…",
  },
  customMissing: "Write it in the box above, then we can keep going.",
  summary: {
    note: "okay I'm writing this down before you change your mind —",
    title: "It's a plan.",
    when: "When",
    food: "Part 1 · Food",
    after: "Part 2 · After dinner",
    foodManyHint: "we are ordering all of it, apparently",
    afterManyHint: "a long night, as it should be",
    copy: "Copy plan & text me",
    copied: "Copied!",
    copiedToast: "Copied! Now go paste it 🤍",
    restart: "Plan another date",
    sending: "sending this straight to me…",
    sent: "sent! it's already in my inbox 💌",
    sendError: "the email got lost on the way —",
    retry: "try again",
  },
  plan: {
    dayTbd: "a day to be decided",
    dayFormat: "EEEE, MMMM do",
    at: "at",
    nothingPicked: "dealer's choice",
    and: "&",
    customNote: "your own pick",
    textHeader: "We have a date 🤍",
    textWhen: "WHEN",
    textFood: "PART 1 · FOOD",
    textAfter: "PART 2 · AFTER",
    textFooter: "I'm counting on this. Text me to confirm.",
  },
  email: {
    subject: (when: string) => `💌 We have a date — ${when}`,
    preheader: (when: string) => `${when} — the plan is locked in 🤍`,
    eyebrow: "a small proposal · accepted",
    title: "We have a date.",
    subtitle: "the answer was yes — here's everything we picked",
    when: "📅 When",
    part1: "Part 1 · Dinner",
    part1Title: "What we're eating",
    part2: "Part 2 · After dinner",
    part2Title: "And then…",
    calendarButton: "Add to Google Calendar →",
    calendarEvent: "Our date 🤍",
    footer: "don't be late. someone's counting on you 🤍",
    footerSmall: "sent automatically by your date planner",
  },
};

export type Dictionary = typeof en;

const viDict: Dictionary = {
  flow: {
    brand: "một lời mời nho nhỏ",
    answerLocked: "đã chốt câu trả lời · đồng ý",
    startOver: "làm lại từ đầu",
    backToCalendar: "quay lại chọn ngày",
    backToFood: "quay lại chọn món",
    stepLabel: (current, total) => `Bước ${current}/${total}`,
    languageLabel: "Ngôn ngữ",
  },
  invite: {
    tag: "soạn 11 lần, gửi đúng 1 lần",
    title: "Vậy… em đi hẹn hò với anh nhé?",
    description:
      "Không áp lực gì đâu. Anh chỉ có vài gợi ý món ngon, một buổi tối rảnh, và hồi hộp muốn xỉu thôi.",
    yes: "Đồng ý luôn",
    no: "không",
    noGaveUp: "thôi được, không",
    hintIdle: "Có lý do để một nút to hơn nút kia đó.",
    hintDodging: "Ơ — sao nút kia cứ chạy hoài vậy ta.",
    hintGaveUp: "Rồi, nó hết chạy rồi. Em quyết nhé.",
  },
  rejection: {
    title: "không. không không không. không?",
    titleAccent: "không.",
    description:
      "Anh lỡ khoe với ba đứa bạn là sắp có hẹn rồi. Giờ tụi nó hỏi thì anh biết trả lời sao.",
    heartRate: "nhịp tim",
    statusLabel: "Tình trạng:",
    statusValue: "suy sụp nghiêm trọng",
    prognosis: "Tiên lượng: hồi phục ngay nếu em nói “có”",
    reconsider: "thôi được rồi, em đi",
    footnote: "Nút “không” chỉ để trang trí thôi.",
  },
  schedule: {
    title: "Khi nào em rảnh?",
    description:
      "Em chọn lúc nào tiện nhất nhé. Anh sẽ xếp lại cả tuần theo em và giả vờ như đó là kế hoạch từ đầu.",
    dateLabel: "Chọn ngày",
    datePlaceholder: "Chọn một ngày em rảnh",
    timeLabel: "Chọn giờ",
    timePlaceholder: "Chọn giờ hẹn",
    next: "Tiếp nào",
    hint: "Chọn cả ngày lẫn giờ nha. Anh cần tỏ ra chu đáo.",
  },
  food: {
    part: "Phần 1 · Bữa tối",
    title: "Em đang thèm gì nè?",
    description:
      "Chọn bao nhiêu cũng được. Không có đáp án sai, và tuyệt đối không ai phán xét.",
    next: "Chốt món!",
    picked: (count) => `Đã chọn ${count} món — đúng là có gu.`,
    none: "Chọn ít nhất một món để anh còn đặt bàn nhé.",
    customPlaceholder: "VD: bún bò, bánh tráng trộn…",
  },
  activity: {
    part: "Phần 2 · Sau bữa tối",
    title: "Ăn xong mình đi đâu?",
    description: "Đêm còn dài mà. Ăn no rồi em muốn đi đâu thì chọn nhé.",
    next: "Đi thôi!",
    picked: (count) => `Đã chọn ${count} chỗ — tối nay vui rồi đây.`,
    none: "Chọn ít nhất một chỗ để buổi tối không kết thúc sớm nha.",
    customPlaceholder: "VD: đi biển, bảo tàng, công viên…",
  },
  customMissing: "Viết vào ô bên trên nhé, rồi mình đi tiếp.",
  summary: {
    note: "để anh ghi lại liền trước khi em đổi ý —",
    title: "Chốt kèo rồi nhé.",
    when: "Khi nào",
    food: "Phần 1 · Ăn gì",
    after: "Phần 2 · Sau bữa tối",
    foodManyHint: "chắc là gọi hết luôn quá",
    afterManyHint: "một buổi tối dài, đúng ý anh",
    copy: "Copy kế hoạch & nhắn anh",
    copied: "Đã copy!",
    copiedToast: "Copy rồi! Giờ dán gửi anh nha 🤍",
    restart: "Lên kèo hẹn khác",
    sending: "đang gửi thẳng cho anh…",
    sent: "gửi rồi! anh nhận được rồi nè 💌",
    sendError: "email bị lạc đường mất rồi —",
    retry: "thử lại",
  },
  plan: {
    dayTbd: "ngày chưa chốt",
    dayFormat: "EEEE, 'ngày' d 'tháng' M",
    at: "lúc",
    nothingPicked: "anh chọn giúp",
    and: "&",
    customNote: "em tự điền",
    textHeader: "Mình có hẹn rồi nhé 🤍",
    textWhen: "KHI NÀO",
    textFood: "PHẦN 1 · ĂN GÌ",
    textAfter: "PHẦN 2 · ĐI ĐÂU",
    textFooter: "Anh chờ đó. Nhắn anh xác nhận nha.",
  },
  email: {
    subject: (when) => `💌 Mình có hẹn rồi — ${when}`,
    preheader: (when) => `${when} — kế hoạch đã chốt 🤍`,
    eyebrow: "lời mời nho nhỏ · đã đồng ý",
    title: "Mình có hẹn rồi.",
    subtitle: "em đã nói “có” — đây là mọi thứ em đã chọn",
    when: "📅 Khi nào",
    part1: "Phần 1 · Bữa tối",
    part1Title: "Mình sẽ ăn",
    part2: "Phần 2 · Sau bữa tối",
    part2Title: "Rồi sau đó…",
    calendarButton: "Thêm vào Google Calendar →",
    calendarEvent: "Buổi hẹn của mình 🤍",
    footer: "đừng đến muộn nha. có người đang chờ đó 🤍",
    footerSmall: "gửi tự động từ trang hẹn hò của anh",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, vi: viDict };
