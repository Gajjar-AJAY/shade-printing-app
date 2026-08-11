import { forwardRef } from 'react'

// One <Sticker/> = one physical 34mm x 20mm label.
function Sticker({ record, brand }) {
  const dyeLot = record.dyeLots[0] ?? ''
  const now = new Date()
  const dateStamp = `${now.getMonth() + 1}/${String(now.getFullYear()).slice(-2)}`

  return (
    <div className="sticker">
      <div className="sticker-line sticker-comp">{record.comp} COMP</div>
      <div className="sticker-line sticker-shade">{record.shadeNumber}</div>
      <div className="sticker-line sticker-dyelot">{dyeLot}</div>
      <div className="sticker-line sticker-brand">
        {brand.company} {dateStamp} {brand.operatorCode}
      </div>
    </div>
  )
}

// How the physical label roll is laid out: 3 labels across per row, and — per this version —
// each row is its own printed page (so a page never holds more than one row of 3).
const STICKERS_PER_ROW = 3
const STICKER_WIDTH_MM = 34
const STICKER_HEIGHT_MM = 20

function chunk(items, size) {
  const rows = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size))
  return rows
}

const StickerSheet = forwardRef(function StickerSheet({ records, qty, brand }, ref) {
  const jobs = records.flatMap((r) => Array.from({ length: qty }, (_, i) => ({ ...r, copyKey: i })))
  const rows = chunk(jobs, STICKERS_PER_ROW)

  const pageWidthMM = STICKERS_PER_ROW * STICKER_WIDTH_MM
  const pageHeightMM = STICKER_HEIGHT_MM

  return (
    <div ref={ref} className="sticker-sheet">
      {/* Every page is exactly one row: 3 stickers wide x 1 sticker tall. */}
      <style>{`
        @page {
          size: ${pageWidthMM}mm ${pageHeightMM}mm;
          margin: 0;
        }
      `}</style>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="sticker-row"
          style={{
            gridTemplateColumns: `repeat(${STICKERS_PER_ROW}, ${STICKER_WIDTH_MM}mm)`,
            gridAutoRows: `${STICKER_HEIGHT_MM}mm`,
          }}
        >
          {row.map((r, idx) => (
            <Sticker key={`${r.id}-${r.copyKey}-${idx}`} record={r} brand={brand} />
          ))}
        </div>
      ))}
    </div>
  )
})

export default StickerSheet