import SeatSlot from '../SeatSlotNew'

export default function OvalTable({ table }) {
  const { seats } = table
  const count = seats.length
  const rx = Math.max(110, count * 11)
  const ry = 70
  const seatRx = rx + 34
  const seatRy = ry + 34

  return (
    <div className="relative" style={{ width: rx * 2 + 80, height: ry * 2 + 80 }}>
      <div
        className="absolute table-surface flex flex-col items-center justify-center"
        style={{ width: rx * 2, height: ry * 2, left: 40, top: 40, borderRadius: '50%' }}
      >
        <span className="font-mono text-[11px] font-bold">{(table.label || 'Table').toUpperCase().replace(' ', '-')}</span>
        <span className="font-mono text-[8px] text-[#3A3A38]/40 mt-0.5 uppercase tracking-widest">Oval</span>
      </div>

      {seats.map((seat, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * seatRx + rx + 40 - 20
        const y = Math.sin(angle) * seatRy + ry + 40 - 20
        return (
          <div key={seat.id} className="absolute" style={{ left: x, top: y }}>
            <SeatSlot seat={seat} tableId={table.id} />
          </div>
        )
      })}
    </div>
  )
}
