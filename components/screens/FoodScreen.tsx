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
  FOOD_OPTIONS,
  isCustomMissing,
  localizeMenu,
} from "@/lib/mock-data";

/** Part 1 of the date: what we eat. */
export function FoodScreen({
  selectedFoodIds,
  onToggleFood,
  customText,
  onCustomTextChange,
  onNext,
}: {
  selectedFoodIds: string[];
  onToggleFood: (id: string) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  onNext: () => void;
}) {
  const { locale, t } = useLocale();
  const hasSelection = selectedFoodIds.length > 0;
  const customMissing = isCustomMissing(selectedFoodIds, customText);

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="hungry" className="mx-auto" />
        <p className="text-[11px] font-medium tracking-[0.14em] text-wine uppercase">
          {t.food.part}
        </p>
        <CardTitle>{t.food.title}</CardTitle>
        <CardDescription className="mx-auto max-w-[18rem]">
          {t.food.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-7 gap-5">
        <OptionGrid
          options={localizeMenu(FOOD_OPTIONS, locale)}
          selectedIds={selectedFoodIds}
          onToggle={onToggleFood}
          customText={customText}
          onCustomTextChange={onCustomTextChange}
          customPlaceholder={t.food.customPlaceholder}
        />

        <Button
          size="lg"
          className="w-full text-[17px]"
          disabled={!hasSelection || customMissing}
          onClick={onNext}
        >
          {t.food.next}
          <ArrowRight className="size-4" />
        </Button>

        <p className="text-center text-xs text-ink-faint">
          {customMissing
            ? t.customMissing
            : hasSelection
              ? t.food.picked(selectedFoodIds.length)
              : t.food.none}
        </p>
      </CardContent>
    </>
  );
}
