import { useState } from 'react'
import useStore from '../store/useStore'
import { Download, Plus, MoreHorizontal, Heart } from 'lucide-react'
import { exportFloorPlan } from '../utils/export'
import { TABLE_SHAPE_ICONS, SHAPE_LIST } from './TableShapeIcons'

const SHAPES = SHAPE_LIST
const BMC_URL = 'https://buymeacoffee.com/henmar28'

export default function Toolbar({ isMobile = false }) {
  const { activeShape, setActiveShape, zoom, setZoom, autoAssign, resetAll, eventName, setEventName } = useStore()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showShapePicker, setShowShapePicker] = useState(false)

  const handleAddTable = () => {
    const { addTable } = useStore.getState()
    const x = isMobile ? 50 + Math.random() * 150 : 200 + Math.random() * 300
    const y = isMobile ? 50 + Math.random() * 150 : 200 + Math.random() * 200
    addTable(activeShape, { x, y })
    setShowShapePicker(false)
  }

  if (isMobile) {
    const ActiveIcon = TABLE_SHAPE_ICONS[activeShape]
    return (
      <header className="border-b border-[#3A3A38]/10 bg-[#F5F4F0] z-20 shrink-0">
        <div className="h-12 flex items-center justify-between px-3 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 shrink-0">
              <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#1A3C2B"/><circle cx="16" cy="16" r="7" fill="none" stroke="#F5F4F0" strokeWidth="1.5"/><circle cx="16" cy="7" r="2" fill="#FF8C69"/><circle cx="22.4" cy="10.3" r="2" fill="#FF8C69"/><circle cx="22.4" cy="21.7" r="2" fill="#9EFFBF"/><circle cx="16" cy="25" r="2" fill="#9EFFBF"/><circle cx="9.6" cy="21.7" r="2" fill="#F5F4F0" opacity="0.6"/><circle cx="9.6" cy="10.3" r="2" fill="#F5F4F0" opacity="0.6"/></svg>
            </div>
            <span className="font-display text-[13px] font-bold text-[#1A3C2B] tracking-tight">tablout</span>
          </div>

          {/* Event name */}
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Floor Plan"
            className="font-mono text-[11px] tracking-tight font-bold uppercase bg-transparent border-none outline-none text-[#3A3A38] placeholder:text-[#3A3A38]/30 flex-1 min-w-0"
          />

          {/* Add table (with shape picker) */}
          <div className="relative">
            <button
              onClick={() => setShowShapePicker(!showShapePicker)}
              className="h-9 px-3 flex items-center gap-1.5 border border-[#1A3C2B] text-[#1A3C2B] rounded-[2px] font-mono text-[9px] uppercase tracking-wider"
            >
              <ActiveIcon size={16} />
              <Plus size={14} />
            </button>
            {showShapePicker && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowShapePicker(false)} />
                <div className="absolute right-0 top-11 bg-white border border-[#3A3A38]/10 rounded-[4px] shadow-lg z-40 p-2 w-[200px]">
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {SHAPES.map(({ id, label }) => {
                      const Icon = TABLE_SHAPE_ICONS[id]
                      return (
                        <button
                          key={id}
                          onClick={() => setActiveShape(id)}
                          className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition-all ${
                            activeShape === id ? 'bg-[#1A3C2B] text-white' : 'text-[#3A3A38]/50 hover:bg-[#3A3A38]/5'
                          }`}
                          title={label}
                        >
                          <Icon size={22} />
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={handleAddTable}
                    className="w-full py-2.5 bg-[#1A3C2B] text-white rounded-[2px] font-mono text-[10px] uppercase tracking-widest"
                  >
                    + Add Table
                  </button>
                </div>
              </>
            )}
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-9 h-9 flex items-center justify-center text-[#3A3A38]/50 border border-[#3A3A38]/15 rounded-[2px]"
            >
              <MoreHorizontal size={18} />
            </button>
            {showMobileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMobileMenu(false)} />
                <div className="absolute right-0 top-11 bg-white border border-[#3A3A38]/10 rounded-[4px] shadow-lg z-40 py-1 min-w-[160px]">
                  <button
                    onClick={() => { autoAssign(); setShowMobileMenu(false) }}
                    className="w-full px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-[#FF8C69] hover:bg-[#FF8C69]/5"
                  >
                    Auto Seat
                  </button>
                  <button
                    onClick={() => {
                      const canvas = document.querySelector('.blueprint-grid')
                      exportFloorPlan(canvas, eventName)
                      setShowMobileMenu(false)
                    }}
                    className="w-full px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-[#1A3C2B] hover:bg-[#1A3C2B]/5 flex items-center gap-2"
                  >
                    <Download size={12} /> Export PNG
                  </button>
                  <div className="border-t border-[#3A3A38]/5 my-1" />
                  <button
                    onClick={() => { resetAll(); setShowMobileMenu(false) }}
                    className="w-full px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-[#3A3A38]/40 hover:text-[#FF8C69]"
                  >
                    Reset All
                  </button>
                  <div className="border-t border-[#3A3A38]/5 my-1" />
                  <a
                    href={BMC_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-[#FF8C69] hover:bg-[#FF8C69]/5 flex items-center gap-2"
                  >
                    <Heart size={12} /> Support tablout
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    )
  }

  // Desktop toolbar
  return (
    <header className="h-14 border-b border-[#3A3A38]/10 flex items-center justify-between px-3 xl:px-6 shrink-0 bg-[#F5F4F0] z-20">
      <div className="flex items-center gap-3 xl:gap-8">
        <div className="flex items-center gap-2 xl:gap-3">
          <div className="w-8 h-8 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#1A3C2B"/><circle cx="16" cy="16" r="7" fill="none" stroke="#F5F4F0" strokeWidth="1.5"/><circle cx="16" cy="7" r="2" fill="#FF8C69"/><circle cx="22.4" cy="10.3" r="2" fill="#FF8C69"/><circle cx="22.4" cy="21.7" r="2" fill="#9EFFBF"/><circle cx="16" cy="25" r="2" fill="#9EFFBF"/><circle cx="9.6" cy="21.7" r="2" fill="#F5F4F0" opacity="0.6"/><circle cx="9.6" cy="10.3" r="2" fill="#F5F4F0" opacity="0.6"/></svg>
          </div>
          <span className="font-display text-[15px] font-bold text-[#1A3C2B] tracking-tight mr-1">tablout</span>
          <div className="w-px h-5 bg-[#3A3A38]/10" />
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Untitled Floor Plan"
            className="font-mono text-[11px] tracking-tight font-bold uppercase bg-transparent border-none outline-none text-[#3A3A38] placeholder:text-[#3A3A38]/30 w-28 xl:w-48 min-w-0"
          />
        </div>

        <div className="flex border border-[#3A3A38]/20 rounded-[4px] overflow-hidden shrink-0">
          {SHAPES.map(({ id, label }) => {
            const Icon = TABLE_SHAPE_ICONS[id]
            return (
              <button
                key={id}
                onClick={() => setActiveShape(id)}
                className={`segmented-btn ${activeShape === id ? 'active' : 'text-[#3A3A38]/60'}`}
                title={label}
              >
                <Icon size={20} />
              </button>
            )
          })}
        </div>

        <button
          onClick={handleAddTable}
          className="px-3 xl:px-5 py-2 border border-[#1A3C2B] text-[#1A3C2B] rounded-[2px] font-mono text-[10px] uppercase tracking-wider xl:tracking-widest hover:bg-[#1A3C2B] hover:text-white transition-all whitespace-nowrap shrink-0"
        >
          + Add Table
        </button>
      </div>

      <div className="flex items-center gap-3 xl:gap-6">
        <div className="flex items-center gap-1.5 xl:gap-2 border-r border-[#3A3A38]/10 pr-3 xl:pr-6 h-8">
          <button onClick={() => setZoom(zoom - 0.1)} className="w-7 h-7 border border-[#3A3A38]/20 rounded-[2px] flex items-center justify-center text-[#3A3A38]/60 hover:bg-[#3A3A38]/5 font-mono text-xs">−</button>
          <span className="font-mono text-[11px] w-10 xl:w-12 text-center font-bold">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)} className="w-7 h-7 border border-[#3A3A38]/20 rounded-[2px] flex items-center justify-center text-[#3A3A38]/60 hover:bg-[#3A3A38]/5 font-mono text-xs">+</button>
        </div>

        <button
          onClick={autoAssign}
          className="px-3 xl:px-5 py-2 border border-[#FF8C69] text-[#FF8C69] rounded-[2px] font-mono text-[10px] uppercase tracking-wider xl:tracking-widest hover:bg-[#FF8C69] hover:text-white transition-all whitespace-nowrap shrink-0"
        >
          Auto Seat
        </button>

        <button
          onClick={() => {
            const canvas = document.querySelector('.blueprint-grid')
            exportFloorPlan(canvas, eventName)
          }}
          className="px-3 xl:px-6 py-2 bg-[#1A3C2B] text-white rounded-[2px] font-mono text-[10px] xl:text-[11px] uppercase tracking-wider xl:tracking-widest hover:bg-[#254d38] transition-all flex items-center gap-1.5 xl:gap-2 whitespace-nowrap shrink-0"
        >
          <Download size={13} />
          Export
        </button>

        <button
          onClick={resetAll}
          className="font-mono text-[10px] text-[#3A3A38]/40 uppercase tracking-wider xl:tracking-widest hover:text-[#FF8C69] transition-all shrink-0"
        >
          Reset
        </button>

        <a
          href={BMC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 xl:px-4 py-2 border border-[#FF8C69]/30 text-[#FF8C69] rounded-[2px] font-mono text-[10px] uppercase tracking-wider hover:bg-[#FF8C69] hover:text-white transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          title="Support tablout"
        >
          <Heart size={12} />
          <span className="hidden xl:inline">Support</span>
        </a>
      </div>
    </header>
  )
}
