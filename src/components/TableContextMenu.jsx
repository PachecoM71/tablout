import { useState } from 'react'
import useStore from '../store/useStore'
import { Plus, Minus, Pencil, Check, RotateCw, RotateCcw } from 'lucide-react'
import { TABLE_SHAPE_ICONS, SHAPE_LIST } from './TableShapeIcons'

const SHAPES = SHAPE_LIST

function getSidesForShape(shape) {
  switch (shape) {
    case 'round': return [{ key: 'around', label: 'Seats' }]
    case 'oval': return [{ key: 'around', label: 'Seats' }]
    case 'rectangle': return [{ key: 'top', label: 'Top' }, { key: 'right', label: 'Right' }, { key: 'bottom', label: 'Bottom' }, { key: 'left', label: 'Left' }]
    case 'square': return [{ key: 'top', label: 'Top' }, { key: 'right', label: 'Right' }, { key: 'bottom', label: 'Bottom' }, { key: 'left', label: 'Left' }]
    case 'u-shape': return [{ key: 'left', label: 'Left' }, { key: 'right', label: 'Right' }, { key: 'bottom', label: 'Bottom' }]
    case 'l-shape': return [{ key: 'top', label: 'Top' }, { key: 'right', label: 'Right' }]
    case 'banquet': return [{ key: 'top', label: 'Top' }, { key: 'bottom', label: 'Bottom' }]
    default: return []
  }
}

export default function TableContextMenu({ table }) {
  const { renameTable, addSeatToTable, removeSeatFromTable, changeTableShape, rotateTable } = useStore()
  const [isRenaming, setIsRenaming] = useState(false)
  const [labelDraft, setLabelDraft] = useState(table.label)

  const sides = getSidesForShape(table.shape)

  const seatCountBySide = (sideKey) => {
    if (sideKey === 'around') return table.seats.length
    return table.seats.filter(s => s.side === sideKey).length
  }

  const handleRemoveSeat = (sideKey) => {
    const candidates = sideKey === 'around'
      ? table.seats
      : table.seats.filter(s => s.side === sideKey)
    if (candidates.length === 0) return
    const last = candidates[candidates.length - 1]
    removeSeatFromTable(table.id, last.id)
  }

  const handleAddSeat = (sideKey) => {
    addSeatToTable(table.id, sideKey === 'around' ? undefined : sideKey)
  }

  const handleRenameSubmit = (e) => {
    e.preventDefault()
    const trimmed = labelDraft.trim()
    if (trimmed) renameTable(table.id, trimmed)
    setIsRenaming(false)
  }

  return (
    <div
      className="context-menu-panel absolute left-1/2 -translate-x-1/2 z-40"
      style={{ top: '100%', marginTop: 12 }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white border border-[#3A3A38]/10 rounded-[4px] shadow-lg p-4 min-w-[220px] space-y-4">
        {/* Rename */}
        <div>
          {isRenaming ? (
            <form onSubmit={handleRenameSubmit} className="flex gap-1">
              <input
                autoFocus
                type="text"
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                onBlur={handleRenameSubmit}
                className="flex-1 bg-[#F5F4F0] border border-[#3A3A38]/15 px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-[#1A3C2B] rounded-sm"
              />
              <button type="submit" className="w-6 h-6 flex items-center justify-center text-[#1A3C2B] hover:bg-[#1A3C2B]/10 rounded-sm">
                <Check size={12} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => { setLabelDraft(table.label); setIsRenaming(true) }}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#3A3A38]/60 hover:text-[#3A3A38] transition-colors w-full"
            >
              <Pencil size={10} />
              <span className="truncate">{table.label}</span>
            </button>
          )}
        </div>

        {/* Shape switcher */}
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#3A3A38]/35 block mb-1.5">Shape</span>
          <div className="flex flex-wrap gap-1">
            {SHAPES.map(({ id, label }) => {
              const Icon = TABLE_SHAPE_ICONS[id]
              return (
                <button
                  key={id}
                  onClick={() => changeTableShape(table.id, id)}
                  className={`w-7 h-7 flex items-center justify-center rounded-sm border transition-all ${
                    table.shape === id
                      ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                      : 'border-[#3A3A38]/10 text-[#3A3A38]/50 hover:border-[#3A3A38]/30 hover:text-[#3A3A38]'
                  }`}
                  title={label}
                >
                  <Icon size={16} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Rotation */}
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#3A3A38]/35 block mb-1.5">Rotation</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => rotateTable(table.id, (table.rotation || 0) - 45)}
              className="w-7 h-7 flex items-center justify-center border border-[#3A3A38]/10 rounded-sm text-[#3A3A38]/50 hover:border-[#3A3A38]/30 hover:text-[#3A3A38] transition-all"
              title="Rotate -45°"
            >
              <RotateCcw size={13} />
            </button>
            <span className="font-mono text-[11px] font-bold text-[#3A3A38] flex-1 text-center">
              {Math.round(((table.rotation || 0) % 360 + 360) % 360)}°
            </span>
            <button
              onClick={() => rotateTable(table.id, (table.rotation || 0) + 45)}
              className="w-7 h-7 flex items-center justify-center border border-[#3A3A38]/10 rounded-sm text-[#3A3A38]/50 hover:border-[#3A3A38]/30 hover:text-[#3A3A38] transition-all"
              title="Rotate +45°"
            >
              <RotateCw size={13} />
            </button>
            <button
              onClick={() => rotateTable(table.id, 0)}
              className="font-mono text-[9px] text-[#3A3A38]/35 hover:text-[#FF8C69] transition-colors"
              title="Reset rotation"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Seat controls per side */}
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#3A3A38]/35 block mb-1.5">Seats</span>
          <div className="space-y-1.5">
            {sides.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#3A3A38]/60 w-14">{label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRemoveSeat(key)}
                    disabled={seatCountBySide(key) === 0}
                    className="w-5 h-5 flex items-center justify-center border border-[#3A3A38]/10 rounded-sm text-[#3A3A38]/50 hover:bg-[#FF8C69]/10 hover:text-[#FF8C69] hover:border-[#FF8C69]/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="font-mono text-[11px] font-bold text-[#3A3A38] w-5 text-center">
                    {seatCountBySide(key)}
                  </span>
                  <button
                    onClick={() => handleAddSeat(key)}
                    className="w-5 h-5 flex items-center justify-center border border-[#3A3A38]/10 rounded-sm text-[#3A3A38]/50 hover:bg-[#1A3C2B]/10 hover:text-[#1A3C2B] hover:border-[#1A3C2B]/30 transition-all"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-[#3A3A38]/5 pt-2 flex justify-between items-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#3A3A38]/35">Total</span>
          <span className="font-mono text-[11px] font-bold text-[#1A3C2B]">{table.seats.length} seats</span>
        </div>
      </div>
    </div>
  )
}
