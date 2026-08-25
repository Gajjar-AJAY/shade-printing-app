import { useEffect, useRef, useState } from 'react'
import GembaTable from './Gembatable.jsx'
import GembaStickerSheet from './GembaStickerSheet.jsx'
import { useStickerPrinter } from '../hooks/useStickerPrinter.js'
import { brand } from '../data.js'

const GEMBA_FLOW_URL = import.meta.env.VITE_GEMBA_FLOW_URL

export default function GembaScreen({ onBack }) {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  // Guards against React StrictMode's dev-only double-invoke of effects
  // (mount → effect → simulated unmount/remount → effect again). The ref
  // survives that simulated cycle, so the second pass sees it's already
  // true and skips re-calling the flow — only 1 real HTTP request goes out.
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    console.log('Flow URL : ', GEMBA_FLOW_URL)

    async function loadGembaData() {
      setStatus('loading')
      try {
        const res = await fetch(GEMBA_FLOW_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })

        if (!res.ok) throw new Error(`Flow returned ${res.status}`)

        const data = await res.json()
        console.log('Flow Response', data)

        setRecords(Array.isArray(data.value) ? data.value : [])
        setStatus('ready')
      } catch (err) {
        console.error('Failed to load Gemba records from flow:', err)
        setStatus('error')
      }
    }

    loadGembaData()
  }, [])

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
  } = useStickerPrinter(records, (r) => r.atqor_gembaid)

  if (status === 'loading') {
    return (
      <div className="app-shell">
        <div className="screen-only">
          <div className="panel">
            <div className="panel-header">
              <button className="back-btn" aria-label="Back" type="button" onClick={onBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1>Gemba Number Printing</h1>
            </div>
            <div className="panel-body">
              <div className="empty-state">Loading Gemba data…</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="app-shell">
        <div className="screen-only">
          <div className="panel">
            <div className="panel-header">
              <button className="back-btn" aria-label="Back" type="button" onClick={onBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1>Gemba Number Printing</h1>
            </div>
            <div className="panel-body">
              <div className="empty-state">
                Could not load Gemba data from the flow. Check the console and your VITE_GEMBA_FLOW_URL.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="screen-only">
        <GembaTable
          records={records}
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
              {/* <span className="preview-meta">
                100.4mm × 12mm · {selectedRecords.length * qty} label
                {selectedRecords.length * qty === 1 ? '' : 's'} will print
              </span> */}
            </div>
            {/* was selectedRecords.slice(0, 6) + a "+N more" line — now shows everything selected */}
            <div className="preview-strip gemba-preview-strip">
              {selectedRecords.map((r) => (
                <div className="sticker gemba-sticker preview-sticker gemba-preview-sticker" key={r.atqor_gembaid}>
                  <div className="sticker-line gemba-sticker-number">{r.atqor_gembanumber}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="print-only">
        <GembaStickerSheet ref={printRef} records={selectedRecords} qty={qty} brand={brand} />
      </div>
    </div>
  )
}