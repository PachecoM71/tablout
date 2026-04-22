import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const GROUPS = ['Family', 'Friends', 'Colleagues', 'Plus Ones']

const GROUP_COLORS = {
  'Family': '#1A3C2B',
  'Friends': '#FF8C69',
  'Colleagues': '#5E8FA8',
  'Plus Ones': '#8B6F5E',
}

// Extra colors assigned to custom groups in order
const EXTRA_GROUP_COLORS = [
  '#A06888', '#8B7E4A', '#6B8E7A', '#A07050',
  '#7068A0', '#9E6E6E', '#5A8A6E', '#C4785A',
  '#6878A0', '#A08858',
]

function getGroupColor(groupName) {
  if (GROUP_COLORS[groupName]) return GROUP_COLORS[groupName]
  // Deterministic color from name hash
  let hash = 0
  for (let i = 0; i < groupName.length; i++) hash = ((hash << 5) - hash + groupName.charCodeAt(i)) | 0
  return EXTRA_GROUP_COLORS[Math.abs(hash) % EXTRA_GROUP_COLORS.length]
}

function sanitize(str, maxLen = 100) {
  return String(str).trim().slice(0, maxLen)
}

const VALID_SHAPES = ['round', 'rectangle', 'square', 'oval', 'u-shape', 'l-shape', 'banquet']

let _id = Date.now()
const uid = (prefix) => `${prefix}-${_id++}`

function defaultSeatsForShape(shape) {
  switch (shape) {
    case 'round': return Array.from({ length: 8 }, (_, i) => ({ id: uid('seat'), position: i, person: null }))
    case 'rectangle': return [
      ...Array.from({ length: 4 }, (_, i) => ({ id: uid('seat'), side: 'top', position: i, person: null })),
      ...Array.from({ length: 4 }, (_, i) => ({ id: uid('seat'), side: 'bottom', position: i, person: null })),
    ]
    case 'square': return [
      ...Array.from({ length: 2 }, (_, i) => ({ id: uid('seat'), side: 'top', position: i, person: null })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: uid('seat'), side: 'right', position: i, person: null })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: uid('seat'), side: 'bottom', position: i, person: null })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: uid('seat'), side: 'left', position: i, person: null })),
    ]
    case 'oval': return Array.from({ length: 10 }, (_, i) => ({ id: uid('seat'), position: i, person: null }))
    case 'u-shape': return [
      ...Array.from({ length: 3 }, (_, i) => ({ id: uid('seat'), side: 'left', position: i, person: null })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: uid('seat'), side: 'right', position: i, person: null })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: uid('seat'), side: 'bottom', position: i, person: null })),
    ]
    case 'l-shape': return [
      ...Array.from({ length: 3 }, (_, i) => ({ id: uid('seat'), side: 'top', position: i, person: null })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: uid('seat'), side: 'right', position: i, person: null })),
    ]
    case 'banquet': return [
      ...Array.from({ length: 6 }, (_, i) => ({ id: uid('seat'), side: 'top', position: i, person: null })),
      ...Array.from({ length: 6 }, (_, i) => ({ id: uid('seat'), side: 'bottom', position: i, person: null })),
    ]
    default: return []
  }
}

function createTable(shape, position, tableNumber) {
  return {
    id: uid('table'),
    label: `Table ${tableNumber}`,
    shape,
    position,
    scale: 1,
    rotation: 0,
    seats: defaultSeatsForShape(shape),
  }
}

const useStore = create(
  persist(
    (set) => ({
      eventName: '',
      tables: [],
      guests: [],
      groups: [...GROUPS],
      selectedTableId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      activeShape: 'round',

      setEventName: (name) => set({ eventName: sanitize(name, 200) }),
      setActiveShape: (shape) => set({ activeShape: VALID_SHAPES.includes(shape) ? shape : 'round' }),
      setSelectedTable: (id) => set({ selectedTableId: id }),
      setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
      setPan: (pan) => set({ pan }),

      addTable: (shape, position) => set((s) => {
        if (s.tables.length >= 50) return s // max 50 tables
        const validShape = VALID_SHAPES.includes(shape) ? shape : 'round'
        // Find the next available table number to avoid duplicates after deletions
        const usedNumbers = new Set(
          s.tables.map(t => {
            const match = (t.label || '').match(/^Table (\d+)$/)
            return match ? parseInt(match[1], 10) : 0
          })
        )
        let tableNumber = 1
        while (usedNumbers.has(tableNumber)) tableNumber++
        return { tables: [...s.tables, createTable(validShape, position, tableNumber)] }
      }),

      removeTable: (tableId) => set((s) => {
        const table = s.tables.find(t => t.id === tableId)
        if (!table) return s
        const unseated = table.seats.filter(seat => seat.person).map(seat => seat.person)
        return {
          tables: s.tables.filter(t => t.id !== tableId),
          guests: [...s.guests, ...unseated],
          selectedTableId: s.selectedTableId === tableId ? null : s.selectedTableId,
        }
      }),

      moveTable: (tableId, position) => set((s) => ({
        tables: s.tables.map(t => t.id === tableId ? { ...t, position } : t),
      })),

      scaleTable: (tableId, scale) => set((s) => ({
        tables: s.tables.map(t => t.id === tableId ? { ...t, scale: Math.max(0.5, Math.min(2, scale)) } : t),
      })),

      rotateTable: (tableId, rotation) => set((s) => ({
        tables: s.tables.map(t => t.id === tableId ? { ...t, rotation: ((rotation % 360) + 360) % 360 } : t),
      })),

      duplicateTable: (tableId) => set((s) => {
        if (s.tables.length >= 50) return s // max 50 tables
        const source = s.tables.find(t => t.id === tableId)
        if (!source) return s
        const newTable = {
          ...structuredClone(source),
          id: uid('table'),
          label: `${source.label} copy`,
          position: { x: source.position.x + 40, y: source.position.y + 40 },
          seats: source.seats.map(seat => ({ ...seat, id: uid('seat'), person: null })),
        }
        return { tables: [...s.tables, newTable], selectedTableId: newTable.id }
      }),

      renameTable: (tableId, label) => set((s) => ({
        tables: s.tables.map(t => t.id === tableId ? { ...t, label: sanitize(label, 50) } : t),
      })),

      addSeatToTable: (tableId, side) => set((s) => ({
        tables: s.tables.map(t => {
          if (t.id !== tableId) return t
          const newSeat = { id: uid('seat'), side, position: t.seats.filter(seat => seat.side === side || (side === undefined)).length, person: null }
          return { ...t, seats: [...t.seats, newSeat] }
        }),
      })),

      removeSeatFromTable: (tableId, seatId) => set((s) => {
        const table = s.tables.find(t => t.id === tableId)
        if (!table) return s
        const seat = table.seats.find(st => st.id === seatId)
        const displaced = seat?.person
        return {
          tables: s.tables.map(t => t.id !== tableId ? t : { ...t, seats: t.seats.filter(st => st.id !== seatId) }),
          guests: displaced ? [...s.guests, displaced] : s.guests,
        }
      }),

      addGuest: (name, group = 'Friends') => set((s) => {
        const safeName = sanitize(name, 80)
        const safeGroup = sanitize(group, 50)
        if (!safeName) return s
        if (s.guests.length + s.tables.reduce((a, t) => a + t.seats.filter(seat => seat.person).length, 0) >= 500) return s // max 500 guests
        return {
          guests: [...s.guests, {
            id: uid('guest'),
            name: safeName,
            group: safeGroup,
            color: getGroupColor(safeGroup),
          }],
        }
      }),

      removeGuest: (guestId) => set((s) => ({
        tables: s.tables.map(t => ({
          ...t,
          seats: t.seats.map(seat => seat.person?.id === guestId ? { ...seat, person: null } : seat),
        })),
        guests: s.guests.filter(g => g.id !== guestId),
      })),

      seatGuest: (guestId, tableId, seatId) => set((s) => {
        const guest = s.guests.find(g => g.id === guestId)
        if (!guest) return s
        let displaced = null
        const tables = s.tables.map(t => {
          if (t.id !== tableId) return t
          return {
            ...t,
            seats: t.seats.map(seat => {
              if (seat.id !== seatId) return seat
              displaced = seat.person
              return { ...seat, person: guest }
            }),
          }
        })
        return {
          guests: displaced
            ? [...s.guests.filter(g => g.id !== guestId), displaced]
            : s.guests.filter(g => g.id !== guestId),
          tables,
        }
      }),

      unseatGuest: (tableId, seatId) => set((s) => {
        let unseatedPerson = null
        const tables = s.tables.map(t => {
          if (t.id !== tableId) return t
          return {
            ...t,
            seats: t.seats.map(seat => {
              if (seat.id !== seatId) return seat
              unseatedPerson = seat.person
              return { ...seat, person: null }
            }),
          }
        })
        return {
          tables,
          guests: unseatedPerson ? [...s.guests, unseatedPerson] : s.guests,
        }
      }),

      swapSeats: (fromTableId, fromSeatId, toTableId, toSeatId) => set((s) => {
        let fromPerson = null
        let toPerson = null
        s.tables.forEach(t => {
          t.seats.forEach(seat => {
            if (t.id === fromTableId && seat.id === fromSeatId) fromPerson = seat.person
            if (t.id === toTableId && seat.id === toSeatId) toPerson = seat.person
          })
        })
        return {
          tables: s.tables.map(t => ({
            ...t,
            seats: t.seats.map(seat => {
              if (t.id === fromTableId && seat.id === fromSeatId) return { ...seat, person: toPerson }
              if (t.id === toTableId && seat.id === toSeatId) return { ...seat, person: fromPerson }
              return seat
            }),
          })),
        }
      }),

      autoAssign: () => set((s) => {
        const unassigned = [...s.guests]
        if (unassigned.length === 0) return s

        // Group guests by their group, then shuffle within each group
        const byGroup = {}
        unassigned.forEach(g => {
          const key = g.group || 'Other'
          if (!byGroup[key]) byGroup[key] = []
          byGroup[key].push(g)
        })
        Object.values(byGroup).forEach(arr => arr.sort(() => Math.random() - 0.5))

        // Sort groups largest-first so big groups get seated together
        const groupOrder = Object.keys(byGroup).sort((a, b) => byGroup[b].length - byGroup[a].length)

        // Build a list of tables with their empty seat counts
        const tableSlots = s.tables.map(t => ({
          id: t.id,
          empty: t.seats.filter(seat => !seat.person).length,
        })).sort((a, b) => b.empty - a.empty)

        // Assign each group to the table(s) with most available seats
        const assignments = new Map() // tableId -> [guest, guest, ...]
        const remaining = []

        for (const group of groupOrder) {
          const members = byGroup[group]
          let placed = 0

          while (placed < members.length) {
            // Find table with most remaining capacity
            tableSlots.sort((a, b) => b.empty - a.empty)
            const best = tableSlots.find(t => t.empty > 0)
            if (!best) break

            const batch = members.slice(placed, placed + best.empty)
            if (!assignments.has(best.id)) assignments.set(best.id, [])
            assignments.get(best.id).push(...batch)
            best.empty -= batch.length
            placed += batch.length
          }

          if (placed < members.length) {
            remaining.push(...members.slice(placed))
          }
        }

        // Apply assignments to tables
        const tables = s.tables.map(t => {
          const queue = assignments.get(t.id) || []
          let qi = 0
          return {
            ...t,
            seats: t.seats.map(seat => {
              if (seat.person || qi >= queue.length) return seat
              return { ...seat, person: queue[qi++] }
            }),
          }
        })

        return { tables, guests: remaining }
      }),

      resetAll: () => {
        localStorage.removeItem('tablout-storage')
        set({
          eventName: '',
          tables: [],
          guests: [],
          groups: [...GROUPS],
          selectedTableId: null,
          zoom: 1,
          pan: { x: 0, y: 0 },
          activeShape: 'round',
        })
      },

      addGroup: (name) => set((s) => {
        const safeName = sanitize(name, 50)
        if (!safeName || s.groups.includes(safeName)) return s
        if (s.groups.length >= 20) return s // max 20 groups
        return { groups: [...s.groups, safeName] }
      }),

      removeGroup: (name) => set((s) => {
        // Don't allow removing default groups
        if (GROUPS.includes(name)) return s
        // Move guests in this group to 'Friends'
        const updatePerson = (p) => p?.group === name ? { ...p, group: 'Friends', color: getGroupColor('Friends') } : p
        return {
          groups: s.groups.filter(g => g !== name),
          guests: s.guests.map(g => g.group === name ? { ...g, group: 'Friends', color: getGroupColor('Friends') } : g),
          tables: s.tables.map(t => ({
            ...t,
            seats: t.seats.map(seat => ({ ...seat, person: updatePerson(seat.person) })),
          })),
        }
      }),

      changeTableShape: (tableId, newShape) => set((s) => {
        if (!VALID_SHAPES.includes(newShape)) return s
        const table = s.tables.find(t => t.id === tableId)
        if (!table || table.shape === newShape) return s
        // Collect seated people from current table
        const seatedPeople = table.seats.filter(seat => seat.person).map(seat => seat.person)
        // Generate fresh seats for the new shape
        const newSeats = defaultSeatsForShape(newShape)
        // Re-assign seated people to new seats in order
        let idx = 0
        const filledSeats = newSeats.map(seat => {
          if (idx < seatedPeople.length) {
            return { ...seat, person: seatedPeople[idx++] }
          }
          return seat
        })
        // Any people who couldn't fit go back to the guest list
        const overflow = seatedPeople.slice(idx)
        return {
          tables: s.tables.map(t =>
            t.id !== tableId ? t : { ...t, shape: newShape, seats: filledSeats }
          ),
          guests: overflow.length > 0 ? [...s.guests, ...overflow] : s.guests,
        }
      }),
    }),
    {
      name: 'tablout-storage',
    }
  )
)

export { GROUP_COLORS, GROUPS, getGroupColor }
export default useStore
