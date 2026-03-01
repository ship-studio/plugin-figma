# Phase 19: Asset List UI & Integration - Research

**Researched:** 2026-03-01
**Domain:** React UI component extraction, state management, form validation, Figma plugin UX
**Confidence:** HIGH

## Summary

Phase 19 is the final v2.0 phase -- it wires the backend pipeline (Phases 15-18) to a user-facing asset management UI. All the hard infrastructure work is done: `ManualAsset` types, `resolveNode()`, `deriveAssetFromNode()`, `resolveFilenameCollision()`, format-aware batch export, and brief generator cross-referencing all exist and are tested. This phase is purely about building the UI layer and state management to drive those functions.

The core challenge is MainView.tsx complexity management. STATE.md explicitly flags this: "MainView.tsx is 673 lines -- extract asset list into separate component during Phase 19." The asset list UI should be a self-contained component (`AssetListPanel`) with its own state, receiving callbacks from MainView for integration points. The existing codebase uses plain React `useState`/`useCallback` hooks with no external state library -- follow this pattern.

**Primary recommendation:** Extract asset list into `src/components/AssetListPanel.tsx` as a controlled component. MainView owns the `ManualAsset[]` state and passes it down along with `onAdd`/`onRemove`/`onClear`/`onRename` callbacks. The panel handles URL input, validation, and display. Wire `manualAssets` into the existing `exportAssets()` call in `runAssetExport`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AINP-01 | User can add an asset by pasting a Figma URL that contains a node ID | `parseFigmaUrl()` already extracts fileKey + nodeId from URLs. New: validate nodeId exists, call `resolveNode()`, add to list. |
| AINP-02 | User can select PNG or SVG format for each asset | `ManualAsset.format` field already supports 'png' \| 'svg'. UI needs a format toggle per-asset or at add-time. `suggestFormat()` provides default. |
| AINP-03 | Plugin validates that the asset URL belongs to the same Figma file as the main design URL | Compare `parseFigmaUrl(assetUrl).fileKey` against `parsedUrl.fileKey` from the design URL already in MainView state. |
| AINP-04 | Plugin validates that the pasted URL contains a node ID (rejects file/page-level URLs) | `parseFigmaUrl()` returns `nodeId: null` for file-level URLs -- reject when `nodeId` is null. |
| LIST-01 | User can see all queued assets with derived filename and format | Render `ManualAsset[]` as a list showing `filename`, `format`, `status` fields. Status determines visual treatment (spinner for resolving, checkmark for valid, error icon for error). |
| LIST-02 | User can remove individual assets from the list | Filter `manualAssets` by nodeId on remove click. |
| LIST-03 | User can clear all assets from the list | Set `manualAssets` to empty array. |
| LIST-04 | Plugin prevents adding the same node ID twice | Check `manualAssets.some(a => a.nodeId === nodeId)` before adding. Show inline error if duplicate. |
| LIST-05 | User can edit the auto-derived filename before export | Inline edit or click-to-edit on filename field. Update `manualAssets` array with new filename. Must re-run collision detection. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.0.0 | UI rendering | Already in project via `@types/react`, provided by host app (`__SHIPSTUDIO_REACT__`) |
| TypeScript | ^5.6.0 | Type safety | Already in project |
| Vitest | latest | Testing | Already in project, `vitest run` configured |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | -- | -- | Project uses zero external UI libraries. All components are plain React + inline styles + CSS class names from `styles.ts`. Follow existing convention. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain useState | useReducer | Reducer would formalize state transitions but adds complexity for a simple list. useState + helper functions is the established project pattern. |
| Inline styles | CSS module / Tailwind | Project already uses a mix of inline styles and CSS classes in `styles.ts`. Stick with existing pattern. |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── AssetListPanel.tsx   # NEW -- asset list + input + format selector
│   └── Modal.tsx            # existing
├── views/
│   └── MainView.tsx         # modified -- holds ManualAsset[] state, passes to AssetListPanel
├── assets/
│   ├── resolve.ts           # existing -- resolveNode(), deriveAssetFromNode()
│   ├── export.ts            # existing -- exportAssets() already accepts manualAssets
│   └── types.ts             # existing -- ManualAsset type
└── styles.ts                # modified -- add asset list CSS classes
```

### Pattern 1: Controlled Component with Callback Props
**What:** `AssetListPanel` receives all state from parent and emits changes via callbacks
**When to use:** When the component's state must be accessible to the parent (MainView needs `manualAssets` for the export pipeline)
**Example:**
```typescript
interface AssetListPanelProps {
  /** The main design URL's parsed file key -- for same-file validation */
  designFileKey: string | null;
  /** Current list of manual assets */
  assets: ManualAsset[];
  /** Callback when user adds an asset */
  onAdd: (asset: ManualAsset) => void;
  /** Callback when user removes an asset by nodeId */
  onRemove: (nodeId: string) => void;
  /** Callback when user clears all assets */
  onClear: () => void;
  /** Callback when user renames an asset */
  onRename: (nodeId: string, newFilename: string) => void;
  /** Callback when asset resolution completes (replaces resolving placeholder) */
  onResolved: (nodeId: string, resolved: ManualAsset) => void;
  /** Whether the export pipeline is running (disables add/remove) */
  disabled?: boolean;
  /** Shell + token for API calls */
  shell: Shell;
  token: string;
}
```

### Pattern 2: Optimistic Add with Async Resolution
**What:** When user pastes a URL, immediately add a `status: 'resolving'` placeholder to the list, then fire `resolveNode()` asynchronously. On resolution, replace the placeholder with the full ManualAsset.
**When to use:** Every add operation -- gives instant UI feedback
**Example:**
```typescript
// 1. Validate URL synchronously
const parsed = parseFigmaUrl(assetUrl);
if (!parsed?.nodeId) { setError('URL must include a node ID'); return; }
if (parsed.fileKey !== designFileKey) { setError('Asset must be from the same Figma file'); return; }
if (assets.some(a => a.nodeId === parsed.nodeId)) { setError('Asset already in list'); return; }

// 2. Optimistic add
const placeholder: ManualAsset = {
  nodeId: parsed.nodeId,
  nodeName: '',
  filename: '',
  format: 'png',
  status: 'resolving',
};
onAdd(placeholder);

// 3. Async resolve
const resolved = await resolveNode(shell, token, parsed.fileKey, parsed.nodeId, assets);
onResolved(parsed.nodeId, resolved);
```

### Pattern 3: Inline Filename Edit
**What:** Click filename text to switch to an input field. On blur/enter, validate and save.
**When to use:** LIST-05 filename editing
**Example:**
```typescript
const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
const [editValue, setEditValue] = useState('');

// Start editing
const startEdit = (nodeId: string, currentFilename: string) => {
  setEditingNodeId(nodeId);
  // Strip extension for editing -- re-add on save
  const dotIdx = currentFilename.lastIndexOf('.');
  setEditValue(dotIdx !== -1 ? currentFilename.slice(0, dotIdx) : currentFilename);
};

// Save edit
const saveEdit = (nodeId: string, format: 'png' | 'svg') => {
  const sanitized = sanitizeFilename(editValue);
  const candidate = `${sanitized}.${format}`;
  const others = assets.filter(a => a.nodeId !== nodeId).map(a => a.filename);
  const final = resolveFilenameCollision(candidate, others);
  onRename(nodeId, final);
  setEditingNodeId(null);
};
```

### Anti-Patterns to Avoid
- **Lifting async resolution into MainView:** Keep the async `resolveNode` call inside `AssetListPanel` -- MainView only receives the final result via `onResolved`. This keeps MainView's already-long callback chain manageable.
- **Mutating ManualAsset objects:** Always create new array/objects when updating state. The existing codebase follows immutable update patterns.
- **Re-validating at export time:** Node validation happens at add-time (project decision from STATE.md). Don't duplicate validation in the export path.
- **Putting format selector in a separate modal/dialog:** Keep it inline -- a simple PNG/SVG toggle next to each asset row. The plugin modal is already space-constrained.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL parsing | Custom regex for Figma URLs | `parseFigmaUrl()` from `src/url-parser.ts` | Already handles all URL formats, encoding, node-id extraction |
| Filename sanitization | Custom string cleaning | `sanitizeFilename()` from `src/assets/sanitize.ts` | Battle-tested, handles edge cases |
| Filename collision | Manual counter logic | `resolveFilenameCollision()` from `src/assets/resolve.ts` | Already tested with all edge cases |
| Node resolution | Direct API call + manual parsing | `resolveNode()` from `src/assets/resolve.ts` | Handles API errors gracefully, returns error ManualAsset |
| I-prefix detection | Regex check | `isInstanceChildId()` from `src/assets/resolve.ts` | Already tested, plus `extractParentInstanceId()` |
| Format suggestion | Hardcoded mapping | `suggestFormat()` from `src/assets/resolve.ts` | Covers all Figma node types |

**Key insight:** Every data transformation function needed by the UI already exists and is tested. The UI just needs to call them in the right order and display the results.

## Common Pitfalls

### Pitfall 1: Stale Closure in Async Resolution
**What goes wrong:** The `onResolved` callback captures a stale `assets` array, causing the resolved asset to overwrite a newer version of the list.
**Why it happens:** React closures capture state at render time. If user adds multiple assets quickly, each resolution callback has a different snapshot.
**How to avoid:** Use functional state updates: `setAssets(prev => prev.map(a => a.nodeId === nodeId ? resolved : a))`. The `onResolved` callback from MainView should use a functional updater, not a direct reference to `assets`.
**Warning signs:** Adding two assets quickly causes the first resolution to "undo" the second add.

### Pitfall 2: Duplicate Check Race Condition
**What goes wrong:** User pastes the same URL twice quickly. Both pass the duplicate check (neither is in the list yet when checked), and both get added.
**Why it happens:** The duplicate check reads current state, but the first add hasn't committed to state yet when the second check runs.
**How to avoid:** Clear the input field immediately after initiating add. Alternatively, use a ref to track in-flight nodeIds.
**Warning signs:** Two identical entries appearing in the list.

### Pitfall 3: Filename Collision After Rename
**What goes wrong:** User renames asset A to "icon.png" but asset B is already named "icon.png". Two files with the same name exist.
**Why it happens:** The rename handler doesn't check collisions against other assets in the list.
**How to avoid:** Always run `resolveFilenameCollision()` when saving a rename, passing `assets.filter(a => a.nodeId !== editingNodeId).map(a => a.filename)` as existing names.
**Warning signs:** Export produces overwritten files or error about duplicate filenames.

### Pitfall 4: Missing Format in Filename After Format Toggle
**What goes wrong:** User changes format from PNG to SVG but filename still says ".png".
**Why it happens:** Format change doesn't update the filename extension.
**How to avoid:** When format changes, derive a new filename: replace extension and re-check collisions. `const base = filename.slice(0, filename.lastIndexOf('.')); const newFilename = resolveFilenameCollision(base + '.' + newFormat, otherFilenames);`
**Warning signs:** "hero.png" marked as SVG format, or SVG file downloaded with .png extension.

### Pitfall 5: Design URL Not Set When Adding Assets
**What goes wrong:** User tries to add an asset before pasting the design URL. The file key is null, so same-file validation can't run.
**Why it happens:** The asset input section is visible before the design URL is validated.
**How to avoid:** Disable or hide the asset input section until `parsedUrl` and `fileInfo` are both set (i.e., after design URL is validated). Use the same `parsedUrl?.fileKey` check already used for the extract button.
**Warning signs:** Cryptic error when user pastes asset URL first.

### Pitfall 6: Resolving Assets Block Export
**What goes wrong:** User clicks "Get Brief" while some assets are still resolving. Export includes partially-resolved assets with empty filenames.
**Why it happens:** Export pipeline filters by `status === 'valid'` but user expects resolving assets to be included.
**How to avoid:** Disable the "Get Brief" button when any asset has `status === 'resolving'`. Show a visual indicator. The existing `extractDisabled` logic in MainView should be extended.
**Warning signs:** Brief is generated with fewer assets than expected.

## Code Examples

Verified patterns from existing codebase:

### Adding an Asset (End-to-End Flow)
```typescript
// In AssetListPanel -- called when user clicks "Add"
const handleAddAsset = useCallback(async () => {
  if (!assetUrlInput.trim() || !designFileKey || disabled) return;

  // 1. Parse and validate
  const parsed = parseFigmaUrl(assetUrlInput);
  if (!parsed) { setAddError('Invalid Figma URL'); return; }
  if (!parsed.nodeId) { setAddError('URL must point to a specific element (include node-id)'); return; }
  if (parsed.fileKey !== designFileKey) { setAddError('Asset must be from the same Figma file'); return; }
  if (assets.some(a => a.nodeId === parsed.nodeId)) { setAddError('This element is already in the list'); return; }

  // 2. Check for I-prefix instance child
  if (isInstanceChildId(parsed.nodeId)) {
    setAddError('This is an instance child -- select the parent component instead');
    return;
  }

  // 3. Optimistic add
  const placeholder: ManualAsset = {
    nodeId: parsed.nodeId,
    nodeName: '',
    filename: '',
    format: 'png',
    status: 'resolving',
  };
  onAdd(placeholder);
  setAssetUrlInput('');
  setAddError(null);

  // 4. Resolve node via API
  const resolved = await resolveNode(shell, token, designFileKey, parsed.nodeId, assets);
  onResolved(parsed.nodeId, resolved);
}, [assetUrlInput, designFileKey, assets, shell, token, disabled, onAdd, onResolved]);
```

### Wiring ManualAssets into Export Pipeline
```typescript
// In MainView.tsx -- modify runAssetExport to pass manualAssets
const runAssetExport = useCallback(async (result: ExtractLayoutResult) => {
  // ... existing setup ...
  const exportRes = await exportAssets({
    shell: shellRef.current,
    token,
    fileKey: result.fileKey,
    selectedNodeId: parsedUrl.nodeId || result.extraction.rootNodes[0]?.id || '0:0',
    projectPath: ctx?.project?.path ?? '.',
    manualAssets, // <-- pass the asset list
    onProgress: setAssetProgress,
  });
  // ... rest unchanged ...
}, [token, parsedUrl, ctx, actions, fileInfo, urlInput, manualAssets]);
```

### State Management in MainView
```typescript
// ManualAsset list state
const [manualAssets, setManualAssets] = useState<ManualAsset[]>([]);

const handleAddAsset = useCallback((asset: ManualAsset) => {
  setManualAssets(prev => [...prev, asset]);
}, []);

const handleRemoveAsset = useCallback((nodeId: string) => {
  setManualAssets(prev => prev.filter(a => a.nodeId !== nodeId));
}, []);

const handleClearAssets = useCallback(() => {
  setManualAssets([]);
}, []);

const handleRenameAsset = useCallback((nodeId: string, newFilename: string) => {
  setManualAssets(prev => prev.map(a =>
    a.nodeId === nodeId ? { ...a, filename: newFilename } : a
  ));
}, []);

const handleAssetResolved = useCallback((nodeId: string, resolved: ManualAsset) => {
  setManualAssets(prev => prev.map(a =>
    a.nodeId === nodeId ? resolved : a
  ));
}, []);
```

### CSS Classes to Add (in styles.ts)
```css
/* Asset list container */
.figma-plugin-asset-list {
  margin-top: 8px;
}

/* Individual asset row */
.figma-plugin-asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--border);
  margin-bottom: 4px;
}

.figma-plugin-asset-row:hover {
  background: var(--bg-secondary);
}

/* Format badge */
.figma-plugin-format-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

/* Status indicators */
.figma-plugin-asset-status-valid {
  color: #38a169;
}
.figma-plugin-asset-status-error {
  color: #e53e3e;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Auto-detect assets from tree | Manual asset list (v2.0) | 2026-03-01 | Complete pipeline rewrite done in Phases 15-18; this phase adds UI |
| `AssetEntry` type | `ManualAsset` type | Phase 16 | ManualAsset has format, status, error, warning fields |
| No manualAssets param | `exportAssets({ manualAssets })` | Phase 17 | Export pipeline already accepts the array -- just need to pass it |

**Deprecated/outdated:**
- `identify.ts`, `detect-composition.ts`: Deleted in Phase 15
- `AssetEntry.exportType` ('svg' | 'png-render' | 'png-fill'): Replaced by `ManualAsset.format` ('png' | 'svg')

## Open Questions

1. **Format toggle interaction pattern**
   - What we know: User needs to choose PNG or SVG per asset. `suggestFormat()` provides a default based on node type.
   - What's unclear: Should the format be selectable at add-time (before resolution), or only editable after the asset is resolved? Editing after resolution is simpler since we have the node type.
   - Recommendation: Auto-suggest format during resolution. Show a clickable format badge on each asset row that toggles between PNG/SVG. This is simpler than a dropdown and matches the minimalist UI style.

2. **Asset list position in the UI flow**
   - What we know: The UI currently has: URL input -> file info -> scope hint -> [large tree warning] -> [result card] -> Get Brief button
   - What's unclear: Where in this vertical flow should the asset list appear?
   - Recommendation: Place between the scope hint and the Get Brief button. The asset list is part of the "configuration" phase before extraction, not part of results. It should be visible and editable while the design URL is validated.

3. **Clear assets on design URL change**
   - What we know: Changing the design URL clears all extraction/export/brief state.
   - What's unclear: Should it also clear the asset list? Assets are tied to a specific file key.
   - Recommendation: Yes -- clear asset list when design URL changes. Assets from a different file key are invalid anyway (AINP-03 enforces same-file). This matches the existing "clear everything on URL change" pattern.

## Sources

### Primary (HIGH confidence)
- `src/assets/resolve.ts` -- resolveNode(), deriveAssetFromNode(), isInstanceChildId(), suggestFormat(), resolveFilenameCollision()
- `src/assets/export.ts` -- exportAssets() already accepts optional `manualAssets: ManualAsset[]`
- `src/assets/types.ts` -- ManualAsset type definition with status lifecycle
- `src/url-parser.ts` -- parseFigmaUrl() for URL validation
- `src/views/MainView.tsx` -- current 659-line component, all UI patterns
- `src/styles.ts` -- CSS class conventions
- `src/figma-api.ts` -- fetchFileNodes() for node resolution
- `.planning/REQUIREMENTS.md` -- AINP-01 through LIST-05 requirement definitions
- `.planning/STATE.md` -- "extract asset list into separate component" directive

### Secondary (MEDIUM confidence)
- `.planning/ROADMAP.md` -- Phase 19 success criteria and dependency chain

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, all existing code
- Architecture: HIGH - Clear component extraction pattern, all APIs already exist
- Pitfalls: HIGH - Based on actual codebase patterns and React state management fundamentals

**Research date:** 2026-03-01
**Valid until:** 2026-03-31 (stable domain, no external dependency changes)
