import SeatSlot from '../SeatSlotNew'

export default function RoundTable({ table }) {
  const { seats } = table
  const count = seats.length
  const radius = Math.max(90, count * 12)
  const seatRadius = radius + 36

  return (
    <div className="relative" style={{ width: radius * 2 + 80, height: radius * 2 + 80 }}>
      <div
        className="absolute rounded-full table-surface flex flex-col items-center justify-center"
        style={{ width: radius * 2, height: radius * 2, left: 40, top: 40 }}
      >
        <span className="font-mono text-[11px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
        <span className="font-mono text-[8px] text-[#3A3A38]/40 mt-1 uppercase tracking-widest">Round</span>
      </div>

      {seats.map((seat, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * seatRadius + radius + 40 - 20
        const y = Math.sin(angle) * seatRadius + radius + 40 - 20
        return (
          <div key={seat.id} className="absolute" style={{ left: x, top: y }}>
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        )
      })}
    </div>
  )
}
