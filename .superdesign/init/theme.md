# Theme & Design Tokens

Framework: Tailwind CSS v4 (imported via `@import "tailwindcss"` — no config file)
Custom CSS: `src/index.css`

---

## `src/index.css` (full content)

```css
@import "tailwindcss";

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #020617;
  min-height: 100vh;
}

#root { min-height: 100vh; }

.u-table-grid {
  display: grid;
  grid-template-columns: auto auto auto minmax(160px, 1fr) auto auto auto;
  column-gap: 10px;
  row-gap: 0;
}

.table-arm {
  background: linear-gradient(160deg, #b45309 0%, #92400e 55%, #78350f 100%);
  box-shadow: inset 2px 0 8px rgba(0,0,0,0.2), inset -2px 0 8px rgba(0,0,0,0.1);
}

.table-bar {
  background: linear-gradient(180deg, #92400e 0%, #78350f 60%, #6c2d10 100%);
  box-shadow: inset 0 -3px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4);
}

.seat-card {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background (app) | `#020617` | Main canvas background (slate-950) |
| Background (sidebar) | `#0c1220` | Left sidebar |
| Background (card) | `#0f172a` | Table card, dark panels |
| Border (subtle) | `rgba(255,255,255,0.06)` | Dividers |
| Text (primary) | `#ffffff` | Headings |
| Text (secondary) | `#94a3b8` (slate-400) | Labels |
| Text (muted) | `#475569` (slate-600) | Hints |
| Accent (primary) | `#6366f1` | Indigo — primary actions |
| Accent (secondary) | `#8b5cf6` | Violet — gradients |
| Success | `#10b981` | Emerald — seated count, export |
| Danger | `#ef4444` | Red — remove buttons |
| Table wood | `#b45309 → #78350f` | Amber/brown gradient |
| Seat (occupied) | `#ffffff` bg, `#e2e8f0` border | White card |
| Seat (empty) | `#1e293b/55%` bg, dashed `#475569` border | Dark dashed |
| Seat (hover/drop) | `#eef2ff` bg, `#6366f1` border | Indigo highlight |

---

## Person Colors (10-color palette)
```js
const PERSON_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#ef4444', // red
  '#84cc16', // lime
]
```

---

## Typography
- Font: `system-ui, -apple-system, sans-serif` (no custom web font)
- Title: `text-xl font-bold` (event name input)
- Section labels: `text-xs font-semibold uppercase tracking-wider`
- Stats numbers: `text-lg font-bold`
- Person name in seat: `text-[10px] font-semibold`
- Person name in sidebar: `text-sm font-medium`
- Hint text: `text-[10px] tracking-wide`

---

## Spacing & Sizing
- Sidebar width: `w-72` (288px)
- Seat card: 72×72px (min-height)
- Table arm width: 68px
- Interior min-width: 160px
- Border radius: `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px)

---

## Shadows & Elevation
- Table card: `0 32px 80px rgba(0,0,0,0.8)` — deep floating shadow
- Export button: `0 4px 20px rgba(16,185,129,0.3)` — colored glow
- Seat occupied: `shadow-sm hover:shadow-md`
- Seat drag overlay: `shadow-2xl`

---

## No `tailwind.config.js` — using Tailwind v4 with CSS `@import`
Tailwind v4 does not require a config file. All customization is via CSS variables and utility classes directly.
