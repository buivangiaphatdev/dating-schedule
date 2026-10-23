"use client";

import { ArrowRight } from "lucide-react";

import { useLocale } from "@/components/LocaleProvider";
import { Mascot } from "@/components/Mascot";
import { OptionGrid } from "@/components/OptionGrid";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ACTIVITY_OPTIONS,
  isCustomMissing,
  localizeMenu,
} from "@/lib/mock-data";

/** Part 2 of the date: where we go after the meal. */
export function ActivityScreen({
  selectedActivityIds,
  onToggleActivity,
  customText,
  onCustomTextChange,
  onNext,
}: {
  selectedActivityIds: string[];
  onToggleActivity: (id: string) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  onNext: () => void;
}) {
  const { locale, t } = useLocale();
  const hasSelection = selectedActivityIds.length > 0;
  const customMissing = isCustomMissing(selectedActivityIds, customText);

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="planning" className="mx-auto" />
        <p className="text-[11px] font-medium tracking-[0.14em] text-wine uppercase">
          {t.activity.part}
        </p>
        <CardTitle>{t.activity.title}</CardTitle>
        <CardDescription className="mx-auto max-w-[18rem]">
          {t.activity.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-7 gap-5">
        <OptionGrid
          options={localizeMenu(ACTIVITY_OPTIONS, locale)}
          selectedIds={selectedActivityIds}
          onToggle={onToggleActivity}
          customText={customText}
          onCustomTextChange={onCustomTextChange}
          customPlaceholder={t.activity.customPlaceholder}
        />

        <Button
          size="lg"
          className="w-full text-[17px]"
          disabled={!hasSelection || customMissing}
          onClick={onNext}
        >
          {t.activity.next}
          <ArrowRight className="size-4" />
        </Button>

        <p className="text-center text-xs text-ink-faint">
          {customMissing
            ? t.customMissing
            : hasSelection
              ? t.activity.picked(selectedActivityIds.length)
              : t.activity.none}
        </p>
      </CardContent>
    </>
  );
}
