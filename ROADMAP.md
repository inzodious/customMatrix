# NovaGrid Roadmap

**Status as of 2026-09-02.** Active development ran 2025-02-27 → 2025-03-13 (~45 commits); the last code commit was `3c7d564 "Slight refactoring"`. This file records where the visual actually stands and the ordered work required to finish it.

> Note: `README.md` is aspirational. It describes roughly twice the feature set that exists in code. See [README vs. reality](#readme-vs-reality) for the gap.

---

## Where it stands

### Working

- Matrix render from `dataView.matrix`: row hierarchy, sticky column headers, sticky row headers, sticky corner cell ([visual.ts:585](src/visual.ts#L585)).
- Per-node expand/collapse, state persisted across `update()` via `static savedExpandedState` ([visual.ts:71](src/visual.ts#L71)).
- Right-click menu — Copy Value plus expand/collapse this / level / all ([visual.ts:1408](src/visual.ts#L1408)), with batch animation orchestration.
- Client-computed subtotals and grand total row ([visual.ts:347](src/visual.ts#L347), [visual.ts:371](src/visual.ts#L371)).
- 8 formatting cards ([settings.ts](src/settings.ts)) wired to [capabilities.json](capabilities.json): general, borders, data values, column headers, row headers, subtotals, blank rows, grand total.
- Landing pages 1–3 (WELCOME / FEATURES / INSTRUCTIONS) with fade transitions, imported via `raw-loader` ([visual.ts:23-25](src/visual.ts#L23-L25)).

### The two known blockers, root-caused

**1. Animations — a CSS spec constraint, not a tuning problem.**

The animated elements are `<tr>` elements: `transform: scaleY()`, `height`, and `overflow: hidden` ([visual.ts:1216-1236](src/visual.ts#L1216-L1236), [visual.less:200-242](style/visual.less#L200-L242)). Per the CSS Transforms spec, `transform` does not apply to `display: table-row` — Chrome/Edge silently discard it. `overflow` does not apply either, and `height` on a `<tr>` acts only as a *minimum* (content + `padding: 10px` sets the floor). Of the three animated properties, only `opacity` actually renders. The visible result is a fade plus a layout snap.

This is why `3c7d564` walked the keyframes back from bouncy `translateY` overshoot to plain `scaleY` — properties the browser was discarding either way — and why borders needed `fixHeaderBorders()` ([visual.ts:1068](src/visual.ts#L1068)) rewriting `cssText` with `!important` after every animation.

Fix: the row layer must stop being a `<table>`. Rows as `div`s in a CSS grid — or animating a wrapper `div` inside each cell — makes height/transform/overflow legal.

**2. Row limits — the fix was built, then reverted.**

`6b61ebe "Added and implemented some data api thingy"` added `dataReductionAlgorithm: { window: { count: 1000 } }` on rows / `100` on columns, plus `hasMoreData` / `isLoadingMore` state, a sticky "Load More Data" button, and `host.fetchMoreData(true)` with segment-append handling. One week later `bf3d941 "Reverted back to pre-fetch data api"` removed all of it.

[capabilities.json:526](capabilities.json#L526) now declares no `dataReductionAlgorithm`, so the visual runs on Power BI's default matrix reduction (a few hundred rows per level) with no way to fetch past it. The only remnant is orphaned `.load-more-button` CSS at [visual.less:269](style/visual.less#L269).

A second limit compounds this: every row is always in the DOM — collapse only sets `display: none` ([visual.less:162](style/visual.less#L162)) — and `applyFormatting` ([visual.ts:964](src/visual.ts#L964)) writes ~8 inline styles per cell, after which `formatCellsByType` re-walks and re-applies to every cell again. Fetching more data without virtualization would just move the failure.

---

## Phases

### Phase 0 — Get buildable again

Blocked on environment: **Node is not installed on this machine** (no `node` on PATH, nothing in `Program Files\nodejs`, no nvm/fnm/volta/scoop install), and **`powerbi-visuals-tools` is not a dependency** — absent from both [package.json](package.json) and `package-lock.json`, with no `pbiviz` binary in `node_modules/.bin`. It was previously run from a global install. `npm start` / `npm run package` will fail until both are resolved.

Note: `node_modules` is committed to git — 8,982 of the repo's 9,017 tracked files, plus `.tmp/` build output, with no `.gitignore`. That is why the folder exists without an install.

- [ ] Install Node 18 or 20 LTS.
- [ ] `npm i -D powerbi-visuals-tools@latest`; verify `apiVersion` in [pbiviz.json](pbiviz.json) (currently `5.11.0`) against what the installed tools ship.
- [ ] Add `.gitignore` (`node_modules/`, `.tmp/`, `dist/`, `webpack.statistics.*.html`), then `git rm -r --cached node_modules .tmp`.
- [ ] Confirm `pbiviz start` runs and the visual loads in a Developer Visual.
- [ ] Fix the `getFormattingModel()` crash — it reads `this.formattingSettings`, set only in `updateVisualWithData`; with no data `update()` returns early ([visual.ts:166](src/visual.ts#L166)), so opening the Format pane throws (`.cards` of undefined). Populate defaults in the constructor.
- [ ] Fix border color default `"#FFFFF"` — five F's, invalid ([settings.ts:70](src/settings.ts#L70)).

### Phase 1 — Render-layer rewrite

The big one. Unblocks both known blockers.

- [ ] Replace the `<table>` row layer with CSS-grid `div` rows. Port the sticky-header and border behavior already solved; drop the `!important` firefighting in `fixHeaderBorders()`.
- [ ] Add row virtualization — render only the visible window plus overscan.
- [ ] Restore the reverted windowing: `dataReductionAlgorithm.window` on rows/columns, `fetchMoreData(true)`, and the Load More button (its CSS is still in `visual.less`). Cherry-pick `6b61ebe` for the implementation.

### Phase 2 — Data correctness

- [ ] Use **leaf** columns for the column axis. `processColumns` ([visual.ts:460](src/visual.ts#L460)) takes only `matrix.columns.root.children` (level 0), so a 2-level column hierarchy misaligns every cell — `row.values[j]` is indexed by leaf column.
- [ ] Per-column format strings and distinct measure headers. Multiple measures currently all render the same header text from `valueSources[0]` ([visual.ts:623](src/visual.ts#L623)), and `cachedFormatString` ([visual.ts:199](src/visual.ts#L199)) applies measure #1's format to every column.
- [ ] Take real subtotals from parent-node `values` instead of summing leaves ([visual.ts:347](src/visual.ts#L347)). Leaf-summing is wrong for any non-additive measure — average, distinct count, ratio, YoY%. Declare a `subTotals` capability object so Power BI supplies them.
- [ ] Key node IDs off `node.identity`, not the display value ([visual.ts:1115](src/visual.ts#L1115)). Duplicate sibling labels currently collide and share expand state.
- [ ] Stop blanking legitimate zeros: `subtotal !== 0 ? … : ""` ([visual.ts:779](src/visual.ts#L779)).

### Phase 3 — The promised features

- [ ] Animations settings card — enable / style / duration — driving the now-functional animations.
- [ ] Dynamic coloring. Colors declare `instanceKind: ConstantOrRule` ([settings.ts:111](src/settings.ts#L111) and siblings), so the pane offers conditional formatting, but the code only reads `.value.value` and never reads per-node/per-cell `objects` from the dataView. Conditional formatting currently does nothing.
- [ ] Layout card: cell padding, row height, indentation. Indent is hardcoded `level * 20px` ([visual.ts:653](src/visual.ts#L653)); padding is hardcoded `10px` in LESS.
- [ ] Icon-set dropdown using the existing [assets/icon-collapsed.png](assets/icon-collapsed.png) / [icon-expanded.png](assets/icon-expanded.png) — unused leftovers from the 2025-03-01 "Image icon implementation, saving for later" commit. Toggles are currently hardcoded `▲`/`▼` ([visual.ts:712](src/visual.ts#L712)).

### Phase 4 — Power BI citizenship

Required for AppSource certification.

- [ ] `SelectionManager`: selection, cross-filtering, and `showContextMenu` delegating to the host. There is none today, so there is no cross-filtering and no highlighting, and the custom menu `preventDefault()`s Power BI's native menu ([visual.ts:1410](src/visual.ts#L1410)), removing drill-down, "show as table", and include/exclude.
- [ ] Tooltips via `ITooltipService`.
- [ ] Replace `innerHTML` landing pages with DOM construction. Raw `innerHTML` at [visual.ts:1905](src/visual.ts#L1905) has no `eslint-disable`, so `powerbi-visuals/no-inner-outer-html` will fail lint, and raw HTML injection blocks certification.
- [ ] Replace deprecated `document.execCommand('copy')` ([visual.ts:1490](src/visual.ts#L1490)).
- [ ] Fix the landing-page container leak: `hideLandingPage()` ([visual.ts:1917](src/visual.ts#L1917)) calls `createContainerElements()`, appending another container and another context menu each time; `showLandingPage()` wipes `target.innerHTML` and orphans the `contextMenu` reference.

---

## README vs. reality

Promised in [README.md](README.md), absent from code:

| README claim | Reality |
| --- | --- |
| Animations settings card (enable / style / duration) | No such card; animation params hardcoded in LESS |
| Dynamic coloring — color scale / rules / value-based | Pickers exist, per-cell `objects` never read; no effect |
| Cell padding, row height, header indentation settings | Hardcoded: `10px` padding, `level * 20px` indent |
| Selectable icon sets for hierarchy | Hardcoded `▲`/`▼`; PNG assets unused |
| Performance-focused, smooth with large datasets | No virtualization; all rows in DOM; formatting applied twice per cell |

Either build these in Phase 3, or trim the README to match shipped behavior before publishing a release.

---

## Assessment

Appearance was close and the plumbing was further along than it looked, but both known blockers share one root cause — the `<table>` element — and clearing it is a genuine rewrite of the render layer rather than a patch. Everything above that layer (settings model, expand/collapse state management, context menu, subtotal logic) is reusable.
