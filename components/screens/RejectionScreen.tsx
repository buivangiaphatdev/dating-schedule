"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

import { useLocale } from "@/components/LocaleProvider";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RejectionScreen({
  onReconsider,
}: {
  onReconsider: () => void;
}) {
  const { t } = useLocale();

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="sad" className="mx-auto" />

        <CardTitle className="text-[clamp(1.55rem,7.2vw,2rem)]">
          {t.rejection.title}{" "}
          <span className="text-wine">{t.rejection.titleAccent}</span>
        </CardTitle>

        <CardDescription className="mx-auto max-w-[18rem]">
          {t.rejection.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-7 gap-5">
        {/* Purely decorative "vitals" panel — no real logic behind it. */}
        <div className="rounded-3xl border border-wine/15 bg-wine-tint/50 p-4">
          <div className="flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] text-wine uppercase">
              <Activity className="size-3.5" />
              {t.rejection.heartRate}
            </span>
            <motion.span
              className="font-display text-2xl font-semibold text-wine tabular-nums"
              animate={{ scale: [1, 1.09, 1] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            >
              182
            </motion.span>
          </div>

          <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-wine/15">
            <div className="animate-heartbeat-sweep absolute inset-y-0 w-1/3 rounded-full bg-wine" />
          </div>

          <p className="mt-3 text-[13px] text-ink-soft">
            {t.rejection.statusLabel}{" "}
            <span className="text-ink">{t.rejection.statusValue}</span> ·{" "}
            {t.rejection.prognosis}
          </p>
        </div>

        <Button size="lg" className="w-full text-[17px]" onClick={onReconsider}>
          {t.rejection.reconsider}
        </Button>

        <p className="text-center text-xs text-ink-faint">
          {t.rejection.footnote}
        </p>
      </CardContent>
    </>
  );
}
