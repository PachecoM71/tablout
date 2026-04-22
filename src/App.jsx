import { useState, useCallback, useRef, useEffect } from 'react'
import useStore from './store/useStore'
import SidebarNew from './components/SidebarNew'
import Toolbar from './components/Toolbar'
import FloorCanvas from './components/FloorCanvas'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export default function App() {
  const [dragState, setDragState] = useState(null)
  const dragGhostRef = useRef(null)
  const isDragging = useRef(false)
  const isMobile = useIsMobile()
  const [mobilePanel, setMobilePanel] = useState('canvas') // 'canvas' | 'guests'

  const handlePointerDown = useCallback((e) => {
    const { guests, tables } = useStore.getState()

    const guestEl = e.target.closest('[data-guest-id]')
    const seatEl = e.target.closest('[data-seat-id]')

    if (guestEl) {
      const guestId = guestEl.dataset.guestId
      const guest = guests.find(g => g.id === guestId)
      if (guest) {
        isDragging.current = true
        setDragState({ type: 'guest', guestId, guest, startX: e.clientX, startY: e.clientY })
        e.preventDefault()
      }
    } else if (seatEl && !e.target.closest('.table-drag-handle') && !e.target.closest('button')) {
      const seatId = seatEl.dataset.seatId
      const tableId = seatEl.dataset.tableId
      const table = tables.find(t => t.id === tableId)
      const seat = table?.seats.find(s => s.id === seatId)
      if (seat?.person) {
        isDragging.current = true
        setDragState({ type: 'seat', seatId, tableId, person: seat.person, startX: e.clientX, startY: e.clientY })
        e.preventDefault()
      }
    }
  }, [])

  useEffect(() => {
    if (!dragState) return

    const handleMove = (e) => {
      if (dragGhostRef.current) {
        dragGhostRef.current.style.left = `${e.clientX - 20}px`
        dragGhostRef.current.style.top = `${e.clientY - 20}px`
        dragGhostRef.current.style.display = 'block'
      }
      document.querySelectorAll('.seat-highlight').forEach(el => el.classList.remove('seat-highlight'))
      const elUnder = document.elementFromPoint(e.clientX, e.clientY)
      const seatUnder = elUnder?.closest('[data-seat-id]')
      if (seatUnder) {
        seatUnder.querySelector(':scope > div')?.classList.add('seat-highlight')
      }
    }

    const handleUp = (e) => {
      const { seatGuest, unseatGuest, swapSeats } = useStore.getState()

      document.querySelectorAll('.seat-highlight').forEach(el => el.classList.remove('seat-highlight'))

      if (dragGhostRef.current) dragGhostRef.current.style.display = 'none'
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (dragGhostRef.current) dragGhostRef.current.style.display = 'block'

      const targetSeat = el?.closest('[data-seat-id]')
      const targetSidebar = el?.closest('[data-sidebar-drop]')

      if (targetSeat) {
        const targetSeatId = targetSeat.dataset.seatId
        const targetTableId = targetSeat.dataset.tableId

        if (dragState.type === 'guest') {
          seatGuest(dragState.guestId, targetTableId, targetSeatId)
        } else if (dragState.type === 'seat') {
          if (dragState.seatId !== targetSeatId) {
            swapSeats(dragState.tableId, dragState.seatId, targetTableId, targetSeatId)
          }
        }
      } else if (targetSidebar && dragState.type === 'seat') {
        unseatGuest(dragState.tableId, dragState.seatId)
      }

      isDragging.current = false
      setDragState(null)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      document.querySelectorAll('.seat-highlight').forEach(el => el.classList.remove('seat-highlight'))
    }
  }, [dragState])

  return (
    <div
      className="flex flex-col h-screen font-body text-[#3A3A38] bg-[#F5F4F0] select-none overflow-hidden"
      onPointerDown={handlePointerDown}
    >
      <Toolbar isMobile={isMobile} />

      {/* Desktop layout */}
      {!isMobile && (
        <div className="flex flex-1 overflow-hidden">
          <div data-sidebar-drop>
            <SidebarNew />
          </div>
          <FloorCanvas />
        </div>
      )}

      {/* Mobile layout */}
      {isMobile && (
        <div className="flex-1 relative overflow-hidden">
          {/* Canvas always rendered (keeps state) */}
          <div className={`absolute inset-0 flex flex-col ${mobilePanel === 'canvas' ? '' : 'pointer-events-none opacity-0'}`}>
            <FloorCanvas isMobile />
          </div>

          {/* Guest panel slides up */}
          <div
            className={`absolute inset-0 flex flex-col bg-[#F5F4F0] transition-transform duration-300 ease-out ${
              mobilePanel === 'guests' ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div data-sidebar-drop className="h-full overflow-auto">
              <SidebarNew isMobile />
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav className="h-14 border-t border-[#3A3A38]/10 bg-[#F5F4F0] flex items-center justify-around shrink-0 z-30 safe-bottom">
          <button
            onClick={() => setMobilePanel('canvas')}
            className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-[4px] transition-all ${
              mobilePanel === 'canvas' ? 'text-[#1A3C2B]' : 'text-[#3A3A38]/40'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/></svg>
            <span className="font-mono text-[9px] uppercase tracking-wider">Floor</span>
          </button>
          <button
            onClick={() => setMobilePanel('guests')}
            className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-[4px] transition-all ${
              mobilePanel === 'guests' ? 'text-[#1A3C2B]' : 'text-[#3A3A38]/40'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span className="font-mono text-[9px] uppercase tracking-wider">Guests</span>
          </button>
        </nav>
      )}

      {/* Drag ghost */}
      {dragState && (
        <div
          ref={dragGhostRef}
          className="fixed pointer-events-none z-[9999]"
          style={{ left: dragState.startX - 20, top: dragState.startY - 20, display: 'none' }}
        >
          <div
            className="w-10 h-10 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-white shadow-lg"
            style={{ backgroundColor: dragState.person?.color || dragState.guest?.color || '#1A3C2B' }}
          >
            {(dragState.person?.name || dragState.guest?.name || '?').split(' ')[0]}
          </div>
        </div>
      )}
    </div>
  )
}
