import { useRef, useState, useCallback, useEffect } from 'react'
import useStore, { getGroupColor } from '../store/useStore'
import TableRenderer from './tables/TableRenderer'
import TableContextMenu from './TableContextMenu'

export default function FloorCanvas({ isMobile = false }) {
  const { tables, guests, zoom, pan, setZoom, setPan, moveTable, scaleTable, rotateTable, duplicateTable, selectedTableId, setSelectedTable, removeTable, seatGuest } = useStore()
  const canvasRef = useRef(null)
  const floorRef = useRef(null)
  const [draggingTable, setDraggingTable] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const livePanRef = useRef({ x: pan.x, y: pan.y })
  const rafRef = useRef(null)
  const [resizing, setResizing] = useState(null)
  const [rotating, setRotating] = useState(null)
  const pinchRef = useRef(null)
  const [mobileAssignGuest, setMobileAssignGuest] = useState(null)

  // Live refs for rAF-driven drag/resize/rotate (skip React re-renders during gesture)
  const dragElRef = useRef(null)       // DOM element of dragging table
  const livePosRef = useRef({ x: 0, y: 0 })
  const liveScaleRef = useRef(1)
  const liveRotationRef = useRef(0)
  const baseRotationRef = useRef(0)    // rotation at gesture start (for resize/rotate to preserve the other)
  const baseScaleRef = useRef(1)

  // Keep livePanRef in sync when store pan changes (e.g. auto-fit)
  useEffect(() => { livePanRef.current = { x: pan.x, y: pan.y } }, [pan.x, pan.y])

  // Zoom with scroll (desktop)
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      setZoom(zoom + delta)
    }
  }, [zoom, setZoom])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Pinch-to-zoom (mobile)
  useEffect(() => {
    if (!isMobile) return
    const el = canvasRef.current
    if (!el) return

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        pinchRef.current = { startDist: Math.hypot(dx, dy), startZoom: zoom }
      }
    }
    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        const scale = dist / pinchRef.current.startDist
        setZoom(pinchRef.current.startZoom * scale)
      }
    }
    const handleTouchEnd = () => { pinchRef.current = null }

    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, zoom, setZoom])

  // Auto-fit zoom on mobile mount — center tables in viewport
  useEffect(() => {
    if (!isMobile || tables.length === 0) return
    const el = canvasRef.current
    if (!el) return
    // Only run once on initial mobile load (when zoom is default 1 and pan is 0)
    if (zoom !== 1 || pan.x !== 0 || pan.y !== 0) return

    const rect = el.getBoundingClientRect()
    // Find bounding box of all tables
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    tables.forEach(t => {
      const s = t.scale || 1
      const w = 200 * s // approximate table width
      const h = 150 * s
      minX = Math.min(minX, t.position.x)
      minY = Math.min(minY, t.position.y)
      maxX = Math.max(maxX, t.position.x + w)
      maxY = Math.max(maxY, t.position.y + h)
    })
    const contentW = maxX - minX + 80 // padding
    const contentH = maxY - minY + 80
    const fitZoom = Math.min(rect.width / contentW, rect.height / contentH, 1.5)
    const clampedZoom = Math.max(0.4, Math.min(1.5, fitZoom))
    setZoom(clampedZoom)
    setPan({ x: -minX + 40 / clampedZoom, y: -minY + 40 / clampedZoom })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  // Table dragging
  const handleTablePointerDown = useCallback((e, tableId) => {
    if (e.button !== 0) return
    if (e.target.closest('[data-seat-id]')) return
    if (e.target.closest('[data-resize-handle]')) return

    e.stopPropagation()
    const table = tables.find(t => t.id === tableId)
    if (!table) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom - pan.x
    const y = (e.clientY - rect.top) / zoom - pan.y

    // Capture DOM element for direct manipulation
    const wrapperEl = e.target.closest('[data-table-wrapper]')
    dragElRef.current = wrapperEl
    livePosRef.current = { x: table.position.x, y: table.position.y }

    setDraggingTable(tableId)
    setDragOffset({ x: x - table.position.x, y: y - table.position.y })
    setSelectedTable(tableId)
  }, [tables, zoom, pan, setSelectedTable])

  // Resize handle start
  const handleResizePointerDown = useCallback((e, tableId) => {
    e.stopPropagation()
    e.preventDefault()
    const table = tables.find(t => t.id === tableId)
    if (!table) return
    const startScale = table.scale || 1
    baseRotationRef.current = table.rotation || 0
    baseScaleRef.current = startScale
    liveScaleRef.current = startScale
    const wrapperEl = e.target.closest('[data-table-wrapper]')
    dragElRef.current = wrapperEl
    setResizing({
      tableId,
      startX: e.clientX,
      startY: e.clientY,
      startScale,
    })
    setSelectedTable(tableId)
  }, [tables, setSelectedTable])

  // Rotation handle start
  const handleRotatePointerDown = useCallback((e, tableId, tableEl) => {
    e.stopPropagation()
    e.preventDefault()
    const table = tables.find(t => t.id === tableId)
    if (!table) return
    const rect = tableEl.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    const startRotation = table.rotation || 0
    liveRotationRef.current = startRotation
    baseScaleRef.current = table.scale || 1
    const wrapperEl = e.target.closest('[data-table-wrapper]') || tableEl.closest('[data-table-wrapper]')
    dragElRef.current = wrapperEl
    setRotating({
      tableId,
      centerX,
      centerY,
      startAngle,
      startRotation,
    })
    setSelectedTable(tableId)
  }, [tables, setSelectedTable])

  const handlePointerMove = useCallback((e) => {
    if (rotating) {
      const angle = Math.atan2(e.clientY - rotating.centerY, e.clientX - rotating.centerX) * (180 / Math.PI)
      let delta = angle - rotating.startAngle
      let newRotation = rotating.startRotation + delta
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15
      }
      liveRotationRef.current = newRotation
      if (dragElRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          if (dragElRef.current) {
            dragElRef.current.style.transform = `scale(${baseScaleRef.current}) rotate(${newRotation}deg)`
          }
        })
      }
    } else if (resizing) {
      const dx = e.clientX - resizing.startX
      const dy = e.clientY - resizing.startY
      const delta = (dx + dy) / (200 / zoom)
      const newScale = Math.max(0.5, Math.min(2, resizing.startScale + delta))
      liveScaleRef.current = newScale
      if (dragElRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          if (dragElRef.current) {
            dragElRef.current.style.transform = `scale(${newScale}) rotate(${baseRotationRef.current}deg)`
          }
        })
      }
    } else if (draggingTable) {
      const rect = canvasRef.current.getBoundingClientRect()
      const lp = livePanRef.current
      const x = Math.round((e.clientX - rect.left) / zoom - lp.x - dragOffset.x)
      const y = Math.round((e.clientY - rect.top) / zoom - lp.y - dragOffset.y)
      livePosRef.current = { x, y }
      if (dragElRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          if (dragElRef.current) {
            dragElRef.current.style.left = `${x}px`
            dragElRef.current.style.top = `${y}px`
          }
        })
      }
    } else if (isPanning) {
      const dx = e.clientX - panStartRef.current.x
      const dy = e.clientY - panStartRef.current.y
      const newPan = { x: livePanRef.current.x + dx / zoom, y: livePanRef.current.y + dy / zoom }
      livePanRef.current = newPan
      panStartRef.current = { x: e.clientX, y: e.clientY }
      if (floorRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          if (floorRef.current) {
            floorRef.current.style.transform = `scale(${zoom}) translate(${newPan.x}px, ${newPan.y}px)`
          }
        })
      }
    }
  }, [rotating, resizing, draggingTable, isPanning, zoom, dragOffset])

  const handlePointerUp = useCallback(() => {
    // Commit live values to store on release (single re-render)
    if (isPanning) {
      setPan(livePanRef.current)
    }
    if (draggingTable) {
      moveTable(draggingTable, livePosRef.current)
    }
    if (resizing) {
      scaleTable(resizing.tableId, liveScaleRef.current)
    }
    if (rotating) {
      rotateTable(rotating.tableId, liveRotationRef.current)
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    dragElRef.current = null
    setDraggingTable(null)
    setIsPanning(false)
    setResizing(null)
    setRotating(null)
  }, [isPanning, draggingTable, resizing, rotating, setPan, moveTable, scaleTable, rotateTable])

  // Click anywhere on canvas background deselects table
  const handleCanvasPointerDown = useCallback((e) => {
    // Mobile tap-to-assign: if a guest is selected, tap an empty seat to assign
    if (isMobile && mobileAssignGuest) {
      const seatEl = e.target.closest('[data-seat-id]')
      if (seatEl) {
        const seatId = seatEl.dataset.seatId
        const tableId = seatEl.dataset.tableId
        const table = tables.find(t => t.id === tableId)
        const seat = table?.seats.find(s => s.id === seatId)
        if (seat && !seat.person) {
          seatGuest(mobileAssignGuest.id, tableId, seatId)
          setMobileAssignGuest(null)
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }
    }

    // If the click is NOT on a table or its children, deselect
    const isOnTable = e.target.closest('.table-wrapper') || e.target.closest('[data-seat-id]') || e.target.closest('.context-menu-panel') || e.target.closest('button') || e.target.closest('[data-resize-handle]')
    if (!isOnTable) {
      setSelectedTable(null)
    }
    // Pan: middle-click, alt+click, OR single-finger touch on mobile background
    if (e.button === 1 || (e.button === 0 && e.altKey) || (isMobile && e.button === 0 && !isOnTable)) {
      setIsPanning(true)
      panStartRef.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
  }, [setSelectedTable, isMobile, mobileAssignGuest, tables, seatGuest])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedTableId && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          removeTable(selectedTableId)
        }
      }
      if (e.key === 'Escape') {
        setSelectedTable(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedTableId, removeTable, setSelectedTable])

  const cursorStyle = rotating ? 'grabbing' : resizing ? 'nwse-resize' : isPanning ? 'grabbing' : draggingTable ? 'grabbing' : 'crosshair'

  return (
    <main
      ref={canvasRef}
      className="flex-1 blueprint-grid relative overflow-hidden"
      style={{ cursor: cursorStyle, touchAction: isMobile ? 'none' : undefined }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="canvas-bg absolute inset-0" />

      <div
        ref={floorRef}
        data-floor-inner
        className="absolute origin-top-left"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          willChange: 'transform',
          width: '4000px',
          height: '4000px',
        }}
      >
        {tables.map(table => {
          const tableScale = table.scale || 1
          const tableRotation = table.rotation || 0
          return (
            <div
              key={table.id}
              data-table-wrapper
              data-scale={tableScale}
              ref={el => { if (el) el.__tableEl = el }}
              className={`absolute group ${draggingTable === table.id ? 'z-50 opacity-80' : ''}`}
              style={{
                left: table.position.x,
                top: table.position.y,
                transform: `scale(${tableScale}) rotate(${tableRotation}deg)`,
                transformOrigin: 'center center',
                cursor: draggingTable === table.id ? 'grabbing' : 'grab',
              }}
              onPointerDown={(e) => handleTablePointerDown(e, table.id)}
            >
              <TableRenderer
                table={table}
                isSelected={selectedTableId === table.id}
                onSelect={setSelectedTable}
              />

              {/* Selected table controls */}
              {selectedTableId === table.id && (
                <>
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTable(table.id) }}
                    className="absolute -top-3 -right-3 w-6 h-6 bg-white border border-[#FF8C69]/40 text-[#FF8C69] rounded-[2px] flex items-center justify-center hover:bg-[#FF8C69] hover:text-white transition-all shadow-sm text-xs font-bold z-20"
                    title="Delete table (or press Delete key)"
                    style={{ transform: `rotate(${-tableRotation}deg)` }}
                  >
                    ×
                  </button>

                  {/* Duplicate button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateTable(table.id) }}
                    className="absolute -top-3 -left-3 w-6 h-6 bg-white border border-[#1A3C2B]/30 text-[#1A3C2B] rounded-[2px] flex items-center justify-center hover:bg-[#1A3C2B] hover:text-white transition-all shadow-sm z-20"
                    title="Duplicate table"
                    style={{ transform: `rotate(${-tableRotation}deg)` }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>

                  {/* Resize handles on all 4 corners */}
                  {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => {
                    const isTop = corner.includes('top')
                    const isLeft = corner.includes('left')
                    return (
                      <div
                        key={corner}
                        data-resize-handle
                        className="absolute w-3 h-3 bg-white border-2 border-[#1A3C2B] rounded-full z-10 hover:bg-[#1A3C2B] hover:scale-125 transition-all"
                        style={{
                          [isTop ? 'top' : 'bottom']: -6,
                          [isLeft ? 'left' : 'right']: -6,
                          cursor: 'nwse-resize',
                        }}
                        onPointerDown={(e) => handleResizePointerDown(e, table.id)}
                      />
                    )
                  })}

                  {/* Rotation handle — circle above center with a line */}
                  <div
                    data-resize-handle
                    className="absolute left-1/2 z-10 flex flex-col items-center"
                    style={{ top: -44, transform: `translateX(-50%) rotate(${-tableRotation}deg)` }}
                    onPointerDown={(e) => {
                      const tableEl = e.target.closest('.group')
                      handleRotatePointerDown(e, table.id, tableEl)
                    }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-[#FF8C69] bg-white flex items-center justify-center cursor-grab hover:bg-[#FF8C69] hover:scale-110 transition-all group/rot">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#FF8C69] group-hover/rot:text-white">
                        <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.4 2.6" /><path d="M21 3v6h-6" />
                      </svg>
                    </div>
                    <div className="w-[1px] h-3 bg-[#FF8C69]/40" />
                  </div>

                  {/* Scale/rotation indicator */}
                  {(tableScale !== 1 || tableRotation !== 0) && (
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-mono text-[8px] text-[#3A3A38]/40 whitespace-nowrap" style={{ transform: `translateX(-50%) rotate(${-tableRotation}deg)` }}>
                      {tableScale !== 1 && `${Math.round(tableScale * 100)}%`}
                      {tableScale !== 1 && tableRotation !== 0 && ' · '}
                      {tableRotation !== 0 && `${Math.round(tableRotation)}°`}
                    </div>
                  )}

                  {/* Context menu — counter-rotate so it stays upright */}
                  <div style={{ transform: `rotate(${-tableRotation}deg)` }}>
                    <TableContextMenu table={table} />
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* Empty state */}
        {tables.length === 0 && (
          <div className="absolute left-[400px] top-[300px] flex flex-col items-center gap-4 opacity-25 pointer-events-none">
            <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="7" fill="none" stroke="#3A3A38" strokeWidth="1.5"/><circle cx="16" cy="7" r="2" fill="#3A3A38"/><circle cx="22.4" cy="10.3" r="2" fill="#3A3A38"/><circle cx="22.4" cy="21.7" r="2" fill="#3A3A38"/><circle cx="16" cy="25" r="2" fill="#3A3A38"/><circle cx="9.6" cy="21.7" r="2" fill="#3A3A38"/><circle cx="9.6" cy="10.3" r="2" fill="#3A3A38"/>
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#3A3A38] text-center">
              Select a shape above<br />then click "+ Add Table"
            </p>
          </div>
        )}
      </div>

      {/* Status bar */}
      {!isMobile && (
      <footer className="absolute bottom-0 left-0 right-0 h-7 border-t border-[#3A3A38]/10 px-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-[#3A3A38]/40 shrink-0 bg-[#F5F4F0] z-10">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#9EFFBF] rounded-full animate-pulse" />
            <span>ENGINE_STATUS: STABLE</span>
          </div>
          <span>TABLES: {tables.length}</span>
          <span>VIEW: ORTHOGRAPHIC</span>
        </div>
        <div className="flex gap-6 items-center">
          <span>⌘+SCROLL ZOOM · ALT+DRAG PAN · DEL REMOVE · DRAG CORNERS TO RESIZE</span>
        </div>
      </footer>
      )}

      {/* Mobile: unassigned guest strip */}
      {isMobile && (() => {
        const unseated = guests.filter(g => !tables.some(t => t.seats.some(s => s.person?.id === g.id)))
        if (unseated.length === 0) return null
        return (
          <div className="absolute bottom-0 left-0 right-0 bg-[#F5F4F0]/95 border-t border-[#3A3A38]/10 z-20 backdrop-blur-sm">
            {mobileAssignGuest && (
              <div className="px-3 py-1.5 bg-[#1A3C2B]/5 font-mono text-[9px] uppercase tracking-wider text-[#1A3C2B] text-center">
                Tap an empty seat to assign <strong>{mobileAssignGuest.name.split(' ')[0]}</strong>
                <button onClick={() => setMobileAssignGuest(null)} className="ml-2 text-[#FF8C69] font-bold">✕</button>
              </div>
            )}
            <div className="flex gap-2 px-3 py-2 overflow-x-auto">
              {unseated.map(g => {
                const isActive = mobileAssignGuest?.id === g.id
                const groupColor = g.group ? getGroupColor(g.group) : null
                return (
                  <button
                    key={g.id}
                    onClick={() => setMobileAssignGuest(isActive ? null : g)}
                    className={`shrink-0 h-10 px-3 rounded-[4px] flex items-center gap-1.5 text-[10px] font-medium transition-all ${
                      isActive
                        ? 'ring-2 ring-[#1A3C2B] bg-[#1A3C2B]/10'
                        : 'bg-white border border-[#3A3A38]/10'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-[2px] flex items-center justify-center text-white text-[8px] font-bold shrink-0" style={{ backgroundColor: g.color }}>
                      {g.name[0]}
                    </div>
                    <span className="whitespace-nowrap">{g.name.split(' ')[0]}</span>
                    {groupColor && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: groupColor }} />}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}
    </main>
  )
}
