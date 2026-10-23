# A small proposal — an interactive date invite

A one-page, five-step "flow" web app: someone asks you out, you pick a night,
you pick something to eat, and you walk away with a plan you can copy and paste
into a message.

No auth, no swiping, no chat, no database. Every answer lives in React state
inside a single client component, so the whole thing is statically prerendered.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — theme tokens are declared with `@theme` in
  [app/globals.css](app/globals.css); there is no `tailwind.config.js`
- **Framer Motion** — screen transitions and micro-interactions
- **shadcn/ui**-style primitives (Radix + cva) in [components/ui/](components/ui/)
- **lucide-react** icons, **react-day-picker** calendar, **date-fns** formatting

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## The flow

| Step | Screen            | What happens                                                               |
| ---- | ----------------- | -------------------------------------------------------------------------- |
| 1    | `InviteScreen`    | The question. Big coral **Yes**, small tangerine **no** that dodges.        |
| 2    | `RejectionScreen` | Playful "no way" detour with a decorative heart-rate panel and a way back.  |
| 3    | `ScheduleScreen`  | Date via calendar popover (`dd/mm/yyyy`) + a named time slot.               |
| 4    | `FoodScreen`      | 2 × 3 grid of multi-select food cards.                                      |
| 5    | `SummaryScreen`   | WHEN / FOOD summary, copy-to-clipboard, and a restart link.                 |

[components/DateInviteFlow.tsx](components/DateInviteFlow.tsx) owns all of the
state (`step`, `saidYes`, `date`, `timeSlotId`, `foodIds`) and passes it down as
props. Step 2 is a detour, so it shares step 1's slot in the progress indicator
— hence 4 dots for 5 steps.

The **no** button only nudges a few pixels per hover, gives up after four
attempts, and ignores non-mouse pointers entirely, so it is always tappable on
touch and always clickable if you mean it.

## Structure

```
app/
  layout.tsx              fonts (Fraunces + Inter) and metadata
  page.tsx                renders <DateInviteFlow />
  globals.css             Tailwind import, @theme tokens, keyframes
components/
  DateInviteFlow.tsx      state + step switching + AnimatePresence
  Mascot.tsx              the haloed bird, one SVG with five moods
  FloatingHearts.tsx      background particles (fixed table, no Math.random)
  StepDots.tsx            progress indicator
  screens/                InviteScreen, RejectionScreen, ScheduleScreen,
                          FoodScreen, SummaryScreen
  ui/                     button, card, calendar, popover, select
lib/
  mock-data.ts            time slots + food options — edit copy here
  plan.ts                 date/food formatting and the clipboard text
  utils.ts                cn()
```

## Editing the content

Almost all copy that isn't a headline lives in
[lib/mock-data.ts](lib/mock-data.ts) (time slots, food options) and
[lib/plan.ts](lib/plan.ts) (the text that gets copied). Headlines and
descriptions are inline in each screen component.

## Notes

- Mobile-first: the card is capped at 420px and centered; verified with no
  horizontal overflow down to a 320px viewport.
- Clipboard uses `navigator.clipboard.writeText` with a `textarea` +
  `execCommand` fallback for non-HTTPS origins.
- All animation is wrapped by a `prefers-reduced-motion` override in
  `globals.css`.
- `components.json` is present so `npx shadcn@latest add <component>` keeps
  working for anything else you want to pull in.
- This is an independent redesign inspired by the general idea of an
  "interactive date-invite card". It copies no logo, branding, or source from any
  specific product.
