import { forwardRef } from 'react'

// One <GembaSticker/> = one physical label. 100.4mm is the TOTAL row width
// (3 labels across), not a single label's width — matches the physical
// roll: 3 stickers per row, each ~33.47mm wide x 12mm tall.
function GembaSticker({ record }) {
  return (
    <div className="sticker gemba-sticker">
      <div className="sticker-line gemba-sticker-number">{record.atqor_gembanumber}</div>
    </div>
  )
}

const STICKERS_PER_ROW = 3
const ROW_WIDTH_MM = 100.4
const STICKER_WIDTH_MM = ROW_WIDTH_MM / STICKERS_PER_ROW // ≈ 33.47mm
const STICKER_HEIGHT_MM = 12

function chunk(items, size) {
  const rows = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size))
  return rows
}

const GembaStickerSheet = forwardRef(function GembaStickerSheet({ records, qty, brand }, ref) {
  const jobs = records.flatMap((r) => Array.from({ length: qty }, (_, i) => ({ ...r, copyKey: i })))
  const rows = chunk(jobs, STICKERS_PER_ROW)

  const pageWidthMM = STICKERS_PER_ROW * STICKER_WIDTH_MM
  const pageHeightMM = STICKER_HEIGHT_MM

  return (
    <div ref={ref} className="sticker-sheet">
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
            <GembaSticker key={`${r.atqor_gembaid}-${r.copyKey}-${idx}`} record={r} />
          ))}
        </div>
      ))}
    </div>
  )
})

export default GembaStickerSheet