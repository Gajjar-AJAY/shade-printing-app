import { useMemo, useState } from 'react'

// NOTE: Table only shows Gemba Number per current requirement. Other fields
// intentionally not rendered/filtered here.
export default function GembaTable({
  records,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  qty,
  onQtyChange,
  onPrint,
  search,
  onSearchChange,
  onBack,
}) {
  const [hoveredRow, setHoveredRow] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return records
    return records.filter((r) =>
      r.atqor_gembanumber.toLowerCase().includes(q)
    )
  }, [records, search])

  const allVisibleSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.atqor_gembaid))
  const selectedCount = selectedIds.size

  return (
    <div className="panel">
      <div className="panel-header">
        {onBack && (
          <button className="back-btn" aria-label="Back" type="button" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <h1>Gemba Number Printing</h1>
      </div>

      <div className="panel-body">
        <div className="search-row">
          <svg className="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search Gemba number…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className="clear-btn" type="button" onClick={() => onSearchChange('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th className="col-check">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={() => onToggleAll(filtered)}
                    aria-label="Select all visible rows"
                  />
                </th>
                <th>Gemba Number</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const checked = selectedIds.has(r.atqor_gembaid)
                return (
                  <tr
                    key={r.atqor_gembaid}
                    className={checked ? 'row-selected' : ''}
                    onMouseEnter={() => setHoveredRow(r.atqor_gembaid)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onToggleSelect(r.atqor_gembaid)}
                  >
                    <td className="col-check" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={checked} onChange={() => onToggleSelect(r.atqor_gembaid)} />
                    </td>
                    <td className="mono strong">{r.atqor_gembanumber}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  {/* was colSpan={5} — only 2 columns now (checkbox + Gemba Number) */}
                  <td colSpan={2} className="empty-state">
                    No Gemba numbers match “{search}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-footer">
        <div className="selected-count">
          Selected: <strong>{selectedCount}</strong> Gemba Number{selectedCount === 1 ? '' : 's'}
        </div>
        <div className="qty-control">
          <span className="qty-label">QTY</span>
          <button type="button" onClick={() => onQtyChange(Math.max(1, qty - 1))} aria-label="Decrease quantity">
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => onQtyChange(Math.max(1, Number(e.target.value) || 1))}
          />
          <button type="button" onClick={() => onQtyChange(qty + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button className="print-btn" type="button" disabled={selectedCount === 0} onClick={onPrint}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6v-7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Print Gemba Number
        </button>
      </div>
    </div>
  )
}