# Phase 14: Plugin Icon - Research

**Researched:** 2026-03-01
**Domain:** SVG icon integration in Ship Studio toolbar
**Confidence:** HIGH

## Summary

Phase 14 is a straightforward cosmetic change: replace the generic 4-squares grid icon in the Figma plugin's toolbar button with the official Figma logo SVG. The plugin currently renders an inline SVG icon inside a `<button className="toolbar-icon-btn">` in `src/index.tsx` (lines 162-177). This SVG needs to be swapped for the Figma logo path data.

The Ship Studio toolbar renders plugin icons at 14x14px within a 32px-tall button (`.toolbar-icon-btn`). The icon inherits `color: var(--text-muted)` from host CSS and must use `fill="currentColor"` to respect the theme. The `plugin.json` `icon` field exists but is NOT consumed by the host app -- the toolbar icon comes entirely from the inline SVG in the React component.

**Primary recommendation:** Replace the inline SVG in `src/index.tsx` with the Figma logo SVG path at `width="14" height="14"` using `fill="currentColor"` and `viewBox="0 0 24 24"`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| POLISH-01 | Plugin displays Figma logo SVG as its icon in the Ship Studio toolbar | Figma logo SVG path data sourced from Simple Icons (canonical brand SVG repository). Toolbar icon pattern verified across 4 existing Ship Studio plugins. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | (host-provided) | Renders toolbar button component | Already in use -- plugin externalizes React |
| Inline SVG | N/A | Embeds icon directly in JSX | All Ship Studio toolbar plugins use inline SVGs, no icon library needed |

### Supporting
No additional libraries needed. This is a pure SVG path swap.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG | `icon.svg` file in plugin.json | plugin.json `icon` field is NOT consumed by the host app for toolbar rendering -- only the Sanity plugin uses it and only for its plugin manager listing. Inline SVG is the universal pattern. |
| Inline SVG | Icon library (lucide-react, etc.) | Adds a dependency for a single icon. Brand logos are not in icon libraries anyway. |

## Architecture Patterns

### How Ship Studio Toolbar Icons Work

The Ship Studio host app renders toolbar plugin icons via `PluginSlot`:
1. Host calls `plugin.module.slots['toolbar']` to get the React component
2. The component renders a `<button className="toolbar-icon-btn">` with an inline `<svg>`
3. Host CSS styles the button (32px tall, 6px/10px padding, 6px border-radius)
4. Host CSS sets SVG color via `.toolbar-icon-btn svg { color: var(--text-muted) }`

**All existing toolbar plugins use this identical pattern:**
- **Vercel**: Triangle logo, `width="14" height="14"`, `fill="currentColor"`
- **GSD**: Checkmark icon, `width="14" height="14"`, `stroke="currentColor"`
- **Figma (current)**: Generic grid, `width="14" height="14"`, `stroke="currentColor"`

### Pattern: Filled Brand Logo in Toolbar
**What:** Brand logos use `fill="currentColor"` (not stroke) because they are solid shapes, not outlined icons.
**When to use:** When the icon is a brand mark (Figma, Vercel, etc.) rather than a UI icon (gear, checkmark).
**Example:**
```typescript
// Source: Vercel plugin (plugin-vercel/src/index.tsx line 1598)
// and Simple Icons (github.com/simple-icons/simple-icons)
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
  <path d="..." />
</svg>
```

### Anti-Patterns to Avoid
- **Using stroke for filled logos:** The Figma logo is composed of filled shapes, not strokes. Using `stroke="currentColor"` would render outlines instead of the recognizable solid logo.
- **Hardcoding colors:** Never use `fill="#F24E1E"` or other Figma brand colors. Use `fill="currentColor"` so the icon respects the Ship Studio theme.
- **Setting explicit color on the button:** The `.toolbar-icon-btn svg` CSS handles color inheritance. Do not add `style={{ color: '...' }}` on the SVG.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Figma logo path data | Drawing the logo by hand | Simple Icons canonical SVG | The Figma logo has 5 distinct geometric shapes with precise curves. Hand-drawing introduces errors. |

## Common Pitfalls

### Pitfall 1: Wrong viewBox
**What goes wrong:** The SVG renders tiny, clipped, or off-center in the 14x14 toolbar space.
**Why it happens:** Mismatched viewBox dimensions vs. the path data coordinate system.
**How to avoid:** The Simple Icons Figma SVG uses `viewBox="0 0 24 24"` and the path data is designed for this coordinate space. Keep this viewBox. Set `width="14" height="14"` for rendering size.
**Warning signs:** Icon appears as a dot, is cut off, or has large empty margins.

### Pitfall 2: Using stroke instead of fill
**What goes wrong:** The Figma logo renders as thin outlines instead of solid shapes.
**Why it happens:** Copy-pasting the attribute pattern from the current grid icon which uses `stroke="currentColor"`.
**How to avoid:** The Figma logo paths are filled shapes. Use `fill="currentColor"` and remove `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin` attributes.

### Pitfall 3: Forgetting plugin.json icon field
**What goes wrong:** Nothing breaks, but the plugin.json `icon` field remains empty.
**Why it happens:** Not realizing plugin.json has an `icon` field separate from the toolbar component.
**How to avoid:** Optionally set `"icon": ""` or leave it -- the host app does not use this field. This is a non-issue but worth noting.

## Code Examples

### Current Icon (to be replaced)
```typescript
// Source: src/index.tsx lines 162-177
<button
  onClick={openModal}
  title="Figma Design Brief"
  className="toolbar-icon-btn"
>
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
</button>
```

### Replacement Icon (Figma logo)
```typescript
// Source: Simple Icons (github.com/simple-icons/simple-icons/blob/develop/icons/figma.svg)
// License: CC0 1.0 Universal
<button
  onClick={openModal}
  title="Figma Design Brief"
  className="toolbar-icon-btn"
>
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
  </svg>
</button>
```

### Verification Pattern (Vercel for reference)
```typescript
// Source: plugin-vercel/src/index.tsx line 1598
// Shows the same pattern: 14x14, viewBox, fill="currentColor"
<svg width="14" height="14" viewBox="0 0 116 100" fill="currentColor">
  <path d="M57.5 0L115 100H0L57.5 0Z" />
</svg>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic grid icon | Figma logo SVG | Phase 14 | Visual identity -- users can identify the plugin at a glance |

**No deprecation concerns:** Inline SVG in toolbar buttons is the stable, current pattern across all Ship Studio plugins.

## Open Questions

None. This is a well-understood, minimal change with clear prior art in the codebase.

## Sources

### Primary (HIGH confidence)
- Simple Icons Figma SVG: `github.com/simple-icons/simple-icons/blob/develop/icons/figma.svg` -- Canonical source for brand SVGs, CC0 licensed
- Ship Studio host app source: `shipstudio/src/styles/base.css` lines 178-206 -- toolbar-icon-btn CSS
- Ship Studio host app source: `shipstudio/src/components/PluginSlot.tsx` -- Plugin slot rendering (confirms icon comes from component, not plugin.json)
- Ship Studio host app source: `shipstudio/src/components/WorkspaceHeader.tsx` -- Toolbar rendering at 14px icon size

### Secondary (MEDIUM confidence)
- Plugin-vercel source: `plugin-vercel/src/index.tsx` line 1598 -- Vercel logo inline SVG pattern
- Plugin-sanity source: `plugin-sanity/plugin.json` -- Only plugin using icon.svg file (for plugin manager, not toolbar)
- Plugin-gsd source: `plugin-gsd/src/index.tsx` line 94 -- GSD inline SVG pattern

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Verified by reading 4 existing plugins and host app source code
- Architecture: HIGH -- Examined PluginSlot.tsx, WorkspaceHeader.tsx, and base.css directly
- Pitfalls: HIGH -- Based on direct code inspection and SVG rendering fundamentals

**Research date:** 2026-03-01
**Valid until:** Indefinite -- SVG icon rendering is stable technology; Simple Icons paths do not change
