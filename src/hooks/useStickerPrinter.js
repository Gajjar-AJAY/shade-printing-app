import { useEffect, useRef, useState } from 'react'

// getId lets each screen tell the hook how to pull a unique id out of its
// record shape. Defaults to r.id (Shade). Gemba records use r.atqor_gembaid,
// so GembaScreen passes (r) => r.atqor_gembaid.
export function useStickerPrinter(allRecords, getId = (r) => r.id) {
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

  // Was hardcoded to r.id before — broke "select all" for any record shape
  // that doesn't have an `id` field (e.g. Gemba's atqor_gembaid).
  const toggleAll = (visibleRows) => {
    setSelectedIds((prev) => {
      const allSelected = visibleRows.length > 0 && visibleRows.every((r) => prev.has(getId(r)))
      const next = new Set(prev)
      if (allSelected) {
        visibleRows.forEach((r) => next.delete(getId(r)))
      } else {
        visibleRows.forEach((r) => next.add(getId(r)))
      }
      return next
    })
  }

  // Same bug: was `allRecords.filter((r) => selectedIds.has(r.id))`, which
  // silently returned [] for Gemba records since they have no r.id.
  const selectedRecords = allRecords.filter((r) => selectedIds.has(getId(r)))

  const handlePrint = () => {
    if (selectedRecords.length === 0) return
    setIsPrinting(true)
  }

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

  const resetSelection = () => setSelectedIds(new Set())

  return {
    selectedIds,
    toggleSelect,
    toggleAll,
    resetSelection,
    qty,
    setQty,
    search,
    setSearch,
    isPrinting,
    printRef,
    selectedRecords,
    handlePrint,
  }
}