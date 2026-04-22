import SeatSlot from '../SeatSlotNew'

export default function LShapeTable({ table }) {
  const { seats } = table
  const topSeats = seats.filter(s => s.side === 'top')
  const rightSeats = seats.filter(s => s.side === 'right')

  return (
    <div className="relative" style={{ width: 280, height: 220 }}>
      <div className="table-surface rounded-[4px]" style={{ position: 'absolute', left: 60, top: 60, width: 180, height: 48 }} />
      <div className="table-surface rounded-[4px]" style={{ position: 'absolute', right: 60, top: 60, width: 48, height: 140 }} />

      <div className="absolute" style={{ left: 90, top: 68 }}>
        <span className="font-mono text-[10px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
      </div>

      <div className="absolute flex gap-6" style={{ left: 65, top: 6 }}>
        {topSeats.map(seat => (
          <div key={seat.id} className="flex flex-col items-center">
            <SeatSlot seat={seat} tableId={table.id} />
            <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
          </div>
        ))}
      </div>

      <div className="absolute flex flex-col gap-6" style={{ right: 6, top: 65 }}>
        {rightSeats.map(seat => (
          <div key={seat.id} className="flex items-center">
            <div className="h-[1px] w-2 bg-[#1A3C2B]/30" />
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
