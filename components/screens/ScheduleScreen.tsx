"use client";

import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { ArrowRight, CalendarDays } from "lucide-react";
import { enUS as dayPickerEn, vi as dayPickerVi } from "react-day-picker/locale";

import { useLocale } from "@/components/LocaleProvider";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_LOCALES } from "@/lib/i18n";
import { TIME_SLOTS, formatSlotTime } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ScheduleScreen({
  date,
  timeSlotId,
  onDateChange,
  onTimeSlotChange,
  onNext,
}: {
  date: Date | undefined;
  timeSlotId: string | null;
  onDateChange: (date: Date | undefined) => void;
  onTimeSlotChange: (id: string) => void;
  onNext: () => void;
}) {
  const { locale, t } = useLocale();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const canContinue = Boolean(date && timeSlotId);

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="planning" className="mx-auto" />
        <CardTitle>{t.schedule.title}</CardTitle>
        <CardDescription className="mx-auto max-w-[18rem]">
          {t.schedule.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-7 gap-5">
        {/* --- Date --------------------------------------------------------- */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-ink-faint uppercase">
            {t.schedule.dateLabel}
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-14 w-full items-center gap-3 rounded-2xl border border-ink/12 bg-white px-4 text-left text-sm transition-colors",
                  "hover:border-wine/40 focus-visible:border-wine focus-visible:ring-2 focus-visible:ring-wine/25 focus-visible:outline-none",
                  "data-[state=open]:border-wine data-[state=open]:ring-2 data-[state=open]:ring-wine/25",
                  date ? "text-ink" : "text-ink-faint",
                )}
              >
                <CalendarDays className="size-4 shrink-0 text-wine" />
                {date ? (
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-medium tabular-nums">
                      {format(date, "dd/MM/yyyy")}
                    </span>
                    <span className="truncate text-xs text-ink-soft capitalize">
                      {format(date, "EEEE", { locale: DATE_LOCALES[locale] })}
                    </span>
                  </span>
                ) : (
                  <span>{t.schedule.datePlaceholder}</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">
              <Calendar
                mode="single"
                locale={locale === "vi" ? dayPickerVi : dayPickerEn}
                selected={date}
                defaultMonth={date}
                autoFocus
                // No time travel: yesterday is not a date option, and the
                // "previous month" arrow stops at the current month.
                disabled={{ before: startOfToday() }}
                startMonth={startOfToday()}
                // Neighbouring-month days would look disabled while still being
                // clickable, so only show days that belong to this month.
                showOutsideDays={false}
                onSelect={(selected) => {
                  onDateChange(selected);
                  if (selected) setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* --- Time --------------------------------------------------------- */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium tracking-[0.12em] text-ink-faint uppercase">
            {t.schedule.timeLabel}
          </label>
          {/* "" (not undefined) keeps Select controlled from the first render
              while still showing the placeholder — Radix treats both as empty,
              but undefined makes it start out uncontrolled and warn. */}
          <Select value={timeSlotId ?? ""} onValueChange={onTimeSlotChange}>
            <SelectTrigger aria-label={t.schedule.timeLabel}>
              <SelectValue placeholder={t.schedule.timePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot.id} value={slot.id}>
                  <span className="font-medium tabular-nums">
                    {formatSlotTime(slot, locale)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="lg"
          className="mt-2 w-full text-[17px]"
          disabled={!canContinue}
          onClick={onNext}
        >
          {t.schedule.next}
          <ArrowRight className="size-4" />
        </Button>

        {!canContinue && (
          <p className="text-center text-xs text-ink-faint">
            {t.schedule.hint}
          </p>
        )}
      </CardContent>
    </>
  );
}
