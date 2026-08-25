import ShadeTable from './ShadeTable.jsx'
import StickerSheet from './StickerSheet.jsx'
import { useStickerPrinter } from '../hooks/useStickerPrinter.js'
import { shadeRecords, brand } from '../data.js'

export default function ShadeScreen({ onBack }) {
  const {
    selectedIds,
    toggleSelect,
    toggleAll,
    qty,
    setQty,
    search,
    setSearch,
    printRef,
    selectedRecords,
    handlePrint,
  } = useStickerPrinter(shadeRecords)

  return (
    <div className="app-shell">
      <div className="screen-only">
        <ShadeTable
          records={shadeRecords}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          qty={qty}
          onQtyChange={setQty}
          onPrint={handlePrint}
          search={search}
          onSearchChange={setSearch}
          onBack={onBack}
        />

        {selectedRecords.length > 0 && (
          <div className="preview-panel">
            <div className="preview-header">
              <span>Sticker preview</span>
              <span className="preview-meta">
                34mm × 20mm · 3 per row · {selectedRecords.length * qty} label
                {selectedRecords.length * qty === 1 ? '' : 's'} will print
              </span>
            </div>
            <div className="preview-strip">
              {selectedRecords.slice(0, 6).map((r) => {
                const dyeLot = r.dyeLots[0] ?? ''
                const now = new Date()
                const dateStamp = `${now.getMonth() + 1}/${String(now.getFullYear()).slice(-2)}`
                return (
                  <div className="sticker preview-sticker" key={r.id}>
                    <div className="sticker-line sticker-comp">{r.comp} COMP</div>
                    <div className="sticker-line sticker-shade">{r.shadeNumber}</div>
                    <div className="sticker-line sticker-dyelot">{dyeLot}</div>
                    <div className="sticker-line sticker-brand">
                      {brand.company} {dateStamp} {brand.operatorCode}
                    </div>
                  </div>
                )
              })}
              {selectedRecords.length > 6 && (
                <div className="preview-more">+{selectedRecords.length - 6} more shade{selectedRecords.length - 6 === 1 ? '' : 's'}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="print-only">
        <StickerSheet ref={printRef} records={selectedRecords} qty={qty} brand={brand} />
      </div>
    </div>
  )
}