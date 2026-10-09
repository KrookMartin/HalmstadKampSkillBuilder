# DESIGN.md – Halmstad Kampsport klubbapp

Visual reference for the PWA. Dark, mobile-first, built around the club's red.
UI text is Swedish; code and comments are English (see CLAUDE.md).
The screens are mocked up on the design canvas; the screenshots in `design/` are the source of truth for layout. This file is the source of truth for tokens.

## Tokens (Tailwind)

```ts
// tailwind.config.ts → theme.extend
colors: {
  ink:        '#0F0F10', // app background
  surface:    '#1A1A1C', // cards, inputs
  'surface-2':'#242427', // icon buttons, thumbnails
  line:       '#2A2A2E', // dividers (list rows, nav border)
  'line-strong': '#3A3A3F', // input and chip borders
  text:       '#F3F1ED',
  'text-soft':'#D6D3CD',
  muted:      '#A8A59F', // secondary text (passes 4.5:1 on surface)
  faint:      '#6E6B66', // list numbers only, never body text
  red:        '#C92E2E', // fills, primary buttons (white text on it = 5.4:1)
  'red-text': '#FF7468', // red used as TEXT or icon on dark
},
borderRadius: { control: '10px', card: '12px' }, // chips use rounded-full
fontFamily: {
  display: ['var(--font-barlow-condensed)', 'sans-serif'],
  sans:    ['var(--font-barlow)', 'system-ui', 'sans-serif'],
},
```

Load fonts with `next/font/google`: Barlow Condensed (600, 700) and Barlow (400, 500, 600).
Do not add other fonts.

Logo brand red is slightly brighter than `red` above. Keep `red` unless told to match the logo.

## Typography

- **Display** (Barlow Condensed 700, uppercase): page titles 52px/0.9 line-height (Idag hero 68px), section headings 24px with 0.04em tracking, list numbers 30–34px.
- **Eyebrow**: Barlow 600, 13px, uppercase, 0.12em tracking, `red-text`.
- **Body**: Barlow 16px/1.45. List titles 16–17px 600. Meta lines 13px `muted`.
- Never use Inter, Roboto or Arial.

## Components

- **Screen shell**: full-height flex column. Header, scrolling `<main>`, bottom nav. Page padding 20px sides.
- **Bottom nav**: 3 tabs for members (Idag, Tekniker, Styrka), 3 for coaches (Pass, Arkiv, Styrka). Each tab min 56px tall, 24px stroke icon, 12px label. Active = `text` label and `red-text` icon. Inactive = `muted`.
- **List row**: min 64–80px, divider `line` below, no card background. Title + meta on the left, 44px circular play button or chevron on the right.
- **Chip**: pill, 12–14px 600 uppercase for tags. Selected = `red` fill with white text. Unselected = 1px `line-strong` border. Filter chips are buttons, min 44px tall.
- **Primary button**: `red`, white text, 54px tall, radius 10–12px. One per screen.
- **Secondary button**: 1px `line-strong` border, transparent.
- **Note card** ("Tränarens fokus"): `surface`, radius 12, small uppercase label in `muted`.
- **Inputs**: 52px tall, `surface`, 1px `line-strong`, visible `<label>`. Focus ring 2px `red-text`.
- **Progress** (peak program): 8 segments, 8px tall, past `faint`, current `red`, future `line`.
- **Video fallback**: same 16:9 box as the player, warning icon in `red-text`, "Videon går inte att spela", a link to open on YouTube.
- Tap targets ≥ 44px everywhere. Icons: inline stroke SVG, 1.9px stroke, rounded caps. No emoji.
- Use real `<button>` and `<a>`, labels on icon-only buttons, and `aria-current="page"` on the active tab.

## Screens → routes

| Mockup | Route |
|---|---|
| Idag (today's session) | `(member)/idag` |
| Logga in (magic link, logo on top) | `(auth)/login` |
| Tekniker (search + position filter) | `(member)/tekniker` |
| Teknik och video | technique detail, opened from Idag and Tekniker |
| Styrka (Grundprogram / Toppning tabs) | `(member)/styrka` |
| Passbyggare (reorder, add, publish) | `(coach)/pass` |

Not yet designed: admin member approval, technique editor (coach), S&C editor, pending-account screen. Follow the patterns above when building them.

## Notes

- Mockup content (technique names, S&C passes A/B/C, coach notes) is example text, not real data.
- The mockup's "HK" badge is a placeholder; use `public/logo.png` (the club badge, transparent background).
- Reorder in Passbyggare uses up/down buttons on purpose (reliable on phones). Don't replace it with drag-and-drop without asking.
