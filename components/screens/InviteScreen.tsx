"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { useLocale } from "@/components/LocaleProvider";
import { Mascot } from "@/components/Mascot";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** How far the "no" button is allowed to squirm, and how often. */
const DODGE_LIMIT = 4;
const DODGE_OFFSETS = [
  { x: 16, y: -10 },
  { x: -14, y: 12 },
  { x: 18, y: 8 },
  { x: -10, y: -12 },
];

export function InviteScreen({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) {
  const { t } = useLocale();
  const [dodgeCount, setDodgeCount] = useState(0);
  // Touch devices fire a synthetic mouseenter right before click; ignoring the
  // dodge for pointers that aren't a real mouse keeps the button tappable.
  const isFinePointer = useRef(true);

  const handleDodge = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      isFinePointer.current = event.pointerType === "mouse";
      if (!isFinePointer.current) return;
      // Only nudges a few pixels and gives up after DODGE_LIMIT tries, so a
      // determined user can always land the click.
      setDodgeCount((count) => Math.min(count + 1, DODGE_LIMIT));
    },
    [],
  );

  const offset =
    dodgeCount > 0 && dodgeCount < DODGE_LIMIT
      ? DODGE_OFFSETS[(dodgeCount - 1) % DODGE_OFFSETS.length]
      : { x: 0, y: 0 };

  return (
    <>
      <CardHeader className="items-center text-center">
        <Mascot mood="hopeful" className="mx-auto" />

        {/* Dark casual "tag" line above the headline. */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] text-white/90 uppercase"
        >
          <Heart className="size-3 fill-wine text-wine" />
          {t.invite.tag}
        </motion.span>

        <CardTitle className="mt-1 text-[clamp(1.6rem,7.6vw,2.125rem)]">
          {t.invite.title}
        </CardTitle>

        <CardDescription className="mx-auto max-w-[19rem]">
          {t.invite.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-8">
        {/* The "no" button overlaps the corner of the big CTA on purpose. */}
        <div className="relative">
          <Button size="lg" className="w-full text-[17px]" onClick={onYes}>
            {t.invite.yes}
          </Button>

          <motion.div
            className="absolute -top-3.5 -right-2 z-10"
            animate={offset}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="px-3.5 text-xs"
              onPointerEnter={handleDodge}
              onClick={onNo}
            >
              {dodgeCount >= DODGE_LIMIT ? t.invite.noGaveUp : t.invite.no}
            </Button>
          </motion.div>
        </div>

        <p className="mt-5 text-center text-xs text-ink-faint">
          {dodgeCount === 0
            ? t.invite.hintIdle
            : dodgeCount >= DODGE_LIMIT
              ? t.invite.hintGaveUp
              : t.invite.hintDodging}
        </p>
      </CardContent>
    </>
  );
}
