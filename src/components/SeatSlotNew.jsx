export default function SeatSlot({ seat, tableId }) {
  const { person } = seat

  return (
    <div
      data-seat-id={seat.id}
      data-table-id={tableId}
      className="seat-slot relative group/seat"
    >
      {person ? (
        <div
          className="w-10 h-10 rounded-[4px] flex items-center justify-center font-body text-[9px] font-medium shadow-sm cursor-grab active:cursor-grabbing select-none"
          style={{ backgroundColor: person.color, color: '#fff' }}
          title={person.name}
        >
          {person.name.split(' ')[0]}
        </div>
      ) : (
        <div className="w-10 h-10 border border-dashed border-[#1A3C2B]/40 rounded-[4px] flex items-center justify-center text-[#1A3C2B]/40 cursor-pointer hover:border-[#1A3C2B]/60 hover:bg-[#1A3C2B]/5 transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      )}
    </div>
  )
}
