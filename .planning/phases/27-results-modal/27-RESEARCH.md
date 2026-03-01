# Phase 27: Results Modal - Research

**Researched:** 2026-03-01
**Domain:** React UI component / Figma plugin modal UX
**Confidence:** HIGH

## Summary

Phase 27 replaces the inline "Merged Result Card" in MainView.tsx (lines 662-790) with a dedicated results modal that appears after brief generation completes. The modal must surface a success message, a primary "Copy to clipboard" CTA, guidance to paste into Claude Code, an iterative refinement encouragement, and an expandable details panel (assets, layout tree, tokens) -- all collapsed by default. Dismissing the modal must clear stale state so a fresh brief can be generated.

The project already has a reusable `Modal` component (`src/components/Modal.tsx`) with overlay, header, body, escape-to-close, and overlay-click-to-close. The CSS infrastructure lives in `src/styles.ts` as a JS string constant injected into the DOM. All UI uses CSS variables from the host Ship Studio app (`--bg-primary`, `--text-primary`, `--accent`, etc.) and two button classes (`btn-primary`, `btn-secondary`) provided by the host. No external UI libraries are used -- all components are hand-written React with inline styles and the plugin's CSS classes.

**Primary recommendation:** Create a new `ResultsModal` component in `src/components/ResultsModal.tsx` that wraps the existing `Modal` shell and receives `briefResult`, `extractionResult`, `extractionStats`, and `exportResult` as props. MainView triggers it via a boolean `showResultsModal` state set to `true` when `briefResult` is populated. The inline result card block is removed entirely.

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RSLT-01 | Results view is a clean modal stating the brief is ready | Existing `Modal` component provides the shell. New `ResultsModal` component adds success header with checkmark and "Brief ready" message. |
| RSLT-02 | Results modal includes a copy-to-clipboard button | Existing `handleCopyBrief` callback and `copyToClipboard` function from `src/brief/io.ts` are reused. Button uses `btn-primary` class, full-width. |
| RSLT-03 | Results modal tells user to paste the brief into their agent | Static instructional text below the copy button: "Paste into Claude Code (or your agent) to start building" |
| RSLT-04 | Results modal warns about potential mistakes and encourages refinement | Static message about AI imperfection: "The build may not be perfect on the first try -- refine iteratively by giving feedback" |
| RSLT-05 | Results modal has an expandable "View details" section with assets, layout tree, and tokens | Collapsible `<details>` or toggle button revealing three subsections. Reuses existing `TreePreview` component and stats rendering patterns from current inline card. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x (host-provided) | UI components | Already used throughout plugin |
| TypeScript | 5.6+ | Type safety | Already configured in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | All UI is hand-written with host CSS variables |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-written modal | Radix Dialog / Headless UI | Would add dependency for a single component; existing Modal already works |
| CSS-in-JS | External stylesheet | Project uses JS string CSS in styles.ts; stay consistent |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    Modal.tsx            # Existing reusable modal shell (keep as-is)
    ResultsModal.tsx     # NEW: Results-specific modal content
  views/
    MainView.tsx         # Remove inline result card, add ResultsModal trigger
  styles.ts             # Add new CSS classes for results modal
```

### Pattern 1: Component Composition with Existing Modal
**What:** `ResultsModal` renders inside the existing `Modal` component, receiving domain-specific props.
**When to use:** Whenever the modal needs domain data (briefResult, exportResult, etc.)
**Example:**
```typescript
// ResultsModal.tsx
interface ResultsModalProps {
  open: boolean;
  onClose: () => void;
  onCopyBrief: () => void;
  onNewBrief: () => void;
  briefResult: BriefResult;
  extractionResult: ExtractionResult;
  extractionStats: ExtractionStats;
  exportResult: ExportResult;
}

export function ResultsModal({
  open, onClose, onCopyBrief, onNewBrief,
  briefResult, extractionResult, extractionStats, exportResult,
}: ResultsModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Brief Ready">
      {/* Success message */}
      {/* Copy button */}
      {/* Guidance text */}
      {/* Refinement encouragement */}
      {/* Expandable details */}
    </Modal>
  );
}
```

### Pattern 2: State Reset on Modal Dismiss
**What:** When the user closes the results modal (overlay click, Escape, or explicit "New Brief" button), all result-related state in MainView is cleared.
**When to use:** Every dismiss path.
**Example:**
```typescript
// In MainView.tsx
const handleCloseResults = useCallback(() => {
  setShowResultsModal(false);
  // Optionally: don't clear briefResult immediately so re-opening is possible
  // But per requirement: "start a new brief without stale state"
  setBriefResult(null);
  setExtractionResult(null);
  setExportResult(null);
  // etc.
}, []);
```

### Pattern 3: Expandable Details with Native HTML Details/Summary
**What:** Use a toggle button (matching existing "Show tree preview" pattern) rather than HTML `<details>` for consistent styling.
**When to use:** The "View details" toggle.
**Rationale:** The existing codebase uses a button toggle for the tree preview (line 764-781 of MainView.tsx). Reuse the same pattern for consistency.
```typescript
<button
  onClick={() => setShowDetails(!showDetails)}
  style={{
    background: 'none',
    border: 'none',
    color: 'var(--accent, #0d99ff)',
    fontSize: '11px',
    cursor: 'pointer',
    padding: '4px 0',
    marginTop: '8px',
  }}
>
  {showDetails ? 'Hide details' : 'View details'}
</button>
```

### Anti-Patterns to Avoid
- **Nesting modals:** Do not create a second overlay/modal layer. ResultsModal should use a different rendering approach than the main Modal. Since the main Figma modal is already open, ResultsModal should either (a) replace the MainView content inside the existing modal, or (b) render as a separate top-level modal. Given the existing architecture where `Modal` in `index.tsx` wraps all views, the cleanest approach is to render ResultsModal content **inside** the existing modal body, replacing MainView content when results are ready.
- **Rendering results inside MainView's scroll area AND as a separate modal:** This would create a confusing dual-view. Pick one: modal overlay OR inline replacement.
- **Clearing state before clipboard copy completes:** The copy callback is async (shell exec). Ensure state persists until the user explicitly dismisses.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal overlay/escape/click-outside | Custom overlay logic | Existing `Modal` component | Already handles all edge cases |
| Clipboard copy | Custom clipboard API | Existing `copyToClipboard` from `brief/io.ts` | base64 encoding handles shell metacharacters |
| Tree preview | New tree renderer | Existing `TreePreview` component | Already handles depth, truncation, component labels |
| CSS theming | Hardcoded colors | CSS variables (`--bg-primary`, `--text-secondary`, etc.) | Host app provides light/dark theme |

**Key insight:** This phase is a UI reorganization, not new functionality. Every data source and action callback already exists in MainView. The work is extracting the results display into a dedicated component with better messaging.

## Common Pitfalls

### Pitfall 1: Double Modal Problem
**What goes wrong:** The plugin already runs inside a `Modal` (in `index.tsx`). Opening a second `Modal` for results creates nested overlays with conflicting escape handlers and z-index issues.
**Why it happens:** The `Modal` component injects CSS and registers `keydown` listeners. Two instances would fight.
**How to avoid:** Do NOT render ResultsModal as a second `Modal` overlay. Instead, render it as a **view replacement** inside the existing modal body. When briefResult is set, MainView returns the results UI instead of the normal form. This matches how SettingsView replaces MainView via `currentView` state in `index.tsx`.
**Warning signs:** Seeing `figma-plugin-overlay` rendered twice in the DOM.

### Pitfall 2: Stale State After "Get New Brief"
**What goes wrong:** User generates a brief, sees results, clicks "Get New Brief", but previous extraction data bleeds into the new run.
**Why it happens:** Not clearing all state atoms. MainView has ~15 state variables that need coordinated reset.
**How to avoid:** The existing `handleExtract` already clears most state (lines 394-410). When dismissing the results view, clear `briefResult` and `showResultsModal` (or equivalent) so the user returns to the normal form. The Extract button already handles the rest.
**Warning signs:** Previous asset warnings appearing in a new brief run.

### Pitfall 3: Missing CSS Injection in Styles
**What goes wrong:** New CSS classes for the results modal don't get injected because they aren't in `PLUGIN_CSS`.
**Why it happens:** All CSS lives in the `PLUGIN_CSS` string constant in `styles.ts`. Forgetting to add new classes there means they won't exist at runtime.
**How to avoid:** Add any new CSS classes to `PLUGIN_CSS` in `styles.ts`. Test visually.
**Warning signs:** Elements rendering with no styling.

### Pitfall 4: Forgetting the File Save Note
**What goes wrong:** The current results card shows "Also saved to .shipstudio/assets/brief.md". Omitting this from the new results view loses useful context.
**Why it happens:** Focusing on the new requirements and forgetting existing features.
**How to avoid:** Carry over the file save note as a subtle footer line in the results view.

## Code Examples

### Current Results Card Location (to be replaced)
```typescript
// MainView.tsx lines 662-790 -- the entire {briefResult && extractionResult && ...} block
// This block is replaced by the new results view
```

### Data Available for Results View
```typescript
// All of these are already computed in MainView:
briefResult: BriefResult      // .markdown, .stats.nodeCount, .stats.assetCount, .stats.estimatedTokens
extractionResult: ExtractionResult  // .rootNodes, .truncated
extractionStats: ExtractionStats    // .frames, .components[], .textNodes, .hiddenNodes
exportResult: ExportResult          // .assets[], .warnings[], .assetsDir
```

### Token Warning Threshold (for details panel)
```typescript
import { TOKEN_WARNING_THRESHOLD } from '../brief/generate';
// TOKEN_WARNING_THRESHOLD = 12_000
// Show warning when briefResult.stats.estimatedTokens > 12000
```

### Copy Brief Callback (already exists)
```typescript
const handleCopyBrief = useCallback(async () => {
  if (!briefResult || !shellRef.current) return;
  try {
    await copyToClipboard(shellRef.current, briefResult.markdown);
    if (actions) {
      actions.showToast('Brief copied to clipboard', 'success');
    }
  } catch (err: any) {
    if (actions) {
      actions.showToast(`Copy failed: ${err?.message || 'Unknown error'}`, 'error');
    }
  }
}, [briefResult, actions]);
```

### Extract Stats Function (already exists, can be moved or reused)
```typescript
// collectStats() at MainView.tsx lines 45-68
// Walks LayoutNode[] and returns { frames, components, textNodes, hiddenNodes }
// Could be moved to a shared utility if ResultsModal needs it
```

## Architecture Decision: View Replacement vs. Separate Modal

**Decision: View replacement inside the existing modal.**

Rationale:
1. The plugin already runs inside `<Modal>` in `index.tsx`. A second `Modal` creates nested overlays.
2. The existing pattern for view switching is `currentView` state in `index.tsx` (main/settings). Results follows the same pattern.
3. The `Modal` component's `title` prop can change to "Brief Ready" when showing results.
4. Escape-to-close and overlay-click-to-close naturally dismiss back to the main view.

**Implementation approach:** Add a `showResults` boolean (or a `currentView` extension) in MainView. When `briefResult` is populated after generation, flip to the results view. The results view renders success messaging, copy button, guidance, and expandable details. A "Get New Brief" button or "back" action returns to the form view after clearing state.

Alternatively, the results view could be promoted to `index.tsx` level (like SettingsView), but this would require threading many props upward. Keeping it as a conditional render inside MainView is simpler since all the data is local.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline results card at bottom of form | Results modal/view overlay | Phase 27 | Cleaner UX, guided next steps |
| "Show tree preview" toggle in card | "View details" expandable with assets+tree+tokens | Phase 27 | Power users get full detail, beginners see clean success |

## Open Questions

1. **Should the results view be a view replacement or content overlay?**
   - What we know: Nested `Modal` components will conflict. View replacement is cleaner.
   - Recommendation: Conditional render inside MainView -- when `briefResult` is set, show results view instead of the form. This is the simplest approach.

2. **Should "Get New Brief" clear the URL input?**
   - What we know: Current behavior on re-extract (line 387+) clears extraction state but keeps the URL.
   - Recommendation: Keep URL, clear results. User likely wants to re-extract the same page with different options.

3. **What goes in the "View details" expandable?**
   - What we know: Requirements say "asset list, layout tree, and token summary"
   - Recommendation: Three sub-sections: (1) Asset list -- filenames and types, (2) Tree preview -- reuse existing `TreePreview` component, (3) Token summary -- counts of colors/fonts/spacing, not full tables. The full data is in the brief itself.

## Sources

### Primary (HIGH confidence)
- `src/components/Modal.tsx` -- Existing modal component API and behavior
- `src/views/MainView.tsx` -- Current results rendering, state management, all data sources
- `src/styles.ts` -- CSS infrastructure and existing class patterns
- `src/index.tsx` -- View routing pattern (main/settings) and Modal usage
- `src/brief/types.ts` -- BriefResult shape with stats
- `src/assets/types.ts` -- ExportResult shape with assets and warnings
- `.planning/REQUIREMENTS.md` -- RSLT-01 through RSLT-05 definitions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all existing patterns
- Architecture: HIGH - clear codebase patterns to follow, view replacement is straightforward
- Pitfalls: HIGH - derived from direct code reading, double-modal issue is the main risk

**Research date:** 2026-03-01
**Valid until:** Indefinite (project-specific patterns, not external library versions)
