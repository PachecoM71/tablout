import SeatSlot from '../SeatSlotNew'

export default function BanquetTable({ table }) {
  const { seats } = table
  const topSeats = seats.filter(s => s.side === 'top')
  const bottomSeats = seats.filter(s => s.side === 'bottom')
  const seatCount = Math.max(topSeats.length, bottomSeats.length, 4)
  const tableW = seatCount * 56 + 32
  const tableH = 64

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-6 justify-center">
        {topSeats.map(seat => (
          <div key={seat.id} className="flex flex-col items-center">
            <SeatSlot seat={seat} tableId={table.id} />
            <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
          </div>
        ))}
      </div>

      <div className="table-surface rounded-[4px] flex flex-col items-center justify-center" style={{ width: tableW, height: tableH }}>
        <span className="font-mono text-[11px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
        <span className="font-mono text-[8px] text-[#3A3A38]/40 mt-0.5 uppercase tracking-widest">Banquet</span>
      </div>

      <div className="flex gap-6 justify-center">
        {bottomSeats.map(seat => (
          <div key={seat.id} className="flex flex-col items-center">
            <div className="w-[1px] h-2 bg-[#1A3C2B]/30" />
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
