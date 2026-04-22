import { describe, it, expect, beforeEach } from 'vitest'
import useStore from '../store/useStore'

// Reset store before each test
function resetStore() {
  useStore.setState({
    eventName: '',
    tables: [],
    guests: [],
    groups: ['Family', 'Friends', 'Colleagues', 'Plus Ones'],
    selectedTableId: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeShape: 'round',
  })
}

describe('useStore', () => {
  beforeEach(() => {
    resetStore()
  })

  // ── Event Name ──
  describe('eventName', () => {
    it('sets event name', () => {
      useStore.getState().setEventName('Wedding')
      expect(useStore.getState().eventName).toBe('Wedding')
    })
  })

  // ── Tables ──
  describe('addTable', () => {
    it('adds a round table with default 8 seats', () => {
      useStore.getState().addTable('round', { x: 100, y: 100 })
      const { tables } = useStore.getState()
      expect(tables).toHaveLength(1)
      expect(tables[0].shape).toBe('round')
      expect(tables[0].seats).toHaveLength(8)
      expect(tables[0].label).toBe('Table 1')
      expect(tables[0].scale).toBe(1)
      expect(tables[0].rotation).toBe(0)
      expect(tables[0].position).toEqual({ x: 100, y: 100 })
    })

    it('adds rectangle table with 8 seats (4 top, 4 bottom)', () => {
      useStore.getState().addTable('rectangle', { x: 0, y: 0 })
      const t = useStore.getState().tables[0]
      expect(t.shape).toBe('rectangle')
      expect(t.seats).toHaveLength(8)
      expect(t.seats.filter(s => s.side === 'top')).toHaveLength(4)
      expect(t.seats.filter(s => s.side === 'bottom')).toHaveLength(4)
    })

    it('adds square table with 8 seats (2 per side)', () => {
      useStore.getState().addTable('square', { x: 0, y: 0 })
      const t = useStore.getState().tables[0]
      expect(t.seats).toHaveLength(8)
      expect(t.seats.filter(s => s.side === 'top')).toHaveLength(2)
      expect(t.seats.filter(s => s.side === 'right')).toHaveLength(2)
    })

    it('adds oval table with 10 seats', () => {
      useStore.getState().addTable('oval', { x: 0, y: 0 })
      expect(useStore.getState().tables[0].seats).toHaveLength(10)
    })

    it('adds u-shape table with 9 seats', () => {
      useStore.getState().addTable('u-shape', { x: 0, y: 0 })
      const t = useStore.getState().tables[0]
      expect(t.seats).toHaveLength(9)
      expect(t.seats.filter(s => s.side === 'left')).toHaveLength(3)
      expect(t.seats.filter(s => s.side === 'right')).toHaveLength(3)
      expect(t.seats.filter(s => s.side === 'bottom')).toHaveLength(3)
    })

    it('adds l-shape table with 6 seats', () => {
      useStore.getState().addTable('l-shape', { x: 0, y: 0 })
      expect(useStore.getState().tables[0].seats).toHaveLength(6)
    })

    it('adds banquet table with 12 seats', () => {
      useStore.getState().addTable('banquet', { x: 0, y: 0 })
      expect(useStore.getState().tables[0].seats).toHaveLength(12)
    })

    it('increments table number', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addTable('round', { x: 100, y: 0 })
      const { tables } = useStore.getState()
      expect(tables[0].label).toBe('Table 1')
      expect(tables[1].label).toBe('Table 2')
    })

    it('avoids duplicate labels after deletion', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addTable('round', { x: 100, y: 0 })
      useStore.getState().addTable('round', { x: 200, y: 0 })
      const t2id = useStore.getState().tables[1].id
      useStore.getState().removeTable(t2id)
      useStore.getState().addTable('round', { x: 300, y: 0 })
      const labels = useStore.getState().tables.map(t => t.label)
      expect(new Set(labels).size).toBe(labels.length)
      expect(labels).toContain('Table 2')
    })

    it('enforces 50-table limit', () => {
      for (let i = 0; i < 50; i++) useStore.getState().addTable('round', { x: i * 10, y: 0 })
      expect(useStore.getState().tables).toHaveLength(50)
      useStore.getState().addTable('round', { x: 999, y: 0 })
      expect(useStore.getState().tables).toHaveLength(50)
    })
  })

  describe('removeTable', () => {
    it('removes a table', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().removeTable(tableId)
      expect(useStore.getState().tables).toHaveLength(0)
    })

    it('returns seated guests to guest list', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      expect(useStore.getState().guests).toHaveLength(0)
      useStore.getState().removeTable(tableId)
      expect(useStore.getState().guests).toHaveLength(1)
      expect(useStore.getState().guests[0].name).toBe('Alice')
    })

    it('deselects table if it was selected', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().setSelectedTable(tableId)
      useStore.getState().removeTable(tableId)
      expect(useStore.getState().selectedTableId).toBeNull()
    })
  })

  describe('moveTable', () => {
    it('updates table position', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().moveTable(tableId, { x: 200, y: 300 })
      expect(useStore.getState().tables[0].position).toEqual({ x: 200, y: 300 })
    })
  })

  describe('scaleTable', () => {
    it('scales table within bounds', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().scaleTable(tableId, 1.5)
      expect(useStore.getState().tables[0].scale).toBe(1.5)
    })

    it('clamps scale to min 0.5', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().scaleTable(tableId, 0.1)
      expect(useStore.getState().tables[0].scale).toBe(0.5)
    })

    it('clamps scale to max 2', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().scaleTable(tableId, 5)
      expect(useStore.getState().tables[0].scale).toBe(2)
    })
  })

  describe('rotateTable', () => {
    it('sets rotation', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().rotateTable(tableId, 45)
      expect(useStore.getState().tables[0].rotation).toBe(45)
    })

    it('normalizes negative rotation', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().rotateTable(tableId, -90)
      expect(useStore.getState().tables[0].rotation).toBe(270)
    })

    it('normalizes rotation over 360', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().rotateTable(tableId, 450)
      expect(useStore.getState().tables[0].rotation).toBe(90)
    })
  })

  describe('duplicateTable', () => {
    it('creates a copy offset by 40px', () => {
      useStore.getState().addTable('rectangle', { x: 100, y: 200 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().duplicateTable(tableId)
      const { tables } = useStore.getState()
      expect(tables).toHaveLength(2)
      expect(tables[1].shape).toBe('rectangle')
      expect(tables[1].position).toEqual({ x: 140, y: 240 })
      expect(tables[1].label).toBe('Table 1 copy')
    })

    it('clears seated guests on the copy', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      useStore.getState().duplicateTable(tableId)
      const copy = useStore.getState().tables[1]
      expect(copy.seats.every(s => s.person === null)).toBe(true)
    })

    it('selects the new table', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().duplicateTable(tableId)
      expect(useStore.getState().selectedTableId).toBe(useStore.getState().tables[1].id)
    })

    it('preserves scale and rotation', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().scaleTable(tableId, 1.5)
      useStore.getState().rotateTable(tableId, 90)
      useStore.getState().duplicateTable(tableId)
      const copy = useStore.getState().tables[1]
      expect(copy.scale).toBe(1.5)
      expect(copy.rotation).toBe(90)
    })

    it('enforces 50-table limit on duplicate', () => {
      for (let i = 0; i < 50; i++) useStore.getState().addTable('round', { x: i * 10, y: 0 })
      expect(useStore.getState().tables).toHaveLength(50)
      const lastId = useStore.getState().tables[49].id
      useStore.getState().duplicateTable(lastId)
      expect(useStore.getState().tables).toHaveLength(50)
    })
  })

  describe('renameTable', () => {
    it('changes table label', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().renameTable(tableId, 'VIP Table')
      expect(useStore.getState().tables[0].label).toBe('VIP Table')
    })
  })

  describe('changeTableShape', () => {
    it('converts shape and preserves seated guests', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().addGuest('Bob', 'Friends')
      const tableId = useStore.getState().tables[0].id
      const seat1 = useStore.getState().tables[0].seats[0].id
      const seat2 = useStore.getState().tables[0].seats[1].id
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seat1)
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seat2)
      useStore.getState().changeTableShape(tableId, 'rectangle')
      const table = useStore.getState().tables[0]
      expect(table.shape).toBe('rectangle')
      const seated = table.seats.filter(s => s.person)
      expect(seated.length).toBeGreaterThanOrEqual(1)
    })

    it('overflows guests back to list if new shape has fewer seats', () => {
      useStore.getState().addTable('banquet', { x: 0, y: 0 })
      // Add and seat 12 guests (banquet has 12 seats)
      for (let i = 0; i < 12; i++) {
        useStore.getState().addGuest(`Guest ${i}`, 'Family')
      }
      const tableId = useStore.getState().tables[0].id
      // Seat all guests
      for (let i = 0; i < 12; i++) {
        const guestId = useStore.getState().guests[0].id
        const emptySeat = useStore.getState().tables[0].seats.find(s => !s.person)
        useStore.getState().seatGuest(guestId, tableId, emptySeat.id)
      }
      expect(useStore.getState().guests).toHaveLength(0)
      // Change to l-shape (6 seats)
      useStore.getState().changeTableShape(tableId, 'l-shape')
      expect(useStore.getState().tables[0].seats).toHaveLength(6)
      expect(useStore.getState().guests.length).toBe(6)
    })
  })

  // ── Seats ──
  describe('addSeatToTable / removeSeatFromTable', () => {
    it('adds a seat to a table side', () => {
      useStore.getState().addTable('rectangle', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      const before = useStore.getState().tables[0].seats.length
      useStore.getState().addSeatToTable(tableId, 'top')
      expect(useStore.getState().tables[0].seats.length).toBe(before + 1)
    })

    it('removes a seat and returns displaced guest', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      expect(useStore.getState().guests).toHaveLength(0)
      useStore.getState().removeSeatFromTable(tableId, seatId)
      expect(useStore.getState().guests).toHaveLength(1)
      expect(useStore.getState().guests[0].name).toBe('Alice')
    })
  })

  // ── Guests ──
  describe('addGuest', () => {
    it('adds a guest with name, group, and color', () => {
      useStore.getState().addGuest('Alice', 'Family')
      const { guests } = useStore.getState()
      expect(guests).toHaveLength(1)
      expect(guests[0].name).toBe('Alice')
      expect(guests[0].group).toBe('Family')
      expect(guests[0].color).toBe('#1A3C2B')
    })

    it('defaults to Friends group', () => {
      useStore.getState().addGuest('Bob')
      expect(useStore.getState().guests[0].group).toBe('Friends')
    })
  })

  describe('removeGuest', () => {
    it('removes from guest list', () => {
      useStore.getState().addGuest('Alice', 'Family')
      const guestId = useStore.getState().guests[0].id
      useStore.getState().removeGuest(guestId)
      expect(useStore.getState().guests).toHaveLength(0)
    })

    it('removes from seat if seated', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      useStore.getState().removeGuest(guestId)
      expect(useStore.getState().tables[0].seats[0].person).toBeNull()
    })
  })

  // ── Seating ──
  describe('seatGuest', () => {
    it('seats a guest and removes from guest list', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      expect(useStore.getState().guests).toHaveLength(0)
      expect(useStore.getState().tables[0].seats[0].person.name).toBe('Alice')
    })

    it('displaces existing guest back to list', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().addGuest('Bob', 'Friends')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seatId)
      // Now seat Bob in the same seat
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seatId)
      const { guests, tables } = useStore.getState()
      expect(tables[0].seats[0].person.name).toBe('Bob')
      expect(guests).toHaveLength(1)
      expect(guests[0].name).toBe('Alice')
    })
  })

  describe('unseatGuest', () => {
    it('returns guest to list', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seatId)
      useStore.getState().unseatGuest(tableId, seatId)
      expect(useStore.getState().guests).toHaveLength(1)
      expect(useStore.getState().tables[0].seats[0].person).toBeNull()
    })
  })

  describe('swapSeats', () => {
    it('swaps two seated guests', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().addGuest('Bob', 'Friends')
      const tableId = useStore.getState().tables[0].id
      const seat1 = useStore.getState().tables[0].seats[0].id
      const seat2 = useStore.getState().tables[0].seats[1].id
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seat1)
      useStore.getState().seatGuest(useStore.getState().guests[0].id, tableId, seat2)
      useStore.getState().swapSeats(tableId, seat1, tableId, seat2)
      const { tables } = useStore.getState()
      expect(tables[0].seats[0].person.name).toBe('Bob')
      expect(tables[0].seats[1].person.name).toBe('Alice')
    })
  })

  // ── Auto Assign ──
  describe('autoAssign', () => {
    it('assigns all guests to available seats', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().addGuest('Bob', 'Family')
      useStore.getState().addGuest('Charlie', 'Friends')
      useStore.getState().autoAssign()
      expect(useStore.getState().guests).toHaveLength(0)
      const seated = useStore.getState().tables[0].seats.filter(s => s.person)
      expect(seated).toHaveLength(3)
    })

    it('overflows guests when no seats available', () => {
      useStore.getState().addTable('l-shape', { x: 0, y: 0 }) // 6 seats
      for (let i = 0; i < 10; i++) useStore.getState().addGuest(`G${i}`, 'Family')
      useStore.getState().autoAssign()
      expect(useStore.getState().guests).toHaveLength(4) // 10 - 6 = 4
    })

    it('groups guests from same group together', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 }) // 8 seats
      useStore.getState().addTable('round', { x: 300, y: 0 }) // 8 seats
      for (let i = 0; i < 6; i++) useStore.getState().addGuest(`Fam${i}`, 'Family')
      for (let i = 0; i < 4; i++) useStore.getState().addGuest(`Friend${i}`, 'Friends')
      useStore.getState().autoAssign()
      // All family members should be at the same table (largest group first)
      const t1 = useStore.getState().tables[0]
      const t2 = useStore.getState().tables[1]
      const t1Fam = t1.seats.filter(s => s.person?.group === 'Family').length
      const t2Fam = t2.seats.filter(s => s.person?.group === 'Family').length
      // All 6 family should be at the same table
      expect(Math.max(t1Fam, t2Fam)).toBe(6)
    })

    it('does nothing with no guests', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().autoAssign()
      expect(useStore.getState().tables[0].seats.every(s => !s.person)).toBe(true)
    })
  })

  // ── Groups ──
  describe('groups', () => {
    it('starts with 4 default groups', () => {
      expect(useStore.getState().groups).toEqual(['Family', 'Friends', 'Colleagues', 'Plus Ones'])
    })

    it('adds a custom group', () => {
      useStore.getState().addGroup('Coworkers')
      expect(useStore.getState().groups).toContain('Coworkers')
    })

    it('does not add duplicate group', () => {
      useStore.getState().addGroup('Family')
      expect(useStore.getState().groups.filter(g => g === 'Family')).toHaveLength(1)
    })

    it('removes custom group and moves guests to Friends', () => {
      useStore.getState().addGroup('VIPs')
      useStore.getState().addGuest('Alice', 'VIPs')
      useStore.getState().removeGroup('VIPs')
      expect(useStore.getState().groups).not.toContain('VIPs')
      expect(useStore.getState().guests[0].group).toBe('Friends')
    })

    it('cannot remove default groups', () => {
      useStore.getState().removeGroup('Family')
      expect(useStore.getState().groups).toContain('Family')
    })
  })

  // ── Zoom & Pan ──
  describe('zoom and pan', () => {
    it('sets zoom within bounds', () => {
      useStore.getState().setZoom(1.5)
      expect(useStore.getState().zoom).toBe(1.5)
    })

    it('clamps zoom min to 0.25', () => {
      useStore.getState().setZoom(0.1)
      expect(useStore.getState().zoom).toBe(0.25)
    })

    it('clamps zoom max to 2', () => {
      useStore.getState().setZoom(5)
      expect(useStore.getState().zoom).toBe(2)
    })

    it('sets pan', () => {
      useStore.getState().setPan({ x: 100, y: -50 })
      expect(useStore.getState().pan).toEqual({ x: 100, y: -50 })
    })
  })

  // ── Active Shape ──
  describe('activeShape', () => {
    it('defaults to round', () => {
      expect(useStore.getState().activeShape).toBe('round')
    })

    it('changes active shape', () => {
      useStore.getState().setActiveShape('banquet')
      expect(useStore.getState().activeShape).toBe('banquet')
    })
  })

  // ── Selection ──
  describe('selectedTableId', () => {
    it('selects and deselects', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      useStore.getState().setSelectedTable(tableId)
      expect(useStore.getState().selectedTableId).toBe(tableId)
      useStore.getState().setSelectedTable(null)
      expect(useStore.getState().selectedTableId).toBeNull()
    })
  })

  // ── Reset ──
  describe('resetAll', () => {
    it('clears all state', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().setEventName('Wedding')
      useStore.getState().resetAll()
      const s = useStore.getState()
      expect(s.tables).toHaveLength(0)
      expect(s.guests).toHaveLength(0)
      expect(s.eventName).toBe('')
    })
  })

  // ── Mobile tap-to-assign flow (store operations) ──
  describe('mobile tap-to-assign store operations', () => {
    it('seatGuest on empty seat works (tap-to-assign core)', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      const guestId = useStore.getState().guests[0].id
      useStore.getState().seatGuest(guestId, tableId, seatId)
      expect(useStore.getState().tables[0].seats[0].person.name).toBe('Alice')
      expect(useStore.getState().guests).toHaveLength(0)
    })

    it('seatGuest ignores invalid guest id', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      const tableId = useStore.getState().tables[0].id
      const seatId = useStore.getState().tables[0].seats[0].id
      useStore.getState().seatGuest('nonexistent-id', tableId, seatId)
      expect(useStore.getState().tables[0].seats[0].person).toBeNull()
    })

    it('multiple guests can be seated sequentially (multi-tap flow)', () => {
      useStore.getState().addTable('round', { x: 0, y: 0 })
      useStore.getState().addGuest('Alice', 'Family')
      useStore.getState().addGuest('Bob', 'Friends')
      useStore.getState().addGuest('Charlie', 'Colleagues')
      const tableId = useStore.getState().tables[0].id

      for (let i = 0; i < 3; i++) {
        const gId = useStore.getState().guests[0].id
        const emptySeat = useStore.getState().tables[0].seats.find(s => !s.person)
        useStore.getState().seatGuest(gId, tableId, emptySeat.id)
      }
      expect(useStore.getState().guests).toHaveLength(0)
      const seated = useStore.getState().tables[0].seats.filter(s => s.person)
      expect(seated).toHaveLength(3)
    })
  })

  // ── Pan state (used by mobile single-finger pan) ──
  describe('pan state for mobile', () => {
    it('setPan stores arbitrary pan values (commit after drag)', () => {
      useStore.getState().setPan({ x: 150.5, y: -75.3 })
      const { pan } = useStore.getState()
      expect(pan.x).toBe(150.5)
      expect(pan.y).toBe(-75.3)
    })

    it('setPan updates correctly after multiple calls (simulates pan gestures)', () => {
      useStore.getState().setPan({ x: 10, y: 20 })
      useStore.getState().setPan({ x: 30, y: 40 })
      useStore.getState().setPan({ x: -50, y: 100 })
      expect(useStore.getState().pan).toEqual({ x: -50, y: 100 })
    })

    it('zoom can be set to mobile-friendly values (auto-fit)', () => {
      useStore.getState().setZoom(0.4)
      expect(useStore.getState().zoom).toBe(0.4)
      useStore.getState().setZoom(1.5)
      expect(useStore.getState().zoom).toBe(1.5)
    })
  })
})
