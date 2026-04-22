import SeatSlot from '../SeatSlotNew'

export default function UShapeTable({ table }) {
  const { seats } = table
  const leftSeats = seats.filter(s => s.side === 'left')
  const rightSeats = seats.filter(s => s.side === 'right')
  const bottomSeats = seats.filter(s => s.side === 'bottom')
  const armH = Math.max(leftSeats.length, rightSeats.length, 2) * 52 + 20

  return (
    <div className="flex flex-col items-center">
      <div className="relative p-1">
        {/* U-shape table surface */}
        <div className="flex">
          <div className="w-12 table-surface rounded-l-[4px]" style={{ height: armH }} />
          <div className="w-48 h-12 table-surface self-end" />
          <div className="w-12 table-surface rounded-r-[4px]" style={{ height: armH }} />
        </div>

        {/* Label */}
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <div className="text-center">
            <span className="font-mono text-[11px] font-bold block">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
            <span className="font-mono text-[8px] text-[#3A3A38]/40 uppercase tracking-widest">U-Shape</span>
          </div>
        </div>

        {/* Left seats */}
        <div className="absolute flex flex-col gap-4" style={{ left: -52, top: 8 }}>
          {leftSeats.map(seat => (
            <div key={seat.id} className="flex items-center">
              <SeatSlot seat={seat} tableId={table.id} />
              <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
            </div>
          ))}
        </div>

        {/* Right seats */}
        <div className="absolute flex flex-col gap-4" style={{ right: -52, top: 8 }}>
          {rightSeats.map(seat => (
            <div key={seat.id} className="flex items-center">
              <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
              <SeatSlot seat={seat} tableId={table.id} />
            </div>
          ))}
        </div>

        {/* Bottom seats */}
        <div className="absolute flex gap-8" style={{ bottom: -52, left: '50%', transform: 'translateX(-50%)' }}>
          {bottomSeats.map(seat => (
            <div key={seat.id} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
              <SeatSlot seat={seat} tableId={table.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
