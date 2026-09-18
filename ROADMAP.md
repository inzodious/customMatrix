# NovaGrid Roadmap

**Status as of 2026-09-17.** Active development ran 2025-02-27 → 2025-03-13 (~45 commits); the last code commit of that run was `3c7d564 "Slight refactoring"`. **Phase 0 is complete as of 2026-09-17** — the project builds, packages and serves again. This file records where the visual actually stands and the ordered work required to finish it.

> Note: `README.md` is aspirational. It describes roughly twice the feature set that exists in code. See [README vs. reality](#readme-vs-reality) for the gap.

---

## Where it stands

### Working

- Matrix render from `dataView.matrix`: row hierarchy, sticky column headers, sticky row headers, sticky corner cell ([visual.ts:591](src/visual.ts#L591)).
- Per-node expand/collapse, state persisted across `update()` via `static savedExpandedState` ([visual.ts:71](src/visual.ts#L71)).
- Right-click menu — Copy Value plus expand/collapse this / level / all ([visual.ts:1414](src/visual.ts#L1414)), with batch animation orchestration.
- Client-computed subtotals and grand total row ([visual.ts:353](src/visual.ts#L353), [visual.ts:377](src/visual.ts#L377)).
- 8 formatting cards ([settings.ts](src/settings.ts)) wired to [capabilities.json](capabilities.json): general, borders, data values, column headers, row headers, subtotals, blank rows, grand total.
- Landing pages 1–3 (WELCOME / FEATURES / INSTRUCTIONS) with fade transitions, imported via `raw-loader` ([visual.ts:23-25](src/visual.ts#L23-L25)).

### The two known blockers, root-caused

**1. Animations — a CSS spec constraint, not a tuning problem.** *(Fixed 2026-09-17 in Phase 1 — kept here because it explains why.)*

The animated elements are `<tr>` elements: `transform: scaleY()`, `height`, and `overflow: hidden` ([visual.ts:1222-1242](src/visual.ts#L1222-L1242), [visual.less:200-242](style/visual.less#L200-L242)). Per the CSS Transforms spec, `transform` does not apply to `display: table-row` — Chrome/Edge silently discard it. `overflow` does not apply either, and `height` on a `<tr>` acts only as a *minimum* (content + `padding: 10px` sets the floor). Of the three animated properties, only `opacity` actually renders. The visible result is a fade plus a layout snap.

This is why `3c7d564` walked the keyframes back from bouncy `translateY` overshoot to plain `scaleY` — properties the browser was discarding either way — and why borders needed `fixHeaderBorders()` ([visual.ts:1074](src/visual.ts#L1074)) rewriting `cssText` with `!important` after every animation.

Fix: the row layer must stop being a `<table>`. Rows as `div`s in a CSS grid — or animating a wrapper `div` inside each cell — makes height/transform/overflow legal.

**2. Row limits — the fix was built, then reverted.** *(Fixed 2026-09-17: windowing restored and virtualization added.)*

`6b61ebe "Added and implemented some data api thingy"` added `dataReductionAlgorithm: { window: { count: 1000 } }` on rows / `100` on columns, plus `hasMoreData` / `isLoadingMore` state, a sticky "Load More Data" button, and `host.fetchMoreData(true)` with segment-append handling. One week later `bf3d941 "Reverted back to pre-fetch data api"` removed all of it.

[capabilities.json:526](capabilities.json#L526) now declares no `dataReductionAlgorithm`, so the visual runs on Power BI's default matrix reduction (a few hundred rows per level) with no way to fetch past it. The only remnant is orphaned `.load-more-button` CSS at [visual.less:269](style/visual.less#L269).

A second limit compounds this: every row is always in the DOM — collapse only sets `display: none` ([visual.less:162](style/visual.less#L162)) — and `applyFormatting` ([visual.ts:970](src/visual.ts#L970)) writes ~8 inline styles per cell, after which `formatCellsByType` re-walks and re-applies to every cell again. Fetching more data without virtualization would just move the failure.

---

## Phases

### Phase 0 — Get buildable again — **DONE (2026-09-17)**

The environment blockers are cleared and the visual builds and serves again.

- [x] Install Node. **Node 24.20.0** is installed. The "18 or 20 LTS" note above was stale — `powerbi-visuals-tools@7.2.1` declares `engines.node >= 20.19.0`, so Node 18 would in fact be rejected.
- [x] `npm i -D powerbi-visuals-tools@latest` → **7.2.1**, now in [package.json](package.json) `devDependencies`; `pbiviz` resolves from `node_modules/.bin`. `apiVersion` verified: [pbiviz.json](pbiviz.json) declares `5.11.0`, which matches the installed `powerbi-visuals-api@5.11.0` and clears the tools' `minAPIversion` of `4.7.0`. Left as-is (latest API is 5.11.1; no reason to bump).
- [x] Added [.gitignore](.gitignore) (`node_modules/`, `.tmp/`, `dist/`, `*.pbiviz`, `webpack.statistics.*.html`, logs, OS cruft) and ran `git rm -r --cached`. Tracked files went **9,018 → 20**.
- [x] `pbiviz start` confirmed running — serves `https://localhost:8080`, `/assets/status` returns `200` and `/assets/visual.js` returns the ~1.4 MB bundle. Hot rebuild on source change works.
- [x] Fixed the `getFormattingModel()` crash — `this.formattingSettings` is now populated in the constructor, with a defensive guard in `getFormattingModel()` itself.
- [x] Fixed border color default `"#FFFFF"` → `"#FFFFFF"` ([settings.ts:70](src/settings.ts#L70)).

**Certificate generation needs a workaround on this machine.** `powerbi-visuals-tools` hardcodes `pwsh` (PowerShell 7) to create the dev certificate on Windows (`lib/CertificateTools.js`, `createCertFile`), and only Windows PowerShell 5.1 is installed here — so `pbiviz start` failed with `'pwsh' is not recognized`. Note that *verification* (`verifyCertFile`) already shells out to `powershell.exe`, so only creation is affected. The cert was generated manually with PowerShell 5.1 into `~/pbiviz-certs/` (`PowerBICustomVisualTest_public.pfx` + `PowerBICustomVisualTestPass.txt`, the passphrase file written with no trailing newline, since the tools read it verbatim). It expires **2027-09-17**. Either repeat that on renewal, or install PowerShell 7 to make `pbiviz install-cert` work natively.

**Still failing lint, deferred to Phase 4.** `pbiviz package` reports 6 `powerbi-visuals/no-inner-outer-html` errors ([visual.ts:189](src/visual.ts#L189), [812](src/visual.ts#L812), [1899](src/visual.ts#L1899), [1911](src/visual.ts#L1911), [1999](src/visual.ts#L1999), [2002](src/visual.ts#L2002)). They do not block the build, and replacing `innerHTML` is already a Phase 4 item.

### Phase 1 — Render-layer rewrite — **DONE (2026-09-17)**

The big one. Unblocks both known blockers. **Complete as of 2026-09-17.**

- [x] **Replace the `<table>` row layer with CSS-grid `div` rows — DONE (2026-09-17).** The whole render layer is `div`s now: `.matrix-grid` > `.grid-header` / `.grid-body` / `.grid-footer` > `.grid-row` > `.grid-cell`. No `table`, `thead`, `tbody`, `tfoot`, `tr`, `td` or `th` element is produced any more.

  Column alignment comes from a single `--grid-cols` track list published on the container by `applyGridTemplate()`; every row inherits it. That removed the per-cell `width`/`minWidth` inline styles entirely — each data cell used to carry two.

  Sticky behavior was ported to [visual.less](style/visual.less) with an explicit stacking order (data cells < row headers `20` < header row `30` < corner cell `40`). The corner cell's inline five-property `!important` block is gone.

  **`fixHeaderBorders()` is deleted, along with `restoreBorderStyles()` and all `data-border-state` bookkeeping.** Borders sit on `.grid-cell` and survive an animation on a div row, so there is nothing left to repair afterwards. Four call sites went with it.

  Animation timing is restored to the pre-`3c7d564` feel — `0.2s` with the 30% overshoot keyframe — because `transform` now actually renders. A `prefers-reduced-motion` guard was added.

  Verified against the built bundle under jsdom, 29 checks across two suites: structure (no legacy table elements, `--grid-cols` emitted, one header cell + N data cells per row, grand total in the footer, no leftover width styles) and the full animation lifecycle (toggle → `.collapsing-wave` + measured `--row-height` + stagger delay → `animationend` → `.collapsed` and every inline style cleaned up, then the same in reverse for expand).

  **Not verified: appearance.** jsdom has no layout or CSS engine, so these tests prove DOM structure and class/style lifecycle, not that the grid *looks* right. Column widths, sticky offsets, border seams and the animation itself need eyes on a real Developer Visual.

  **Three selector bugs found and fixed after the fact (2026-09-17).** The first conversion pass missed three query selectors that still named `tr`, and every one of them failed *silently* rather than throwing:

  | Selector | Symptom |
  | --- | --- |
  | `tr[data-node-id=...] .toggle-button` | chevron never flipped between ▲ and ▼ |
  | `tr[data-level=...] .toggle-button` | "expand/collapse all at this level" did nothing |
  | `tr .toggle-button` | "expand all" / "collapse all" did nothing |

  All three are now covered by a context-menu regression suite (8 checks) driving real click events. Lesson for the remaining phases: a `grep` for `tr[` is not sufficient — the sweep needs to cover every `querySelector` string that names a table element.
- [x] **Add row virtualization — DONE (2026-09-17).** The matrix tree is flattened once into a preorder `rowModel`; `computeVisibleRows()` narrows it to rows whose ancestors are all expanded; `renderVisibleWindow()` builds DOM only for the slice around the scroll offset, bracketed by two `.grid-spacer` divs that stand in for the rows above and below so the scrollbar stays honest. Below `VIRTUAL.THRESHOLD` (150) rows the slice is simply everything, so ordinary reports keep the simple path.

  **The interaction layer is now model-driven, not DOM-driven.** `updateExpandedState`, `findAllDescendants` and `setChildrenCollapsed` are deleted — all three walked the DOM for rows that no longer exist when collapsed. Expand and collapse changed shape accordingly: collapsing animates the rows that are on screen and *then* repaints (dropping them from the DOM); expanding repaints first so the rows exist, then animates what actually landed. The batch operations (expand/collapse all, and by level) now select from the model and animate only what is on screen, which is most of why that block got shorter.

  Measured on the built bundle (2 columns per row):

  | Rows in model | Rows in DOM | Cells | `update()` |
  | ---: | ---: | ---: | ---: |
  | 60 | 60 | 186 | 84 ms |
  | 300 | 41 | 129 | 21 ms |
  | 1,200 | 41 | 129 | 18 ms |
  | 2,400 | 41 | 129 | 18 ms |

  Render cost is flat past the threshold instead of linear. At 1,200 rows the DOM holds 1/29 of them.

  Verified by a 12-check suite plus 41 checks of existing coverage re-run against it: window sizing, spacer heights, scroll handling, and that collapsed rows leave the DOM while expand restores them before animating. **Still not verified: appearance and real scrolling.** jsdom reports zero layout, so the row height falls back to the 37px estimate and the scroll path is only smoke-tested — sticky headers during a fast scroll, and whether the window keeps up, need a real browser.
- [x] **Restore the reverted windowing — DONE (2026-09-17).** `dataReductionAlgorithm.window` is back on rows (`1000`) and columns (`100`) in [capabilities.json:533](capabilities.json#L533), along with `hasMoreData` / `isLoadingMore` state, the sticky Load More button, and `host.fetchMoreData(true)` with `operationKind === Append` handling. The orphaned `.load-more-button` CSS at [visual.less:269](style/visual.less#L269) is live again.

  Restored **by hand, not by cherry-picking** `6b61ebe`. That commit is not a clean pick: `bf3d941` did not simply revert it, it restored an older divergent implementation, so `git diff bf3d941 6b61ebe` also reverses unrelated work — and `3c7d564`'s refactoring landed on top afterwards. The four pieces (fields, segment detection, button refresh, and the two methods) were transplanted onto current `HEAD` instead.

  Verified against the built bundle under jsdom: no `metadata.segment` → no button; segment present → button renders; click → `host.fetchMoreData(true)` called exactly once; button enters disabled `Loading...`; `operationKind: Append` re-enables it.

  **Follow-up bug, found in Power BI and fixed (2026-09-17).** The first restore put `dataReductionAlgorithm.window` on *both* axes, exactly as `6b61ebe` had it, and Power BI rejected the binding outright: `InvalidOrMalformedDataShapeBinding_InvalidDataReductionInSecondary` — "DataWindow can not be used as the DataReduction Secondary algorithm." Only the primary axis (rows) may use `window`; columns now use `top: { count: 100 }`. The visual failed to load at all with a column field assigned.

  This is very likely the real reason `bf3d941` reverted the whole feature a week after `6b61ebe` landed. Note that [schema.capabilities.json](node_modules/powerbi-visuals-api/schema.capabilities.json) permits all four algorithms on both axes, so neither the schema nor `pbiviz package` catches this — only the service does.

### Field-test fixes (2026-09-17)

Five bugs found by running the visual against a live report, after Phase 1 landed. All five were invisible to the jsdom suites as they stood; each now has coverage.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Visual failed to load with a field in Columns | `dataReductionAlgorithm.window` was declared on **both** axes; only the primary may use it | columns use `top: { count: 100 }` |
| Cells shaded after a resize, white after any interaction | `refreshRows()` builds brand-new DOM, but formatting was only applied on initial build and on scroll | `renderVisibleWindow()` formats the window it just built, so every path formats |
| Expand/collapse painfully slow; collapse-all cascaded tier by tier | stagger was a flat 45 ms per row, so 40 rows meant 1,755 ms of delay before the last one moved | `ANIM.staggerFor()` shrinks the per-row delay to fit `MAX_STAGGER_TOTAL_MS` (240 ms) |
| Only level-0 row headers froze on horizontal scroll; values slid under the others | `.expandable-row { overflow: hidden }` is set on every row below level 0, and a clipping ancestor becomes the sticky containing context | overflow removed from `.expandable-row`; the wave classes still clip during the animation, which is the only time it is needed |
| Expand/collapse momentarily revealed rows under the frozen headers | **two causes, fixed in two passes.** First the keyframes animated `transform` (plus `will-change: transform` / `backface-visibility`), which makes the row a containing block. Removing those was not enough: the wave classes also set `overflow: hidden`, which makes the animating row a *scroll container*, and sticky resolves against the nearest scroll container | keyframes animate `height` + `opacity` only (zero `transform` left in the compiled CSS), and the wave classes use `overflow: clip`, which clips without creating a scroll container |
| A measure's format string ignored | resolution read `column.format` only. A format overridden in the report arrives as `objects.general.formatString`, which `valueFormatter.getFormatString()` reads and `getFormatStringByColumn()` does not | `resolveFormatString()` checks override → `column.format` → type default |

A `sticky-guard` suite now reads the compiled CSS and fails if any class that can sit between `.row-header` and `.table-container` reintroduces a scroll container or a containing block. It was checked against all three historical forms of the bug and catches each.

Three of these share a root cause worth remembering: **`position: sticky` is silently disabled by an ancestor that clips (`overflow: hidden`) or that establishes a containing block (`transform`, `will-change: transform`, `backface-visibility`).** Nothing errors; the element just stops sticking. One bug was the steady-state version (`.expandable-row`), the other the during-animation version (the keyframes).

---

### Phase 2 — Data correctness

- [ ] Use **leaf** columns for the column axis. `processColumns` ([visual.ts:466](src/visual.ts#L466)) takes only `matrix.columns.root.children` (level 0), so a 2-level column hierarchy misaligns every cell — `row.values[j]` is indexed by leaf column.
- [~] **Per-column format strings — DONE (2026-09-17).** `buildValueFormats()` resolves one format per leaf column, cycling through `valueSources`, so measure #2 no longer inherits measure #1's format. Verified: `$#,0` and `0.0%` on two measures render as `-$1,415,676` and `12.3%`. **Distinct measure headers are still outstanding** — Multiple measures currently all render the same header text from `valueSources[0]` ([visual.ts:629](src/visual.ts#L629)), and `cachedFormatString` ([visual.ts:202](src/visual.ts#L202)) applies measure #1's format to every column.
- [ ] Take real subtotals from parent-node `values` instead of summing leaves ([visual.ts:353](src/visual.ts#L353)). Leaf-summing is wrong for any non-additive measure — average, distinct count, ratio, YoY%. Declare a `subTotals` capability object so Power BI supplies them.
- [ ] Key node IDs off `node.identity`, not the display value ([visual.ts:1121](src/visual.ts#L1121)). Duplicate sibling labels currently collide and share expand state.
- [ ] Stop blanking legitimate zeros: `subtotal !== 0 ? … : ""` ([visual.ts:785](src/visual.ts#L785)).

### Phase 3 — The promised features

- [ ] Animations settings card — enable / style / duration — driving the now-functional animations.
- [ ] Dynamic coloring. Colors declare `instanceKind: ConstantOrRule` ([settings.ts:111](src/settings.ts#L111) and siblings), so the pane offers conditional formatting, but the code only reads `.value.value` and never reads per-node/per-cell `objects` from the dataView. Conditional formatting currently does nothing.
- [ ] Layout card: cell padding, row height, indentation. Indent is hardcoded `level * 20px` ([visual.ts:659](src/visual.ts#L659)); padding is hardcoded `10px` in LESS.
- [ ] Icon-set dropdown using the existing [assets/icon-collapsed.png](assets/icon-collapsed.png) / [icon-expanded.png](assets/icon-expanded.png) — unused leftovers from the 2025-03-01 "Image icon implementation, saving for later" commit. Toggles are currently hardcoded `▲`/`▼` ([visual.ts:718](src/visual.ts#L718)).

### Phase 4 — Power BI citizenship

Required for AppSource certification.

- [ ] `SelectionManager`: selection, cross-filtering, and `showContextMenu` delegating to the host. There is none today, so there is no cross-filtering and no highlighting, and the custom menu `preventDefault()`s Power BI's native menu ([visual.ts:1416](src/visual.ts#L1416)), removing drill-down, "show as table", and include/exclude.
- [ ] Tooltips via `ITooltipService`.
- [ ] Replace `innerHTML` landing pages with DOM construction. Raw `innerHTML` at [visual.ts:1911](src/visual.ts#L1911) has no `eslint-disable`, so `powerbi-visuals/no-inner-outer-html` will fail lint, and raw HTML injection blocks certification.
- [ ] Replace deprecated `document.execCommand('copy')` ([visual.ts:1496](src/visual.ts#L1496)).
- [ ] Fix the landing-page container leak: `hideLandingPage()` ([visual.ts:1923](src/visual.ts#L1923)) calls `createContainerElements()`, appending another container and another context menu each time; `showLandingPage()` wipes `target.innerHTML` and orphans the `contextMenu` reference.

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
