"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type ChevronProps } from "react-day-picker";

import { cn } from "@/lib/utils";

/**
 * react-day-picker styled to match the warm/cream theme.
 * Only the pieces this app uses are themed (single-select, one month).
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks
      className={cn("w-fit p-1 text-ink", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "flex flex-col gap-3",
        month_caption: "flex h-9 items-center justify-center px-10",
        caption_label: "font-display text-[15px] font-semibold",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous:
          "inline-flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-wine-tint hover:text-wine disabled:opacity-30 disabled:hover:bg-transparent",
        button_next:
          "inline-flex size-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-wine-tint hover:text-wine disabled:opacity-30 disabled:hover:bg-transparent",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-[11px] font-medium tracking-wide text-ink-faint uppercase",
        weeks: "",
        week: "mt-1 flex w-full",
        day: "size-9 p-0 text-center",
        day_button:
          "size-9 rounded-full text-[13px] font-medium text-ink transition-colors hover:bg-wine-tint hover:text-wine-dark focus-visible:ring-2 focus-visible:ring-wine/50 focus-visible:outline-none disabled:pointer-events-none",
        selected:
          "[&>button]:bg-wine [&>button]:text-white [&>button]:shadow-pill [&>button:hover]:bg-wine-dark [&>button:hover]:text-white",
        today:
          "[&>button]:font-semibold [&>button]:text-wine [&>button]:underline [&>button]:decoration-wine/40 [&>button]:underline-offset-4",
        outside: "[&>button]:text-ink-faint/50",
        // Past days are simply dimmed — a struck-through grid reads as broken.
        disabled: "[&>button]:text-ink-faint/45",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }: ChevronProps) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", chevronClassName)} />
          ) : (
            <ChevronRight className={cn("size-4", chevronClassName)} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
