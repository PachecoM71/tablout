# UI Components

Framework: React 19 + Vite
CSS: Tailwind CSS v4 (utility-first)
Component Library: None (custom components)
Icons: Emoji-based (no icon library)

---

## SeatSlot
- Source: `src/components/SeatSlot.jsx`
- Description: Individual draggable/droppable seat card in the U-shaped table

```jsx
import { useDroppable, useDraggable } from '@dnd-kit/core'

export default function SeatSlot({ seat, onRemove, activeDragId }) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: seat.id })
  const { setNodeRef: setDragRef, attributes, listeners, isDragging } = useDraggable({
    id: seat.id,
    disabled: !seat.person,
  })

  const setRef = (el) => { setDropRef(el); if (seat.person) setDragRef(el) }
  const isActive = activeDragId === seat.id

  return (
    <div className="relative group/seat">
      <div
        ref={setRef}
        {...(seat.person ? { ...listeners, ...attributes } : {})}
        className={`seat-card relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 select-none
          ${isOver
            ? 'border-indigo-400 bg-indigo-50 scale-110 shadow-lg z-10'
            : seat.person
              ? 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 cursor-grab active:cursor-grabbing hover:scale-105'
              : 'border-dashed border-slate-600 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-700/40 cursor-default'
          }
          ${isActive ? 'opacity-20 scale-95' : ''}
        `}
        style={{ width: 72, minHeight: 72, padding: '10px 8px' }}
      >
        {seat.person ? (
          <>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0"
              style={{ backgroundColor: seat.person.color }}
            >
              {seat.person.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] text-slate-600 text-center leading-tight font-semibold max-w-full break-words px-0.5 w-full">
              {seat.person.name}
            </span>
          </>
        ) : (
          <span className="text-slate-500 text-xl font-light leading-none">+</span>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full text-[10px] font-bold
          items-center justify-center z-20 hidden group-hover/seat:flex transition-colors shadow-md leading-none"
        title="Remove seat"
      >
        ✕
      </button>
    </div>
  )
}
```

---

## DraggablePersonCard (inside Sidebar.jsx)
- Source: `src/components/Sidebar.jsx` (internal component)
- Description: Draggable card in sidebar representing an unassigned person

```jsx
function DraggablePersonCard({ person, onRemove }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: person.id })
  return (
    <div className="relative group/card">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing
          transition-all duration-150 hover:border-slate-600
          ${isDragging
            ? 'opacity-30'
            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
          }`}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
          style={{ backgroundColor: person.color }}
        >
          {person.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-slate-200 text-sm font-medium truncate flex-1">{person.name}</span>
        <svg className="w-3 h-3 text-slate-600 shrink-0" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 4h12v1.5H2zM2 7.25h12v1.5H2zM2 10.5h12v1.5H2z"/>
        </svg>
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-400 text-white rounded-full text-[10px]
          items-center justify-center z-10 hidden group-hover/card:flex transition-colors shadow-md font-bold"
      >
        ✕
      </button>
    </div>
  )
}
```

---

## AddSeatButton (inside UTable.jsx)
- Source: `src/components/UTable.jsx` (internal component)
- Description: Dashed button to add a new seat to a column

```jsx
function AddSeatButton({ onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-700 text-slate-600
        hover:border-slate-400 hover:text-slate-300 transition-all hover:scale-105 shrink-0 text-sm"
      style={{ width: 72, height: 32 }}
      title={label}
    >
      {icon}
    </button>
  )
}
```
