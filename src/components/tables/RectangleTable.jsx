import SeatSlot from '../SeatSlotNew'

export default function RectangleTable({ table }) {
  const { seats } = table
  const topSeats = seats.filter(s => s.side === 'top')
  const bottomSeats = seats.filter(s => s.side === 'bottom')
  const leftSeats = seats.filter(s => s.side === 'left')
  const rightSeats = seats.filter(s => s.side === 'right')
  const horizCount = Math.max(topSeats.length, bottomSeats.length, 3)
  const vertCount = Math.max(leftSeats.length, rightSeats.length, 0)
  const tableW = horizCount * 56 + 32
  const tableH = vertCount > 0 ? Math.max(100, vertCount * 56 + 32) : 100

  return (
    <div className="flex items-center gap-2">
      {/* Left seats */}
      {leftSeats.length > 0 && (
        <div className="flex flex-col gap-6 justify-center">
          {leftSeats.map(seat => (
            <div key={seat.id} className="flex items-center">
              <SeatSlot seat={seat} tableId={table.id} />
              <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-2">
        {/* Top seats */}
        <div className="flex gap-6 justify-center">
          {topSeats.map(seat => (
            <div key={seat.id} className="flex flex-col items-center">
              <SeatSlot seat={seat} tableId={table.id} />
              <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
            </div>
          ))}
        </div>

        {/* Table surface */}
        <div className="table-surface rounded-[4px] flex flex-col items-center justify-center" style={{ width: tableW, height: tableH }}>
          <span className="font-mono text-[11px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
          <span className="font-mono text-[8px] text-[#3A3A38]/40 mt-0.5 uppercase tracking-widest">Rectangle</span>
        </div>

        {/* Bottom seats */}
        <div className="flex gap-6 justify-center">
          {bottomSeats.map(seat => (
            <div key={seat.id} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
              <SeatSlot seat={seat} tableId={table.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Right seats */}
      {rightSeats.length > 0 && (
        <div className="flex flex-col gap-6 justify-center">
          {rightSeats.map(seat => (
            <div key={seat.id} className="flex items-center">
              <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
              <SeatSlot seat={seat} tableId={table.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
