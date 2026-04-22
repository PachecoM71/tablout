// Custom top-down table shape icons with tiny seat dots

function RoundIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
      {/* seats around */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const cx = 12 + Math.cos(rad) * 10.5
        const cy = 12 + Math.sin(rad) * 10.5
        return <circle key={i} cx={cx} cy={cy} r="1.3" fill="currentColor" opacity="0.5" />
      })}
    </svg>
  )
}

function RectangleIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="7" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      {/* top seats */}
      {[8, 12, 16].map((x, i) => <circle key={`t${i}`} cx={x} cy="5" r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* bottom seats */}
      {[8, 12, 16].map((x, i) => <circle key={`b${i}`} cx={x} cy="19" r="1.3" fill="currentColor" opacity="0.5" />)}
    </svg>
  )
}

function SquareIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      {/* top */}
      {[10, 14].map((x, i) => <circle key={`t${i}`} cx={x} cy="4" r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* bottom */}
      {[10, 14].map((x, i) => <circle key={`b${i}`} cx={x} cy="20" r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* left */}
      <circle cx="4" cy="12" r="1.3" fill="currentColor" opacity="0.5" />
      {/* right */}
      <circle cx="20" cy="12" r="1.3" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

function OvalIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="6" stroke="currentColor" strokeWidth="1.5" />
      {/* seats around ellipse */}
      {[0, 50, 130, 180, 230, 310].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const cx = 12 + Math.cos(rad) * 11
        const cy = 12 + Math.sin(rad) * 8
        return <circle key={i} cx={cx} cy={cy} r="1.3" fill="currentColor" opacity="0.5" />
      })}
    </svg>
  )
}

function UShapeIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 5 L5 17 Q5 19 7 19 L17 19 Q19 19 19 17 L19 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* left seats */}
      {[8, 12, 16].map((y, i) => <circle key={`l${i}`} cx="3" cy={y} r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* right seats */}
      {[8, 12, 16].map((y, i) => <circle key={`r${i}`} cx="21" cy={y} r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* bottom seats */}
      {[9, 12, 15].map((x, i) => <circle key={`b${i}`} cx={x} cy="21" r="1.3" fill="currentColor" opacity="0.5" />)}
    </svg>
  )
}

function LShapeIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 4 L5 19 L20 19 L20 13 L11 13 L11 4 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* top seats */}
      {[7, 10].map((x, i) => <circle key={`t${i}`} cx={x} cy="2.5" r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* right seats */}
      {[15, 18].map((x, i) => <circle key={`r${i}`} cx={x} cy="21" r="1.3" fill="currentColor" opacity="0.5" />)}
    </svg>
  )
}

function BanquetIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      {/* top row */}
      {[6, 10, 14, 18].map((x, i) => <circle key={`t${i}`} cx={x} cy="5.5" r="1.3" fill="currentColor" opacity="0.5" />)}
      {/* bottom row */}
      {[6, 10, 14, 18].map((x, i) => <circle key={`b${i}`} cx={x} cy="18.5" r="1.3" fill="currentColor" opacity="0.5" />)}
    </svg>
  )
}

export const TABLE_SHAPE_ICONS = {
  round: RoundIcon,
  rectangle: RectangleIcon,
  square: SquareIcon,
  oval: OvalIcon,
  'u-shape': UShapeIcon,
  'l-shape': LShapeIcon,
  banquet: BanquetIcon,
}

export const SHAPE_LIST = [
  { id: 'round', label: 'Round' },
  { id: 'rectangle', label: 'Rect' },
  { id: 'square', label: 'Square' },
  { id: 'oval', label: 'Oval' },
  { id: 'u-shape', label: 'U-Shape' },
  { id: 'l-shape', label: 'L-Shape' },
  { id: 'banquet', label: 'Banquet' },
]
