# Seating Planner — Design System

## Product Context

A single-page interactive seating arrangement tool for events. Users drag guests from a sidebar list onto a U-shaped table layout. Key tasks: add/remove guests, assign/unassign seats, name the event, export as PNG.

**Key Pages & Architecture:**
- Single SPA: Left sidebar (280px) + Right main canvas (flex-1, scrollable)
- Main canvas: U-shaped table visualization with draggable seat cards
- No routing, no navigation, no auth

**Key Features:**
- Drag & drop guest assignment
- Add/remove seats dynamically
- Export seating chart as PNG
- (Upcoming) LocalStorage persistence

---

## Visual Direction: Cinematic Editorial Dark

Inspired by high-end event design — think gallery openings, luxury weddings, exclusive galas. The UI should feel like a premium printed program or invitation, translated to screen. Dark matte backgrounds, warm editorial typography, restrained coral-amber accents.

---

## Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#111110` | App root, main canvas |
| Surface 1 | `#161614` | Sidebar background |
| Surface 2 | `#1C1B19` | Cards, panels, table card |
| Surface 3 | `#232320` | Elevated surfaces, input fields |
| Border subtle | `#2C2B27` | Dividers, card borders |
| Border medium | `#3D3B35` | Input borders, interactive elements |
| Text primary | `#EDE4D3` | Main headings, person names |
| Text secondary | `#A89070` | Labels, subtitles |
| Text muted | `#5E574C` | Hints, placeholder |
| Accent primary | `#C97A4E` | Coral-amber — CTAs, highlights |
| Accent hover | `#D98A5E` | Hover state for accent |
| Accent soft | `rgba(201,122,78,0.15)` | Accent backgrounds |
| Accent soft border | `rgba(201,122,78,0.3)` | Accent card borders |
| Success | `#7A9E6E` | Sage green — seated count |
| Success soft | `rgba(122,158,110,0.12)` | Success backgrounds |
| Danger | `#C0614E` | Remove, delete actions |
| Seat occupied bg | `#EDE4D3` | Warm cream for filled seats |
| Seat occupied border | `#C9BAA5` | Warm grey border |
| Seat drop highlight | `#C97A4E` | Accent when dragging over |
| Table wood dark | `#5C3018 → #3B1E0D` | Dark rich walnut table |
| Table wood light | `#7A4020` | Wood highlight |

**Person color palette** (warm, muted, editorial):
```js
const PERSON_COLORS = [
  '#C97A4E', // coral-amber (primary)
  '#8B6F5E', // warm taupe
  '#7A9E6E', // sage
  '#5E8FA8', // muted blue
  '#A06888', // dusty rose
  '#8B7E4A', // warm ochre
  '#6B8E7A', // muted teal
  '#A07050', // caramel
  '#7068A0', // muted violet
  '#9E6E6E', // muted terracotta
]
```

---

## Typography

- **Display font**: "Clash Grotesk" (load from CDN: `https://api.fontshare.com/v2/css?f[]=clash-grotesk@400,500,600,700&display=swap`)
- **Body font**: "Satoshi" (load from CDN: `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap`)
- **Fallback**: `system-ui, -apple-system, sans-serif`

### Type Scale
| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| App title | Clash Grotesk | 13px | 600 | `#EDE4D3` |
| App subtitle | Satoshi | 11px | 400 | `#5E574C` |
| Event name (input) | Clash Grotesk | 22px | 600 | `#EDE4D3` |
| Section label | Satoshi | 10px | 700 | `#5E574C`, uppercase, tracking-widest |
| Stats number | Clash Grotesk | 20px | 600 | varies |
| Person name (sidebar) | Satoshi | 13px | 500 | `#EDE4D3` |
| Person name (seat) | Satoshi | 9px | 600 | `#6B5E52` |
| Button text | Satoshi | 13px | 600 | |
| Hint / caption | Satoshi | 10px | 400 | `#5E574C` |

---

## Spacing & Layout

- Sidebar width: 272px
- Padding unit: 4px base, use multiples (4, 8, 12, 16, 20, 24, 32px)
- Border radius: 6px (inputs, small), 10px (cards, buttons), 16px (panels), 24px (table card)
- Gap between person cards in sidebar: 6px
- Seat card size: 72×72px

---

## Component Patterns

### Seat Card (occupied)
- Background: `#EDE4D3` (warm cream)
- Border: 1.5px solid `#C9BAA5`
- Shadow: `0 2px 8px rgba(0,0,0,0.4)`
- Avatar: 36×36px circle, person color background, white initial letter
- Name text: `#6B5E52`, 9px Satoshi 600, break-words
- Hover: border → `#C97A4E`, scale 1.03

### Seat Card (empty)
- Background: `rgba(28,27,25,0.6)` 
- Border: 1.5px dashed `#3D3B35`
- "+" text: `#3D3B35`, 18px
- Hover: border → `#5E574C`

### Seat Card (drag-over)
- Background: `rgba(201,122,78,0.12)`
- Border: 1.5px solid `#C97A4E`
- Scale: 1.08

### Person Card (sidebar)
- Background: `#1C1B19`
- Border: 1px solid `#2C2B27`
- Hover: border → `#3D3B35`, bg → `#232320`
- Left color bar: 3px wide, person color, rounded left
- Avatar: 32×32px circle
- Name: break-words, not truncated

### Sidebar
- Background: `#161614`
- Border-right: 1px solid `#2C2B27`
- Header section: border-bottom `#2C2B27`
- Drop zone active: `rgba(201,122,78,0.06)` bg, `rgba(201,122,78,0.2)` border

### Input
- Background: `#1C1B19`
- Border: 1px solid `#2C2B27`
- Focus border: `#C97A4E`
- Text: `#EDE4D3`
- Placeholder: `#5E574C`
- Border radius: 8px
- Padding: 10px 12px

### Button (primary)
- Background: `#C97A4E`
- Text: `#111110`
- Font: Satoshi 600
- Border radius: 8px
- Hover: `#D98A5E`

### Button (ghost/add-seat)
- Background: transparent
- Border: 1.5px dashed `#2C2B27`
- Text: `#5E574C`
- Hover: border `#5E574C`, text `#A89070`

### Stats Card
- Background: transparent
- Border: 1px solid (accent-soft-border or success-soft-border)
- Inner bg: accent/success soft
- Number: Clash Grotesk 20px, colored
- Label: 10px uppercase tracking-widest

### Table Surface
- Background: `#1C1B19`
- Border: 1px solid `#2C2B27`
- Shadow: `0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px #2C2B27`
- Border radius: 24px

### Table Arms & Bar (wood)
- Gradient: `linear-gradient(160deg, #7A4020 0%, #5C3018 50%, #3B1E0D 100%)`
- Inset shadow for depth
- Slightly more contrast wood grain feel

---

## Motion & Animation

- Transition duration: 120ms (micro), 200ms (standard)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Hover scale on seats: `scale(1.03)`
- Drag-over scale: `scale(1.08)`
- Button active: `scale(0.97)`
- List items: fade + slide-up on enter (framer motion: `{ opacity: 0, y: 8 }` → `{ opacity: 1, y: 0 }`)

---

## Special UI Patterns

### No Ellipsis Rule
All text must wrap. No `text-overflow: ellipsis` anywhere. Person names in seat cards and sidebar cards use `break-words`.

### Save Indicator
A tiny "Saved" badge in the sidebar header — appears briefly after state changes. Style: 8px dot in `#7A9E6E` + "Saved" in `#5E574C`, 10px.

### Drop Zone
When dragging a person, the sidebar drop zone should glow subtly with a `#C97A4E` ring to indicate unassign area.

### Export Button
Keep emerald/sage green for the export button — it stands out as a success/completion action: `#7A9E6E` base, solid, Clash Grotesk label.
