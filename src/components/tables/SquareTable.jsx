import SeatSlot from '../SeatSlotNew'

export default function SquareTable({ table }) {
  const { seats } = table
  const topSeats = seats.filter(s => s.side === 'top')
  const rightSeats = seats.filter(s => s.side === 'right')
  const bottomSeats = seats.filter(s => s.side === 'bottom')
  const leftSeats = seats.filter(s => s.side === 'left')

  // Grow table size based on max seats per side (min 2 seats → 120px)
  const maxSide = Math.max(topSeats.length, rightSeats.length, bottomSeats.length, leftSeats.length, 2)
  const size = Math.max(120, maxSide * 56 + 16)
  const seatMargin = 60 // space for seats outside the table

  return (
    <div className="relative" style={{ width: size + seatMargin * 2, height: size + seatMargin * 2 }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-6">
        {topSeats.map(seat => (
          <div key={seat.id} className="flex flex-col items-center">
            <SeatSlot seat={seat} tableId={table.id} />
            <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
          </div>
        ))}
      </div>

      <div
        className="absolute table-surface rounded-[4px] flex flex-col items-center justify-center"
        style={{ width: size, height: size, left: seatMargin, top: seatMargin }}
      >
        <span className="font-mono text-[11px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
        <span className="font-mono text-[8px] text-[#3A3A38]/40 mt-0.5 uppercase tracking-widest">Square</span>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        {rightSeats.map(seat => (
          <div key={seat.id} className="flex items-center">
            <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6">
        {bottomSeats.map(seat => (
          <div key={seat.id} className="flex flex-col items-center">
            <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        ))}
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        {leftSeats.map(seat => (
          <div key={seat.id} className="flex items-center">
            <SeatSlot seat={seat} tableId={table.id} />
            <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
          </div>
        ))}
      </div>
    </div>
  )
}
