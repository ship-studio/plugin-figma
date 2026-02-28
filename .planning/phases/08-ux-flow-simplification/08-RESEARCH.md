# Phase 8: UX Flow Simplification - Research

**Researched:** 2026-02-28
**Domain:** React UI refactoring (component decomposition, state consolidation, CSS-in-JS)
**Confidence:** HIGH

## Summary

Phase 8 is a UI-only refactoring of `MainView.tsx` (739 lines). The current flow renders three separate result sections (extraction stats, asset export stats, brief result) as individual `figma-plugin-section` blocks that appear sequentially. The user decision is to merge these into a single "brief is ready" result card with the copy button as the most prominent element, stats below, component badges, tree preview toggle, asset warnings, and composition detection info -- all within one card.

The pipeline logic (extraction -> export -> brief) does not change. The data flowing through `ExportResult.warnings` already carries composition detection messages (e.g., `Auto-detected "X" as a composition`). The `BriefResult.stats` already has `nodeCount`, `assetCount`, `estimatedTokens`. The `ExtractionStats` already has component badges. This is purely a view-layer merge with progress indicator improvement.

**Primary recommendation:** Decompose `MainView.tsx` into a `ResultCard` component that receives `extractionResult`, `extractionStats`, `exportResult`, and `briefResult` as props. Consolidate the three separate progress spinners into a single spinner with updating status text. No new libraries or dependencies needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Keep scope selection (This element / This section / Whole page) -- users need this
- Keep file info section as-is (file key, node ID, file type) -- helps verify the right file is selected
- Merge the 3 separate result sections (extraction stats, asset export stats, brief result) into one combined result card
- Intermediate result sections (extraction complete, assets exported) should not appear as standalone sections -- their data folds into the merged card
- Copy button is the most prominent element -- at the top of the result card
- Stats below the copy button (layers, assets, tokens, etc.)
- Component badges (Button x3, Card x2) stay in the merged card
- Tree preview toggle stays in the merged card as a collapsible section
- Asset warnings displayed within the card (existing pattern, just relocated)
- Token warning banner stays when brief exceeds threshold
- Composition detection results appear in the merged result card (not before extraction)

### Claude's Discretion
- Progress indicator design (single spinner with updating text vs. step indicator vs. other)
- Composition result presentation style (inline stat vs. callout)
- Exact layout and spacing of the merged result card
- Whether to keep the "Also saved to .shipstudio/brief.md" note

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UX-02 | Plugin flow is simplified with fewer visible steps | Merging 3 result sections into 1 card eliminates 2 visual steps. Single progress indicator replaces 3 separate spinners. Result card layout documented with exact data sources from existing types. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x (via host) | UI rendering | Already in use, provided by Ship Studio host |
| TypeScript | ^5.6 | Type safety | Already in use |
| Vite | ^6 | Build tool | Already in use |

### Supporting
No new libraries needed. This phase is purely a refactoring of existing UI code.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline styles (current) | CSS classes in styles.ts | Consistency with existing pattern; the project already uses a mix of CSS classes and inline styles. New result card styles should go into `PLUGIN_CSS` in `styles.ts` for the card-level class, while layout details can remain inline for flexibility. |

## Architecture Patterns

### Current File Structure (relevant)
```
src/
├── views/
│   └── MainView.tsx       # 739 lines -- PRIMARY refactor target
├── components/
│   └── Modal.tsx           # Reusable modal shell
├── styles.ts               # CSS-in-JS (PLUGIN_CSS string)
├── types.ts                # Core plugin types
├── assets/
│   └── types.ts            # ExportResult, AssetExportProgress
└── brief/
    └── types.ts            # BriefResult, BriefStats
```

### Pattern 1: Component Extraction for Result Card
**What:** Extract the merged result card into a dedicated component, either inline in MainView.tsx or as a new file at `src/components/ResultCard.tsx`.
**When to use:** When a single component exceeds ~200 lines and has a clear "unit of UI" boundary.
**Recommendation:** Keep it inline in MainView.tsx as a named function component to avoid prop drilling complexity. The card needs `extractionResult`, `extractionStats`, `exportResult`, `briefResult`, `showTree`, `setShowTree`, and `handleCopyBrief`. Keeping it in the same file avoids a large props interface while still being readable.

```typescript
// Inline component in MainView.tsx
function ResultCard({
  extractionResult,
  extractionStats,
  exportResult,
  briefResult,
  showTree,
  onToggleTree,
  onCopyBrief,
}: ResultCardProps) {
  // Only render when briefResult is available (the final state)
  if (!briefResult) return null;

  return (
    <div className="figma-plugin-result-card">
      {/* 1. Copy button -- most prominent */}
      <button className="btn-primary" onClick={onCopyBrief} style={{ width: '100%' }}>
        Copy Brief to Clipboard
      </button>

      {/* 2. Stats row */}
      <div className="figma-plugin-result-stats">
        {briefResult.stats.nodeCount} layers · {briefResult.stats.assetCount} assets · ~{Math.round(briefResult.stats.estimatedTokens / 1000)}K tokens
      </div>

      {/* 3. Composition callout (if any) */}
      {/* 4. Component badges */}
      {/* 5. Asset warnings */}
      {/* 6. Token warning banner */}
      {/* 7. Tree preview toggle */}
      {/* 8. File save note (discretionary) */}
    </div>
  );
}
```

### Pattern 2: Single Progress Indicator with Updating Text
**What:** Replace the 3 separate spinner sections with one spinner that updates its label as the pipeline progresses through stages.
**When to use:** When multiple sequential async operations should feel like one continuous process.
**Recommendation:** A single spinner with updating text is the simplest and most aligned with the "fewer steps" goal. Use a derived label from existing state:

```typescript
// Compute progress label from existing boolean states
const progressLabel = extracting
  ? 'Extracting layout...'
  : exportingAssets
    ? assetProgress?.phase === 'preview'
      ? 'Rendering preview...'
      : `Exporting assets (${assetProgress?.current ?? 0}/${assetProgress?.total ?? 0})...`
    : generatingBrief
      ? 'Generating brief...'
      : null;

// Single progress section
{progressLabel && (
  <div className="figma-plugin-section">
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="figma-plugin-spinner" />
      <span style={{ color: 'var(--text-secondary)' }}>{progressLabel}</span>
    </div>
  </div>
)}
```

### Pattern 3: Composition Count from Warnings
**What:** Extract composition count from `ExportResult.warnings` to display in the result card.
**When to use:** When the data is already available but encoded in a string array.
**Detail:** Composition warnings follow the format `Auto-detected "X" as a composition`. Count them:

```typescript
const compositionCount = exportResult
  ? exportResult.warnings.filter(w => w.includes('as a composition')).length
  : 0;
```

Alternatively, count assets with `assetType === 'composition'`:
```typescript
const compositionCount = exportResult
  ? exportResult.assets.filter(a => a.assetType === 'composition').length
  : 0;
```

**Recommendation:** Use the `assets` array approach -- it's more robust than string matching on warnings and counts only successfully exported compositions.

### Anti-Patterns to Avoid
- **Premature extraction:** Don't create a separate file for ResultCard unless the resulting MainView.tsx is still over ~500 lines after the merge. Adding a file adds import/export ceremony and prop type overhead.
- **State duplication:** Don't add new state variables to track "merged result ready." Use the existing `briefResult !== null` as the signal that the full pipeline is complete, since brief generation is the last step.
- **Removing intermediate state variables:** Keep `extractionResult`, `exportResult`, `briefResult` as separate state hooks. They serve as the progressive data accumulation that the result card reads. The change is in rendering (single card) not in data flow.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Progress stages | Multi-step progress bar component | Single spinner with derived text label | The pipeline has only 3 stages and runs fast; a progress bar adds visual complexity without value |
| CSS animations | Custom animation for card appearance | None (instant render) | CONTEXT.md says nothing about animations; keep it simple |

**Key insight:** This phase is a view-layer rearrangement, not a new feature. The data pipeline and all business logic remain untouched. Resist the temptation to refactor the data flow -- only the JSX rendering changes.

## Common Pitfalls

### Pitfall 1: Breaking the Pipeline Chain
**What goes wrong:** Refactoring the JSX accidentally disconnects the `extractionResult -> exportAssets -> generateBrief` callback chain.
**Why it happens:** The chain is wired through `handleExtract` -> `runAssetExport` -> `setTimeout(generateBrief)` with state setters at each stage. Moving JSX is safe; touching the handlers or state setters risks breaking the chain.
**How to avoid:** Only modify the render return block. Leave all `useState`, `useCallback`, `useEffect`, and `useMemo` hooks untouched.
**Warning signs:** After refactoring, the "Get Brief" button should still trigger the full pipeline to completion without additional user interaction.

### Pitfall 2: Result Card Showing Stale Data
**What goes wrong:** The merged result card renders with data from a previous run because not all states were cleared.
**Why it happens:** `handleUrlChange` and `handleExtract` both have "clear state" blocks that reset extraction, export, and brief states. If the result card relies on any new state not included in these reset blocks, stale data persists.
**How to avoid:** Don't add new state variables. Use only existing state for the result card. The existing clear blocks already handle `extractionResult`, `exportResult`, `briefResult`.
**Warning signs:** Changing the URL or clicking Extract again shows old data mixed with new data.

### Pitfall 3: Extract Button Text Regression
**What goes wrong:** The Extract button (line 735) uses a ternary chain to show "Extracting...", "Exporting assets...", "Generating brief..." as labels. If the separate spinner sections are removed but this button text logic is also removed, the user has no feedback during processing.
**Why it happens:** The button text serves double duty as both a disabled-state indicator and a progress indicator.
**How to avoid:** Keep the button text ternary as-is OR move it to the new single progress spinner. The button should remain disabled during all three phases.
**Warning signs:** Button shows "Get Brief" while the pipeline is actively running.

### Pitfall 4: Large Tree Warning Flow
**What goes wrong:** The large tree warning (`awaitingLargeTreeConfirm`) appears between extraction and export. If it's accidentally hidden by the new merged result card logic, users can't confirm/cancel large trees.
**Why it happens:** The large tree warning is NOT part of the result card -- it's an interrupt in the pipeline. It must remain as a standalone section.
**How to avoid:** The large tree warning section stays exactly where it is. It appears BEFORE the result card (which only renders when `briefResult` is available, which is after the warning is resolved).

## Code Examples

### Current UI Sections to Merge (3 -> 1)

**Section 1: Extraction Result (lines 550-618)**
Shows: checkmark, "Layout extracted", node count, text count, component badges, tree preview toggle.
Data sources: `extractionResult`, `extractionStats`.

**Section 2: Asset Export Result (lines 636-661)**
Shows: checkmark, "Assets exported", asset count, warnings list.
Data sources: `exportResult`.

**Section 3: Brief Result (lines 681-726)**
Shows: checkmark, "Brief ready", stats (layers, assets, tokens), token warning, copy button, file save note.
Data sources: `briefResult`.

### Merged Result Card Layout

```typescript
{/* Merged Result Card -- renders only when brief is complete */}
{briefResult && extractionResult && extractionStats && exportResult && (
  <div className="figma-plugin-section">
    <div className="figma-plugin-file-info">
      {/* Success header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ color: '#38a169' }}>&#10003;</span>
        <span style={{ fontWeight: 600, fontSize: '13px' }}>Brief ready</span>
        {extractionResult.truncated && (
          <span style={{ color: '#f59e0b', fontSize: '11px' }}>(truncated)</span>
        )}
      </div>

      {/* Copy button -- most prominent */}
      <button
        className="btn-primary"
        onClick={handleCopyBrief}
        style={{ width: '100%', marginBottom: '12px' }}
      >
        Copy Brief to Clipboard
      </button>

      {/* Stats row */}
      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.6 }}>
        {briefResult.stats.nodeCount} layers &middot;{' '}
        {briefResult.stats.assetCount} assets &middot;{' '}
        <span style={{
          color: briefResult.stats.estimatedTokens > TOKEN_WARNING_THRESHOLD
            ? '#f59e0b'
            : 'inherit',
        }}>
          ~{Math.round(briefResult.stats.estimatedTokens / 1000)}K tokens
        </span>
      </div>

      {/* Composition count (if any detected) */}
      {(() => {
        const compCount = exportResult.assets.filter(a => a.assetType === 'composition').length;
        return compCount > 0 ? (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#f59e0b' }}>
            {compCount} composition{compCount !== 1 ? 's' : ''} exported as PNG
          </div>
        ) : null;
      })()}

      {/* Token warning banner */}
      {briefResult.stats.estimatedTokens > TOKEN_WARNING_THRESHOLD && (
        <div className="figma-plugin-warning" style={{ marginTop: '8px' }}>
          <strong>This brief is large</strong>
          <p>Consider extracting a smaller section for better results.</p>
        </div>
      )}

      {/* Component badges */}
      {extractionStats.components.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>Components</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {extractionStats.components.slice(0, 8).map((c) => (
              <span key={c.name} style={{ /* existing badge styles */ }}>
                {c.name}{c.count > 1 ? ` x${c.count}` : ''}
              </span>
            ))}
            {extractionStats.components.length > 8 && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '2px 4px' }}>
                +{extractionStats.components.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Asset warnings */}
      {exportResult.warnings.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#f59e0b' }}>
          {exportResult.warnings.length} warning{exportResult.warnings.length !== 1 ? 's' : ''}:
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
            {exportResult.warnings.slice(0, 5).map((w, i) => (
              <li key={i}>{w}</li>
            ))}
            {exportResult.warnings.length > 5 && (
              <li>...and {exportResult.warnings.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {/* Tree preview toggle */}
      <button
        onClick={() => setShowTree(!showTree)}
        style={{
          background: 'none', border: 'none',
          color: 'var(--accent, #0d99ff)',
          fontSize: '11px', cursor: 'pointer',
          padding: '4px 0', marginTop: '8px',
        }}
      >
        {showTree ? 'Hide tree' : 'Show tree preview'}
      </button>
      {showTree && (
        <div style={{ marginTop: '6px', padding: '8px', background: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border)', maxHeight: '200px', overflowY: 'auto' }}>
          <TreePreview nodes={extractionResult.rootNodes} />
        </div>
      )}

      {/* File save note */}
      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
        Also saved to .shipstudio/brief.md
      </div>
    </div>
  </div>
)}
```

### Single Progress Indicator

```typescript
{/* Progress indicator -- single spinner for all stages */}
{(extracting || exportingAssets || generatingBrief) && (
  <div className="figma-plugin-section">
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="figma-plugin-spinner" />
      <span style={{ color: 'var(--text-secondary)' }}>
        {extracting
          ? 'Extracting layout...'
          : exportingAssets
            ? assetProgress?.phase === 'preview'
              ? 'Rendering preview...'
              : `Exporting assets (${assetProgress?.current ?? 0}/${assetProgress?.total ?? 0})...`
            : 'Generating brief...'}
      </span>
    </div>
  </div>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate result sections per pipeline stage | Merged result card | Phase 8 (this phase) | Reduces visual noise from 3 sections to 1 |
| Three separate spinners | Single updating spinner | Phase 8 (this phase) | Makes 3-step pipeline feel like a single operation |

## Open Questions

1. **File save note retention**
   - What we know: CONTEXT.md lists this as Claude's discretion
   - Recommendation: Keep it. It's one line of text and tells the user where the file was saved. Low cost, high value for users who want to access the brief later.

2. **Composition callout vs inline stat**
   - What we know: CONTEXT.md lists this as Claude's discretion. The data is available via `exportResult.assets.filter(a => a.assetType === 'composition').length`.
   - Recommendation: Use an inline stat with amber color -- consistent with the warning color scheme already used for asset warnings. A callout box would add visual weight to something that's informational, not actionable.

3. **Progress indicator style**
   - What we know: CONTEXT.md lists this as Claude's discretion. Current approach is 3 spinners.
   - Recommendation: Single spinner with updating text label. A step indicator (1/3, 2/3, 3/3) adds visual complexity and implies the user needs to wait for 3 discrete steps, which contradicts the "fewer steps" goal. A single spinner with changing text makes it feel like one continuous operation.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of `MainView.tsx` (739 lines), `styles.ts`, `types.ts`, `assets/types.ts`, `brief/types.ts`, `assets/export.ts`, `assets/detect-composition.ts`
- CONTEXT.md locked decisions and discretion areas

### Secondary (MEDIUM confidence)
- None needed -- this is purely an internal UI refactoring with no external dependencies

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries; pure refactoring of existing React/TypeScript code
- Architecture: HIGH - Pattern is straightforward component decomposition with existing data types
- Pitfalls: HIGH - Identified from direct code analysis of state management and pipeline chain in MainView.tsx

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable -- internal UI refactoring, no external API changes)
