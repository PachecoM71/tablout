# Layout Components

The app is a single-page layout: a fixed left sidebar + a scrollable main canvas area.

---

## App Root Layout
- Source: `src/App.jsx`
- Description: Root layout with DnD context, sidebar on left, scrollable main content on right

```jsx
return (
  <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="flex h-screen overflow-hidden">
      <Sidebar ... />
      <main className="flex-1 overflow-auto" style={{ background: '#020617' }}>
        <div className="min-h-full flex items-center justify-center p-8">
          <UTable ... />
        </div>
      </main>
    </div>
    <DragOverlay dropAnimation={null}>
      {activePerson && (
        <div className="w-[72px] rounded-2xl border-2 border-indigo-400 bg-white shadow-2xl flex flex-col items-center justify-center gap-1.5 p-2.5 cursor-grabbing" style={{ minHeight: 72 }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow"
            style={{ backgroundColor: activePerson.color }}>
            {activePerson.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] text-slate-600 text-center leading-tight font-semibold max-w-full break-words px-0.5">
            {activePerson.name}
          </span>
        </div>
      )}
    </DragOverlay>
  </DndContext>
)
```

---

## Sidebar
- Source: `src/components/Sidebar.jsx`
- Description: Left panel — logo, stats, add-person form, unassigned people list, export button

```jsx
export default function Sidebar({ people, seatedCount, totalSeats, onAddPerson, onRemovePerson, onExport }) {
  const [name, setName] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAddPerson(trimmed)
    setName('')
  }
  const totalPeople = people.length + seatedCount

  return (
    <aside className="w-72 flex flex-col h-full shrink-0" style={{ background: '#0c1220', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo + header */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            🪑
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Seating Planner</h1>
            <p className="text-slate-500 text-xs mt-0.5">U-shape layout</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-indigo-300 text-lg font-bold leading-none">{totalPeople}</p>
            <p className="text-indigo-500 text-[10px] mt-0.5 uppercase tracking-wider">People</p>
          </div>
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-emerald-400 text-lg font-bold leading-none">{seatedCount}<span className="text-emerald-700 text-xs font-normal">/{totalSeats}</span></p>
            <p className="text-emerald-600 text-[10px] mt-0.5 uppercase tracking-wider">Seated</p>
          </div>
        </div>

        {/* Add person form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Add person..."
            className="flex-1 text-sm px-3 py-2.5 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2.5 text-white text-sm rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Add
          </button>
        </form>
      </div>

      {/* Unassigned people */}
      <div className="flex flex-col flex-1 px-4 py-4 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Unassigned</span>
          {people.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
              {people.length}
            </span>
          )}
        </div>

        <SidebarDropZone>
          <div className="flex flex-col gap-2">
            {people.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  👋
                </div>
                <p className="text-slate-600 text-xs text-center leading-relaxed">
                  Add people above,<br />then drag them to seats
                </p>
              </div>
            ) : (
              people.map(person => (
                <DraggablePersonCard key={person.id} person={person} onRemove={() => onRemovePerson(person.id)} />
              ))
            )}
          </div>
        </SidebarDropZone>
      </div>

      {/* Footer */}
      <div className="px-4 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <p className="text-slate-700 text-[10px] text-center mb-3 tracking-wide">
          Drag seated guests here to unassign
        </p>
        <button
          onClick={onExport}
          className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}
        >
          <span className="text-base">📸</span>
          Export as PNG
        </button>
      </div>
    </aside>
  )
}
```

---

## UTable (Main Canvas)
- Source: `src/components/UTable.jsx`
- Description: U-shaped table visualization — the main interactive canvas

```jsx
export default function UTable({ seats, eventName, onEventNameChange, onRemoveSeat, onAddSeat, activeDragId }) {
  const lo = seats.filter(s => s.side === 'left-outer')
  const li = seats.filter(s => s.side === 'left-inner')
  const ri = seats.filter(s => s.side === 'right-inner')
  const ro = seats.filter(s => s.side === 'right-outer')
  const bt = seats.filter(s => s.side === 'bottom')
  const seated = seats.filter(s => s.person).length

  return (
    <div
      id="u-table-export"
      className="rounded-3xl p-10 border border-white/5 select-none"
      style={{ background: '#0f172a', boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <input
          type="text"
          value={eventName}
          onChange={e => onEventNameChange(e.target.value)}
          placeholder="Event Name"
          className="bg-transparent text-center text-white text-xl font-bold tracking-tight placeholder-slate-600
            border-none outline-none focus:placeholder-slate-700 w-full"
        />
        <p className="text-slate-500 text-xs mt-1 font-medium tracking-wider uppercase">
          {seated} / {seats.length} seats filled · U-Shape Layout
        </p>
      </div>

      {/* Side labels row */}
      <div className="u-table-grid mb-1" style={{ columnGap: 10 }}>
        <div style={{ gridColumn: 1 }}><p className="text-slate-600 text-[10px] text-center uppercase tracking-widest font-semibold">Outer</p></div>
        <div style={{ gridColumn: 2, width: 68 }} />
        <div style={{ gridColumn: 3 }}><p className="text-slate-600 text-[10px] text-center uppercase tracking-widest font-semibold">Inner</p></div>
        <div style={{ gridColumn: 4 }} />
        <div style={{ gridColumn: 5 }}><p className="text-slate-600 text-[10px] text-center uppercase tracking-widest font-semibold">Inner</p></div>
        <div style={{ gridColumn: 6, width: 68 }} />
        <div style={{ gridColumn: 7 }}><p className="text-slate-600 text-[10px] text-center uppercase tracking-widest font-semibold">Outer</p></div>
      </div>

      {/* Main grid: 7 columns */}
      <div className="u-table-grid" style={{ columnGap: 10 }}>
        {/* col 1: left-outer seats */}
        {/* col 2: left table arm (brown wood) */}
        {/* col 3: left-inner seats */}
        {/* col 4: interior empty space */}
        {/* col 5: right-inner seats */}
        {/* col 6: right table arm (brown wood) */}
        {/* col 7: right-outer seats */}
        {/* row 2: bottom bar (brown wood, spans cols 2-6) */}
        {/* row 3: bottom seats (centered, spans cols 2-6) */}
      </div>
    </div>
  )
}
```
