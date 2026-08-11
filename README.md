# Shade Number Printing

React + Vite app that mirrors the "Shade Number Printing" data screen and prints
34mm × 20mm shade stickers for the selected rows.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

## What's inside

- `src/data.js` — mock shade records (Shade Number, Dye Lots, Recipe, Created On, comp count).
  Replace `shadeRecords` with a real fetch (Dataverse / SharePoint list / API) when you wire up a backend.
- `src/components/ShadeTable.jsx` — the data table: search box, select-all + per-row checkboxes,
  a shared QTY stepper, and the "Print shade Number" button.
- `src/components/StickerSheet.jsx` — the actual printable output. For every selected row it repeats
  a `<Sticker/>` `qty` times, in the order the rows were selected.
- `src/App.jsx` — holds selection/qty/search state, shows a live on-screen sticker preview, and triggers
  `window.print()` once the print-only sticker sheet has rendered.
- `src/App.css` — styling, plus the `@media print` block that does the actual label sizing.

## Layout: 3 stickers per row, one exactly-sized page

Matches the physical label roll (3 labels across, then the next set below it). `StickerSheet.jsx` lays every
selected copy out in a CSS grid (`grid-template-columns: repeat(3, 34mm)`), and computes the page size from
however many rows that produces — so the print job is always **exactly one page**, sized to fit the content
with no leftover blank page:

```js
const rowCount = Math.ceil(jobs.length / 3)
const pageWidthMM = 3 * 34   // 102mm
const pageHeightMM = rowCount * 20
```

```jsx
<style>{`@page { size: ${pageWidthMM}mm ${pageHeightMM}mm; margin: 0; }`}</style>
```

That `<style>` tag is re-injected on every print with the current selection's row count, which is what removes
the whitespace you'd get from a fixed/default page size. If the last row has fewer than 3 stickers, those grid
cells are simply left blank (the same way a physical label roll leaves unused label positions).

Only `.print-only` (the sticker sheet) is visible in print media; the on-screen table and preview
(`.screen-only`) are hidden.

### Print dialog checklist

- **Margins → None.** Some browsers keep their own default margin even with CSS `@page { margin: 0 }` unless
  you also set this in the dialog — this is almost always what causes the big blank border around the labels.
- **Paper size → the browser should auto-detect the custom size** (it'll show something like "102 x 40mm" /
  "Custom" once your selection determines the row count). If it doesn't and falls back to A4/Letter, pick
  **More settings → Paper size → Custom** and enter the width/height shown in the preview panel's "N per row"
  label, or use **Save as PDF** first to confirm the page size looks right before sending it to the label
  printer.
- **Scale → 100%.** Don't let "Fit to page" resize the labels.

If your label printer's own driver/app doesn't accept a custom page size from the OS print dialog, use
**Save as PDF** with the settings above, then send that PDF to the printer's native label software.

## Sticker content

Each label prints, top to bottom:

1. `{comp} COMP` — component count for that shade
2. Shade Number (bold, the largest line)
3. First dye lot for that shade
4. `ARVIND {M}/{YY} {operatorCode}` — brand, print month/year, operator/machine code

Edit `brand` in `src/data.js` (company name, operator code) and the field mapping inside
`Sticker` in `StickerSheet.jsx` if your label format differs.

## Selection → print quantity

The footer's QTY field is shared across the whole selection (matching the reference screenshot) — it's a
"print N copies of each selected shade" multiplier, not a per-row quantity. Selecting 4 shades with QTY = 3
prints 12 stickers total, grouped by shade.
