import { useMemo, useState } from 'react'

function formatDate(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  let hours = d.getHours()
  const minutes = pad(d.getMinutes())
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(hours)}:${minutes} ${ampm}`
}

export default function ShadeTable({ records, selectedIds, onToggleSelect, onToggleAll, qty, onQtyChange, onPrint, search, onSearchChange }) {
  const [hoveredRow, setHoveredRow] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return records
    return records.filter((r) =>
      r.shadeNumber.toLowerCase().includes(q) ||
      r.dyeLots.join(' ').toLowerCase().includes(q) ||
      r.recipe.toLowerCase().includes(q)
    )
  }, [records, search])

  const allVisibleSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id))
  const selectedCount = selectedIds.size

  return (
    <div className="panel">
      <div className="panel-header">
        <button className="back-btn" aria-label="Back" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1>Shade Number Printing</h1>
      </div>

      <div className="panel-body">
        <div className="search-row">
          <svg className="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search shade number, dye lot or recipe…"
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
                <th>Shade Number</th>
                <th>Dye Lots</th>
                <th>Recipe</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const checked = selectedIds.has(r.id)
                return (
                  <tr
                    key={r.id}
                    className={checked ? 'row-selected' : ''}
                    onMouseEnter={() => setHoveredRow(r.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onToggleSelect(r.id)}
                  >
                    <td className="col-check" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={checked} onChange={() => onToggleSelect(r.id)} />
                    </td>
                    <td className="mono strong">{r.shadeNumber}</td>
                    <td className="mono muted">{r.dyeLots.join(', ')}</td>
                    <td>
                      <span className="recipe-link">{r.recipe}</span>
                      <span className="recipe-status"> - {r.recipeStatus}</span>
                    </td>
                    <td className="muted">{formatDate(r.createdOn)}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No shade numbers match “{search}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-footer">
        <div className="selected-count">
          Selected: <strong>{selectedCount}</strong> Shade Number{selectedCount === 1 ? '' : 's'}
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
          Print shade Number
        </button>
      </div>
    </div>
  )
}
