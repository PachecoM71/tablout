import { useState } from 'react'
import useStore, { GROUPS, getGroupColor } from '../store/useStore'
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react'

export default function SidebarNew({ isMobile = false }) {
  const { guests, tables, groups, addGuest, removeGuest, addGroup, removeGroup } = useStore()
  const [name, setName] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('Friends')
  const [showGroupPicker, setShowGroupPicker] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [newGroupName, setNewGroupName] = useState('')
  const [showNewGroupInput, setShowNewGroupInput] = useState(false)

  const totalSeats = tables.reduce((acc, t) => acc + t.seats.length, 0)
  const seatedCount = tables.reduce((acc, t) => acc + t.seats.filter(s => s.person).length, 0)
  const totalPeople = guests.length + seatedCount

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addGuest(trimmed, selectedGroup)
    setName('')
  }

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  // Group guests by their group
  const guestsByGroup = {}
  groups.forEach(g => { guestsByGroup[g] = [] })
  guests.forEach(g => {
    if (!guestsByGroup[g.group]) guestsByGroup[g.group] = []
    guestsByGroup[g.group].push(g)
  })

  // Also collect seated guests per group from tables
  const seatedByGroup = {}
  tables.forEach(t => {
    t.seats.forEach(s => {
      if (s.person) {
        const g = s.person.group || 'Other'
        if (!seatedByGroup[g]) seatedByGroup[g] = []
        seatedByGroup[g].push({ ...s.person, table: t.label, seatId: s.id })
      }
    })
  })

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-[260px] border-r border-[#3A3A38]/10'} flex flex-col bg-[#F5F4F0] shrink-0 h-full`}>
      <div className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col h-full`}>
        {/* Stats */}
        <div className="mb-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#3A3A38]/40 mb-5 border-b border-[#3A3A38]/5 pb-2">Live Project Status</h2>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#3A3A38]/60">TOTAL_CAPACITY</span>
              <span className="text-[#1A3C2B] font-bold">{totalSeats} UNITS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3A3A38]/60">ALLOCATED</span>
              <span className="font-bold">{seatedCount} UNITS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#3A3A38]/60">TABLES</span>
              <span className="font-bold">{tables.length}</span>
            </div>
            {guests.length > 0 && (
              <div className="flex justify-between">
                <span className="text-[#3A3A38]/60">PENDING</span>
                <span className="text-[#FF8C69] font-bold">{guests.length} UNITS</span>
              </div>
            )}
          </div>
        </div>

        {/* Add guest form */}
        <div className="mb-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#3A3A38]/40 mb-3">Registry Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="GUEST FULL NAME..."
                className="flex-1 bg-white/50 border border-[#3A3A38]/20 px-3 py-2.5 text-[11px] font-mono focus:outline-none focus:border-[#1A3C2B] rounded-[2px] placeholder:text-[#3A3A38]/30"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-10 flex items-center justify-center border border-[#3A3A38]/20 bg-white hover:bg-[#1A3C2B] hover:text-white transition-all rounded-[2px] disabled:opacity-30"
              >
                <Plus size={14} />
              </button>
            </div>
            {/* Group picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGroupPicker(!showGroupPicker)}
                className="flex items-center gap-2 font-mono text-[10px] text-[#3A3A38]/60 hover:text-[#3A3A38] transition-colors"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getGroupColor(selectedGroup) }} />
                {selectedGroup}
                <ChevronDown size={10} />
              </button>
              {showGroupPicker && (
                <div className="absolute left-0 top-6 bg-white border border-[#3A3A38]/10 rounded-sm shadow-md z-30 py-1 min-w-[180px]">
                  {groups.map(g => (
                    <div key={g} className="flex items-center group/item">
                      <button
                        type="button"
                        onClick={() => { setSelectedGroup(g); setShowGroupPicker(false) }}
                        className="flex items-center gap-2 px-3 py-1.5 flex-1 hover:bg-[#3A3A38]/5 text-left font-mono text-[10px]"
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getGroupColor(g) }} />
                        {g}
                      </button>
                      {!GROUPS.includes(g) && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeGroup(g); if (selectedGroup === g) setSelectedGroup('Friends') }}
                          className="px-2 py-1 text-[#3A3A38]/20 hover:text-[#FF8C69] opacity-0 group-hover/item:opacity-100 transition-all"
                          title="Remove group"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add new group */}
                  <div className="border-t border-[#3A3A38]/5 mt-1 pt-1 px-2">
                    {showNewGroupInput ? (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const trimmed = newGroupName.trim()
                        if (trimmed && !groups.includes(trimmed)) {
                          addGroup(trimmed)
                          setSelectedGroup(trimmed)
                          setNewGroupName('')
                          setShowNewGroupInput(false)
                          setShowGroupPicker(false)
                        }
                      }} className="flex gap-1">
                        <input
                          autoFocus
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          onBlur={() => { if (!newGroupName.trim()) setShowNewGroupInput(false) }}
                          placeholder="Group name..."
                          className="flex-1 bg-[#F5F4F0] border border-[#3A3A38]/15 px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-[#1A3C2B] rounded-sm"
                        />
                        <button type="submit" disabled={!newGroupName.trim()} className="w-5 h-5 flex items-center justify-center text-[#1A3C2B] hover:bg-[#1A3C2B]/10 rounded-sm disabled:opacity-30">
                          <Plus size={10} />
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowNewGroupInput(true)}
                        className="flex items-center gap-2 py-1.5 w-full font-mono text-[10px] text-[#1A3C2B]/60 hover:text-[#1A3C2B] transition-colors"
                      >
                        <Plus size={10} />
                        New Group
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Guest list grouped */}
        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#3A3A38]/40 mb-4">Guest Index</h2>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">

          {groups.map(group => {
            const unassigned = guestsByGroup[group] || []
            const seated = seatedByGroup[group] || []
            const total = unassigned.length + seated.length
            if (total === 0) return null
            const isCollapsed = collapsedGroups[group]

            return (
              <div key={group} className="mb-4">
                <button
                  onClick={() => toggleGroup(group)}
                  className="flex items-center gap-2 mb-3 w-full group"
                >
                  {isCollapsed ? <ChevronRight size={10} className="text-[#3A3A38]/40" /> : <ChevronDown size={10} className="text-[#3A3A38]/40" />}
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getGroupColor(group) }} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#3A3A38]/60 group-hover:text-[#3A3A38]">{group}</span>
                  <span className="font-mono text-[9px] text-[#3A3A38]/30 ml-auto">{total}</span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2 ml-4">
                    {/* Unassigned guests (draggable) */}
                    {unassigned.map(guest => (
                      <div
                        key={guest.id}
                        data-guest-id={guest.id}
                        className="flex items-center gap-3 p-3 bg-white border border-[#3A3A38]/5 rounded-[4px] shadow-sm relative overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group/card"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: guest.color }} />
                        <div className="flex-1 pl-1">
                          <p className="font-body text-[13px] font-medium text-[#3A3A38]">{guest.name}</p>
                          <p className="font-mono text-[9px] text-[#FF8C69] mt-0.5 font-bold tracking-wider">UNASSIGNED</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeGuest(guest.id) }}
                          className="w-5 h-5 flex items-center justify-center text-[#3A3A38]/20 hover:text-[#FF8C69] transition-colors opacity-0 group-hover/card:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Seated guests */}
                    {seated.map(guest => (
                      <div
                        key={guest.id}
                        className="flex items-center gap-3 p-3 bg-white border border-[#3A3A38]/5 rounded-[4px] shadow-sm relative overflow-hidden opacity-60"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: guest.color }} />
                        <div className="flex-1 pl-1">
                          <p className="font-body text-[13px] font-medium text-[#3A3A38]">{guest.name}</p>
                          <p className="font-mono text-[9px] text-[#3A3A38]/40 mt-0.5 uppercase tracking-wider">{guest.table}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {totalPeople === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-40">
              <span className="text-2xl">👋</span>
              <p className="font-mono text-[10px] text-center leading-relaxed tracking-wider">
                ADD GUESTS ABOVE<br />DRAG TO SEATS
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </aside>
  )
}
