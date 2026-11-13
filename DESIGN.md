# DESIGN.md: Wisdom Computers

Style lock for this project. Every new screen reuses these tokens; change them here first.
Logo and brand kit: see `brand/README.md`.

## Design read
Computer store, repair desk and training centre in Pratap Nagar, Jaipur. Visitors: students, govt-exam
aspirants, small offices and budget laptop buyers, mostly on phones, often on slow data.

Visual thesis: **a warm workshop store**. Cream canvas, white rounded cards, one orange banner, ink type.
Orange browses, green (WhatsApp) buys. On phones it behaves like an app (tab bar, bottom sheets, installable).

References, adapted rather than copied: ToolHub (orange banner + live stat tiles, filter sidebar, product
grid with a detail panel), Glitch (uppercase editorial headline, ghost wordmark, callout lines pinned to the
product), plus Stylo (phone tab bar, product sheet) and Onetech (category grid, promo banners, brand row).

## Tokens (semantic only; components never use raw hex)
| Token | Value | Role |
|---|---|---|
| `bg` | #f3eee7 | canvas |
| `surface` | #f7f3ed | image wells, chips, skeletons |
| `card` | #ffffff | cards, sheets |
| `ink` / `muted` | #15130f / #6d675f | text |
| `line` | #e8e0d5 | hairlines |
| `brand` / `brand-strong` | #ff7a1a / #f06a0a | banner, browse CTAs, selection (always with ink text) |
| `accent` / `accent-soft` | #b4500c / #fff0e1 | prices, icons, links, active filter rows |
| `wa` | #1a9e55 | WhatsApp: the only buy action |
| `sale` | #e5484d | saved heart, sold states |

## Shop page layout
Wide (≥1280px): filters · grid · detail panel (click a card, details appear beside the grid, no modal).
Laptop: filters · grid, details in a modal. Phone: category chips, Filters sheet with a live "Show N items" button.
Filters: category with counts, price bands (radio), condition, brands found in stock, show sold.

## Shape, depth, type
- Radius: cards 28px, inner wells 22px, pills full. Outer radius = inner radius + padding.
- Depth: soft layered shadows; hairlines only for structure.
- Type: Geist (display 500, tracking −0.035em; body 400), Geist Mono for the "01" spotlight index.

## Motion (Emil Kowalski / Jakub Krehel values)
- Press 0.96, 150ms ease-out. Hover only under `(hover: hover)`.
- Hero: staggered rise with blur on load; spotlight cross-fades every 5s and pauses on hover.
- Tabs: shared-layout pill (spring, bounce 0). Grid filtering: layout animation.
- Numbers: NumberFlow. Floating dots and orbit are decorative only.
- Everything stops under `prefers-reduced-motion`.

## Libraries
Base UI (dialogs) · Vaul (phone sheets) · cmdk (search) · Sonner (toasts) · NumberFlow · motion ·
zustand (catalog, saved items) · clsx + cva + tailwind-merge · Magic UI marquee (adapted, MIT).

## Never
Fake reviews, ratings, customer counts, warranty or delivery claims (the Google rating is the real one,
linked). Stock photos posed as the shop's goods. Brand names that aren't in stock (the brand row reads
product names). More than one lime and one green action competing in the same card.
