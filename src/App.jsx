import { useEffect, useRef, useState } from 'react'
import ShadeTable from './components/ShadeTable.jsx'
import StickerSheet from './components/StickerSheet.jsx'
import { shadeRecords, brand } from './data.js'
import './App.css'

export default function App() {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [qty, setQty] = useState(3)
  const [search, setSearch] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef(null)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = (visibleRows) => {
    setSelectedIds((prev) => {
      const allSelected = visibleRows.length > 0 && visibleRows.every((r) => prev.has(r.id))
      const next = new Set(prev)
      if (allSelected) {
        visibleRows.forEach((r) => next.delete(r.id))
      } else {
        visibleRows.forEach((r) => next.add(r.id))
      }
      return next
    })
  }

  const selectedRecords = shadeRecords.filter((r) => selectedIds.has(r.id))

  const handlePrint = () => {
    if (selectedRecords.length === 0) return
    setIsPrinting(true)
  }

  // Once the printable sheet has rendered with the right jobs, fire the browser print dialog.
  useEffect(() => {
    if (!isPrinting) return
    const timer = setTimeout(() => window.print(), 50)
    const handleAfterPrint = () => setIsPrinting(false)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [isPrinting])

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
