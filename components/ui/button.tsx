"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Pill-shaped button. `primary` is the wine CTA, `secondary` is the softer
 * olive action, `ghost` is for the quiet text links under a CTA.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,box-shadow,border-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-wine/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-wine text-white hover:bg-wine-dark",
        secondary:
          "bg-olive text-white hover:bg-olive-dark",
        outline:
          "border border-ink/15 bg-white text-ink hover:border-wine/50 hover:bg-wine-tint",
        ghost: "text-ink-soft hover:bg-ink/5 hover:text-ink",
      },
      size: {
        lg: "h-14 px-8 text-base",
        md: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-[13px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element instead of a `<button>`. */
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
