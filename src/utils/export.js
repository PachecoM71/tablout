import { toPng } from 'html-to-image'

export async function exportFloorPlan(canvasElement, eventName) {
  if (!canvasElement) return

  // The inner container is the large absolute div that holds all tables
  const inner = canvasElement.querySelector('[data-floor-inner]')
  if (!inner) return

  // Collect table wrappers
  const tableEls = inner.querySelectorAll('[data-table-wrapper]')
  if (tableEls.length === 0) return

  // Compute bounding box across all tables
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  tableEls.forEach(el => {
    const left = parseFloat(el.style.left) || 0
    const top = parseFloat(el.style.top) || 0
    const w = el.offsetWidth
    const h = el.offsetHeight
    const scale = parseFloat(el.dataset.scale) || 1
    minX = Math.min(minX, left - 40)
    minY = Math.min(minY, top - 40)
    maxX = Math.max(maxX, left + w * scale + 40)
    maxY = Math.max(maxY, top + h * scale + 40)
  })

  const pad = 80
  const headerH = 60
  const captureW = maxX - minX + pad * 2
  const captureH = maxY - minY + pad * 2 + headerH

  // Save original transform
  const origTransform = inner.style.transform
  inner.style.transform = 'none'

  // Hide UI controls (resize handles, delete/duplicate buttons, context menus, footer)
  const uiEls = inner.querySelectorAll('[data-resize-handle], button, .context-menu-panel')
  uiEls.forEach(el => { el.dataset.origDisplay = el.style.display; el.style.display = 'none' })
  const footer = canvasElement.querySelector('footer')
  if (footer) footer.style.display = 'none'
  const bgOverlay = canvasElement.querySelector('.canvas-bg')
  if (bgOverlay) bgOverlay.style.display = 'none'

  // Build offscreen capture container with inline styles only (no classes)
  const wrapper = document.createElement('div')
  Object.assign(wrapper.style, {
    position: 'fixed', left: '0', top: '0',
    width: `${captureW}px`, height: `${captureH}px`,
    background: '#F5F4F0',
    backgroundImage: 'linear-gradient(to right, rgba(58,58,56,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,58,56,0.08) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    zIndex: '-1',
    overflow: 'hidden',
  })

  // Header with inline styles — use textContent to prevent XSS
  const header = document.createElement('div')
  Object.assign(header.style, {
    padding: `${pad}px ${pad}px 0 ${pad}px`,
    marginBottom: '16px', paddingBottom: '12px',
    borderBottom: '1.5px solid rgba(58,58,56,0.15)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    fontFamily: "'JetBrains Mono', monospace",
  })
  const titleEl = document.createElement('div')
  Object.assign(titleEl.style, { fontSize: '14px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3C2B' })
  titleEl.textContent = eventName || 'Floor Plan'
  const subtitleEl = document.createElement('div')
  Object.assign(subtitleEl.style, { fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(58,58,56,0.4)', textTransform: 'uppercase' })
  subtitleEl.textContent = `tablout · ${tableEls.length} Table${tableEls.length > 1 ? 's' : ''}`
  header.appendChild(titleEl)
  header.appendChild(subtitleEl)
  wrapper.appendChild(header)

  // Clone the inner floor area
  const clone = inner.cloneNode(true)
  Object.assign(clone.style, {
    position: 'relative',
    width: `${maxX - minX}px`,
    height: `${maxY - minY}px`,
    transform: 'none',
    margin: `0 ${pad}px`,
  })

  // Reposition table clones relative to bounding box
  clone.querySelectorAll('[data-table-wrapper]').forEach(el => {
    const l = parseFloat(el.style.left) || 0
    const t = parseFloat(el.style.top) || 0
    el.style.left = `${l - minX}px`
    el.style.top = `${t - minY}px`
  })

  // Remove empty state placeholder
  const emptyMsg = clone.querySelector('.pointer-events-none')
  if (emptyMsg) emptyMsg.remove()

  // Remove all hidden UI from clone too
  clone.querySelectorAll('[data-resize-handle], button, .context-menu-panel').forEach(el => el.remove())

  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  try {
    const dataUrl = await toPng(wrapper, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: '#F5F4F0',
      style: { transform: 'none' },
    })

    const link = document.createElement('a')
    link.download = `${(eventName || 'floor-plan').replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Export failed:', err)
    alert('Export failed – see console for details.')
  } finally {
    document.body.removeChild(wrapper)
    inner.style.transform = origTransform
    uiEls.forEach(el => { el.style.display = el.dataset.origDisplay || ''; delete el.dataset.origDisplay })
    if (footer) footer.style.display = ''
    if (bgOverlay) bgOverlay.style.display = ''
  }
}
