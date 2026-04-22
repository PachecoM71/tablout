import RoundTable from './RoundTable'
import RectangleTable from './RectangleTable'
import SquareTable from './SquareTable'
import UShapeTable from './UShapeTable'
import LShapeTable from './LShapeTable'
import OvalTable from './OvalTable'
import BanquetTable from './BanquetTable'

const TABLE_COMPONENTS = {
  round: RoundTable,
  rectangle: RectangleTable,
  square: SquareTable,
  'u-shape': UShapeTable,
  'l-shape': LShapeTable,
  oval: OvalTable,
  banquet: BanquetTable,
}

export default function TableRenderer({ table, isSelected, onSelect }) {
  const Component = TABLE_COMPONENTS[table.shape]
  if (!Component) return null

  return (
    <div
      className={`table-wrapper relative ${isSelected ? 'ring-2 ring-[#1A3C2B]/30 ring-offset-4 ring-offset-[#F5F4F0] rounded-[4px]' : ''}`}
      onClick={(e) => { e.stopPropagation(); onSelect(table.id) }}
    >
      {isSelected && (
        <>
          <div className="corner-bracket bracket-tl" />
          <div className="corner-bracket bracket-tr" />
          <div className="corner-bracket bracket-bl" />
          <div className="corner-bracket bracket-br" />
        </>
      )}
      <Component table={table} />
    </div>
  )
}
