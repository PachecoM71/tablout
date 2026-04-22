# Extractable Components

---

## Sidebar
- Source: `src/components/Sidebar.jsx`
- Category: layout
- Description: Left sidebar panel with guest management (add/remove/list people, stats, export)
- Extractable props: `people` (array), `seatedCount` (number), `totalSeats` (number)
- Hardcoded: Logo emoji 🪑, indigo gradient header, "Unassigned" label, "Export as PNG" button, green export gradient

## UTable
- Source: `src/components/UTable.jsx`
- Category: layout
- Description: Main U-shaped table visualization canvas with seats grid
- Extractable props: `seats` (array), `eventName` (string), `seated` (number)
- Hardcoded: Brown wood gradient arms, 7-column grid layout, "OUTER"/"INNER" labels, "Interior" label

## SeatSlot
- Source: `src/components/SeatSlot.jsx`
- Category: basic
- Description: Individual seat card — empty (dashed) or occupied (white card with avatar + name)
- Extractable props: `occupied` (boolean), `personName` (string), `personColor` (string), `personInitial` (string), `isOver` (boolean), `isActive` (boolean)
- Hardcoded: 72×72px fixed size, white card for occupied, dashed dark for empty, "+" for empty, red ✕ remove button on hover
