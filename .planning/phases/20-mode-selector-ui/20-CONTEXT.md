# Phase 20: Mode Selector UI - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a brief mode picker to the plugin UI with three options: "Copy (Best results)", "Copy (Pixel for pixel)", and "Use as inspiration". Each mode displays explanatory text. The selected mode persists during the current session with "Copy (Best results)" as default. This phase is UI only — mode-specific brief instructions are Phase 21.

</domain>

<decisions>
## Implementation Decisions

### Selector placement
- Appears between the file info/scope hint and the asset list panel (above assets, below URL validation)
- Only visible after URL is validated (same conditional as the asset list panel)
- Mode selection persists across URL changes and re-extractions — does not reset
- Hidden when results card is showing (alongside asset list). Reappears when user clicks "Get New Brief"

### Visual style
- Stacked cards: vertical stack of 3 compact cards, one per mode
- Selected card has accent border (var(--accent)) to indicate selection; unselected cards have standard border
- Compact density: small padding, tight line height — all three cards visible without scrolling
- Cards are clickable to select

### Explanatory text
- Each card shows: bold mode name on one line, single-line muted description underneath
- Mode names can be refined from the requirement names if it improves clarity (spirit stays the same)
- Claude drafts the description text for each mode

### Session persistence
- Mode lives in React useState — simplest approach, matches existing manualAssets pattern
- Persists while the plugin panel is open; resets on close/reopen
- Does not persist to localStorage

### Claude's Discretion
- Whether to include a section label (e.g., "Brief mode") above the cards
- Whether cards include a radio bullet circle or rely on border alone for selection
- Exact description wording for each mode
- Whether the "Get Brief" button label includes the selected mode name

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. The mode cards should feel native to Figma plugin design patterns (compact, clean, minimal chrome).

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.figma-plugin-radio-group` / `.figma-plugin-radio-label` CSS classes exist in styles.ts (unused since Phase 8 removed scope radio) — could be repurposed or referenced for card styling
- `.figma-plugin-file-info` card style (padding, border-radius, bg-secondary) — good reference for card look
- `.figma-plugin-section` wrapper class for consistent spacing

### Established Patterns
- All UI state in MainView.tsx uses React useState — mode should follow the same pattern
- Conditional rendering based on `parsedUrl && fileInfo && !validating` — mode selector uses the same gate
- CSS is in `src/styles.ts` as a template literal string (PLUGIN_CSS), injected via style tag
- Components use inline styles for one-offs, CSS classes for reused patterns

### Integration Points
- Mode selector renders in MainView.tsx between the scope hint section and the AssetListPanel
- Mode value needs to flow to `generateBrief()` in Phase 21 — for now, just store it in state
- BriefInput type (src/brief/types.ts) will need a `mode` field added in Phase 21

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-mode-selector-ui*
*Context gathered: 2026-03-01*
