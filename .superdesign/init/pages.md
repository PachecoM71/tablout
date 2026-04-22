# Pages

Single-page application. One route: `/`

---

## / (Seating Planner — Main Page)

Entry: `src/App.jsx`

Dependencies:
- `src/components/Sidebar.jsx`
  - (internal) `DraggablePersonCard` component
  - (internal) `SidebarDropZone` component
- `src/components/UTable.jsx`
  - `src/components/SeatSlot.jsx`
  - (internal) `AddSeatButton` component
  - (internal) `SeatsColumn` component
- `src/utils/export.js`
- `src/index.css`

**All files to pass as context for this page:**
```
src/App.jsx
src/components/Sidebar.jsx
src/components/UTable.jsx
src/components/SeatSlot.jsx
src/utils/export.js
src/index.css
```
