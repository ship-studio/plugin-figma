# Phase 5: Brief Assembly & Output - Research

**Researched:** 2026-02-28
**Domain:** Markdown generation, clipboard integration, token estimation, Shell-based file I/O
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Brief structure & sections:**
- Visual-first section order: 1) Metadata (file, frame, date), 2) Preview image reference, 3) Layout tree, 4) Design tokens (colors, typography, spacing, borders, shadows), 5) Components inventory, 6) Asset references
- Design tokens formatted as markdown tables grouped by type -- each row shows token name/value and usage count
- Include actual text content from text nodes alongside node info (e.g., Text 'Sign In' (Inter 16/600)) -- essential for Claude Code to reproduce the UI accurately

**Layout description style:**
- Indented tree format with key properties inline on each line -- type, name, layout direction, gap, key dimensions (e.g., Frame 'Card' (column, gap: 12, 320x200))
- Skip default/obvious values, only show meaningful properties
- Full tree depth -- show complete hierarchy as extracted, no depth cap
- CSS flexbox terms: 'row', 'column', 'gap: 16', 'justify: center', 'align: stretch', 'padding: 16 24' -- directly translatable to code
- Collapse repeated identical component instances with count: 'Instance "ListItem" x5 (repeated)' -- uses existing repeatCount on LayoutNode
- Framework-agnostic: describe layout intent, not framework-specific code

**Clipboard & output flow:**
- Auto-generate brief after asset export completes -- full pipeline runs from URL paste to clipboard-ready brief in one flow
- Prominent 'Copy Brief to Clipboard' button shown after generation -- clicking copies markdown and shows success toast, button stays available for re-copying
- Also save brief to `.shipstudio/brief.md` alongside assets -- persists across clipboard changes, gives Claude Code a file to reference directly
- Summary stats only in plugin UI (no full brief preview): 'Brief ready: 47 nodes, 8 colors, 3 fonts, 12 assets, ~8K tokens' -- the brief is for Claude Code, not for reading in the plugin

**Token count & warnings:**
- Estimate tokens as characters / 4 (standard rough estimate) -- simple, no dependencies, shown as '~8K tokens'
- Always show token estimate in the summary stats -- turns yellow/warning only when exceeding threshold
- Warning at ~12K tokens: yellow banner 'Brief is ~15K tokens (recommended max: 12K). Consider selecting a smaller frame.' -- warning only, still allow copy, user decides
- No auto-truncation -- if it's too large, user should select a smaller frame

### Claude's Discretion
- Exact markdown formatting details and whitespace
- How to handle nodes with no meaningful properties (empty containers, groups)
- Component inventory table column layout
- Asset reference section formatting
- Progress message wording during brief generation
- Error message wording for extraction failures (PLUI-03, PLUI-04 -- progress and error messages are already partially implemented in MainView)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BREF-01 | Plugin formats extracted data into a structured markdown brief with clear sections (metadata, layout tree, tokens, components, asset references) | Pure function `generateBrief()` takes ExtractLayoutResult + ExportResult and produces markdown string. All data structures are fully typed and available. Section ordering locked in decisions. |
| BREF-02 | Brief is framework-agnostic -- describes layout intent rather than framework-specific code | CSS flexbox terms already mapped by `mapToFlexbox()` and stored on LayoutNode.autoLayout. `describeSizing()` already produces "hug", "fill", "100px" strings. Just format these into tree lines. |
| BREF-03 | Brief references exported assets by their local file paths in the project | ExportResult.assets[] has `{ filename, path }` pairs. ExportResult.previewPath has preview PNG path. Convert to project-relative paths using `projectPath`. |
| BREF-04 | Plugin estimates token count and warns if brief exceeds ~12K tokens | `chars / 4` estimation per user decision. Compare against 12K threshold. Yellow warning banner using existing `figma-plugin-warning` CSS class. |
| BREF-05 | Plugin copies the formatted brief to clipboard | `shell.exec('pbcopy')` piping markdown via stdin, or `shell.exec('bash', ['-c', 'echo ... | pbcopy'])`. Also save to `.shipstudio/brief.md` via `shell.exec('bash', ['-c', 'cat > path'])`. |
| PLUI-03 | Plugin shows extraction progress during API calls | Already partially implemented: extraction spinner, asset export progress callback. Brief generation is synchronous pure function (no API calls), so just needs a brief "Generating brief..." state. |
| PLUI-04 | Plugin shows clear error messages for common failures (invalid token, inaccessible file, rate limit) | Already implemented in MainView's `handleExtract` catch block with 403/404/429/timeout error mapping. Brief generation itself is pure -- errors would only come from file write or clipboard operations (shell.exec failures). |

</phase_requirements>

## Summary

Phase 5 is a pure data transformation and I/O phase. All input data is already extracted and fully typed from Phases 2-4: `ExtractLayoutResult` (layout tree + design tokens + fileKey) and `ExportResult` (preview path + asset list + warnings). The core work is a pure function that transforms these typed data structures into a structured markdown string, plus shell-based I/O for file writing and clipboard copying.

The architecture is straightforward: a single `generateBrief()` pure function (testable with Vitest, no mocks needed) that takes the extraction and export results and produces a markdown string. A thin `saveBrief()` async function handles file writing via `shell.exec`. A `copyToClipboard()` async function handles clipboard via `shell.exec('pbcopy')`. The MainView wires these into the existing pipeline, triggering brief generation after asset export completes.

**Primary recommendation:** Implement `generateBrief()` as a pure function in `src/brief/generate.ts` with comprehensive unit tests, then wire file save + clipboard copy + UI into MainView following the established patterns.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5.6.0 | Type safety for brief generation function signatures | Already in project |
| Vitest | latest | Unit testing the pure `generateBrief()` function | Already in project, 168 existing tests |

### Supporting
No additional libraries needed. Brief generation is pure string concatenation. Token estimation is `chars / 4`. Clipboard is `pbcopy` via shell. File write is shell exec.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual string concatenation | Template library (handlebars, ejs) | Overkill -- brief is one function, not a template system. String concat keeps zero dependencies. |
| `pbcopy` for clipboard | Electron/Node clipboard API | Plugin runs in Ship Studio which provides shell.exec, not Node APIs. `pbcopy` is the established pattern (macOS only, which matches the platform). |
| `shell.exec('bash', ['-c', '...'])` for file write | Direct fs API | No access to Node fs -- shell.exec is the only I/O mechanism per project architecture. |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── brief/
│   ├── generate.ts          # Pure function: generateBrief(data) -> markdown string
│   ├── generate.test.ts     # Comprehensive tests for brief output
│   └── types.ts             # BriefInput, BriefResult types
├── views/
│   └── MainView.tsx          # Wire brief generation + UI (copy button, stats, warnings)
```

### Pattern 1: Pure Markdown Generator Function
**What:** A single pure function that takes fully-typed input and returns a markdown string. No side effects, no async, no shell calls.
**When to use:** This is THE pattern for brief generation.
**Why:** Follows the project's established pattern of pure functions for all data transformation (see `normalizeNode`, `collectTokens`, `identifyAssets`). Enables comprehensive unit testing with Vitest.

```typescript
// src/brief/generate.ts
import type { ExtractLayoutResult } from '../layout/extract';
import type { ExportResult } from '../assets/types';

export interface BriefInput {
  extraction: ExtractLayoutResult;
  exportResult: ExportResult;
  projectPath: string;
  fileName: string;
  figmaUrl: string;
}

export interface BriefResult {
  markdown: string;
  /** Character count of the markdown */
  charCount: number;
  /** Estimated token count (chars / 4) */
  estimatedTokens: number;
  /** Summary stats for UI display */
  stats: BriefStats;
}

export interface BriefStats {
  nodeCount: number;
  colorCount: number;
  fontCount: number;
  assetCount: number;
  estimatedTokens: number;
}

export function generateBrief(input: BriefInput): BriefResult {
  // Pure function -- string concatenation, no side effects
}
```

### Pattern 2: Section Builder Functions
**What:** Break the brief into section builder functions, each responsible for one markdown section. Compose them in the main `generateBrief()`.
**When to use:** Always -- keeps each section testable and the main function readable.

```typescript
// Internal section builders (not exported -- tested via generateBrief output)
function buildMetadataSection(input: BriefInput): string { ... }
function buildPreviewSection(previewPath: string, projectPath: string): string { ... }
function buildLayoutTree(nodes: LayoutNode[], indent: number): string { ... }
function buildColorTokensTable(colors: ColorToken[]): string { ... }
function buildTypographyTable(typography: TypographyToken[]): string { ... }
function buildSpacingTable(spacing: SpacingToken[]): string { ... }
function buildBorderTable(borders: BorderToken[]): string { ... }
function buildShadowTable(shadows: ShadowToken[]): string { ... }
function buildComponentInventory(components: ComponentInventoryEntry[]): string { ... }
function buildAssetReferences(assets: ExportResult['assets'], projectPath: string): string { ... }
```

### Pattern 3: Layout Tree Rendering
**What:** Recursive indented tree rendering with inline property summaries.
**When to use:** For the layout tree section.

```typescript
function renderNodeLine(node: LayoutNode, depth: number): string {
  const indent = '  '.repeat(depth);
  const parts: string[] = [];

  // Type and name
  if (node.componentRef) {
    let label = `Instance "${node.componentRef.componentName}"`;
    if (node.repeatCount && node.repeatCount > 1) {
      label += ` x${node.repeatCount} (repeated)`;
    }
    parts.push(label);
  } else if (node.type === 'TEXT') {
    const text = (node.textContent ?? '').slice(0, 60);
    const suffix = (node.textContent ?? '').length > 60 ? '...' : '';
    // Include font info from textStyle if available
    const fontInfo = node.textStyle
      ? ` (${node.textStyle.fontFamily} ${node.textStyle.fontSize}/${node.textStyle.fontWeight})`
      : '';
    parts.push(`Text '${text}${suffix}'${fontInfo}`);
  } else {
    parts.push(`${node.type} '${node.name}'`);
  }

  // Auto-layout properties (skip defaults)
  if (node.autoLayout) {
    const al = node.autoLayout;
    const props: string[] = [al.flexDirection];
    if (al.gap > 0) props.push(`gap: ${al.gap}`);
    if (al.justifyContent !== 'flex-start') props.push(`justify: ${al.justifyContent}`);
    if (al.alignItems !== 'flex-start') props.push(`align: ${al.alignItems}`);
    // Compact padding
    const p = al.padding;
    if (p.top || p.right || p.bottom || p.left) {
      if (p.top === p.bottom && p.left === p.right && p.top === p.left) {
        props.push(`padding: ${p.top}`);
      } else if (p.top === p.bottom && p.left === p.right) {
        props.push(`padding: ${p.top} ${p.left}`);
      } else {
        props.push(`padding: ${p.top} ${p.right} ${p.bottom} ${p.left}`);
      }
    }
    if (al.flexWrap === 'wrap') props.push('wrap');
    parts.push(`(${props.join(', ')})`);
  }

  // Dimensions
  if (node.width != null && node.height != null) {
    parts.push(`${Math.round(node.width)}x${Math.round(node.height)}`);
  }

  // Positioning
  if (node.positioning === 'ABSOLUTE') {
    parts.push('[absolute]');
  }

  return `${indent}${parts.join(' ')}`;
}
```

### Pattern 4: Shell-based File Write
**What:** Write brief to `.shipstudio/brief.md` using `shell.exec`.
**When to use:** After generating the markdown string.

The established pattern in the codebase uses `shell.exec` for all file I/O. For writing text content, use `bash -c` with heredoc or printf to avoid shell escaping issues with the markdown content:

```typescript
async function saveBrief(
  shell: Shell,
  projectPath: string,
  markdown: string,
): Promise<void> {
  const briefPath = `${projectPath}/.shipstudio/brief.md`;
  // Ensure directory exists
  await shell.exec('mkdir', ['-p', `${projectPath}/.shipstudio`]);
  // Write using base64 encoding to avoid shell escaping issues
  const encoded = btoa(unescape(encodeURIComponent(markdown)));
  await shell.exec('bash', ['-c', `echo '${encoded}' | base64 -d > '${briefPath}'`]);
}
```

**IMPORTANT:** Markdown content may contain single quotes, double quotes, backticks, dollar signs, and other shell-sensitive characters. Raw string interpolation into shell commands WILL break. Base64 encoding is the safest approach. Alternatively, use `printf '%s'` with properly escaped content, but base64 is more robust.

### Pattern 5: Clipboard via pbcopy
**What:** Copy markdown to macOS clipboard using `pbcopy`.
**When to use:** When user clicks "Copy Brief to Clipboard" button.

```typescript
async function copyToClipboard(
  shell: Shell,
  markdown: string,
): Promise<void> {
  // Use base64 to safely pass markdown content through shell
  const encoded = btoa(unescape(encodeURIComponent(markdown)));
  const result = await shell.exec('bash', ['-c', `echo '${encoded}' | base64 -d | pbcopy`]);
  if (result.exit_code !== 0) {
    throw new Error(`Clipboard copy failed: ${result.stderr}`);
  }
}
```

### Anti-Patterns to Avoid
- **Async brief generation:** Brief generation is a pure data transform -- do NOT make it async or add API calls. All data is already available.
- **String template literals with shell commands:** Never interpolate raw markdown into `shell.exec` commands -- shell metacharacters will break. Always encode.
- **Monolithic generator:** Don't put all markdown generation in one giant function. Break into section builders for testability.
- **Rendering framework-specific code:** The brief must describe "column, gap: 12, children fill width" NOT "flex-col gap-3 w-full" or "flex-direction: column". This is already handled by the LayoutNode structure.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token estimation | Custom tokenizer | `chars / 4` simple division | User decision: standard rough estimate, no dependencies |
| Shell escaping | String replacement escaping | Base64 encode/decode | Markdown contains every shell metacharacter. Base64 is bulletproof. |
| Clipboard API | Cross-platform clipboard | `pbcopy` via shell.exec | Platform is macOS (darwin). Ship Studio provides shell.exec. |

**Key insight:** This phase has zero external dependencies. All data is already extracted and typed. The brief generator is pure string concatenation. The I/O layer is thin shell.exec wrappers. Keep it simple.

## Common Pitfalls

### Pitfall 1: Shell Metacharacter Injection
**What goes wrong:** Markdown content contains `$`, backticks, single quotes, double quotes, `!`, `{}`, `()`, `|`, and other shell metacharacters. Interpolating raw markdown into `shell.exec('bash', ['-c', 'echo "' + markdown + '" | pbcopy'])` breaks catastrophically.
**Why it happens:** Natural to reach for simple string interpolation for shell commands.
**How to avoid:** Always base64-encode the markdown before passing through shell. Decode on the shell side with `base64 -d`.
**Warning signs:** Clipboard content is truncated, garbled, or contains only part of the brief. Shell errors on exec.

### Pitfall 2: Missing Relative Path Conversion
**What goes wrong:** Brief references asset paths as absolute paths like `/Users/julian/project/.shipstudio/assets/icon.svg` instead of relative `.shipstudio/assets/icon.svg`.
**Why it happens:** ExportResult.assets[].path contains absolute paths (built from `${assetsDir}/${filename}`).
**How to avoid:** Strip `projectPath` prefix from all asset paths when generating the brief. Use a helper: `path.replace(projectPath + '/', '')` or `path.slice(projectPath.length + 1)`.
**Warning signs:** Brief contains full absolute filesystem paths.

### Pitfall 3: Overly Verbose Layout Tree
**What goes wrong:** Layout tree includes every property on every node, making the brief unreadably long and blowing past the 12K token limit.
**Why it happens:** Not filtering out default/obvious values as user decision specifies.
**How to avoid:** Only include meaningful properties: skip `justify: flex-start` (default), skip `align: flex-start` (default), skip `wrap: nowrap` (default), skip `padding: 0`, skip `gap: 0`. Only show dimensions that are informative.
**Warning signs:** Token count exceeds 12K for simple designs. Tree lines are very long.

### Pitfall 4: Hidden Nodes in Brief
**What goes wrong:** Hidden nodes (visible: false) appear in the layout tree, cluttering the brief with nodes that won't be rendered.
**Why it happens:** Walking the tree without checking `node.visible`.
**How to avoid:** Skip nodes where `node.visible === false` during tree rendering. They are preserved in the data for completeness but should not appear in the brief.
**Warning signs:** Brief contains lines like `Frame 'Old Header' [hidden]` throughout.

### Pitfall 5: Token Estimation Off by Order of Magnitude
**What goes wrong:** Token estimate is wildly inaccurate because calculation uses the wrong unit (bytes vs chars) or divides by wrong constant.
**Why it happens:** Confusion between UTF-8 byte length and character count.
**How to avoid:** Use `markdown.length` (JavaScript string length = character count) divided by 4. Round to nearest thousand for display: `~${Math.round(chars / 4000)}K tokens`.
**Warning signs:** Estimate shows ~2K tokens for a brief that is clearly 10K+ when pasted into an LLM context.

### Pitfall 6: Brief Generation Blocking UI
**What goes wrong:** Even though brief generation is synchronous, a very large tree (2000+ nodes) could take noticeable time in string concatenation, making the UI feel frozen.
**Why it happens:** Synchronous string building in a single frame.
**How to avoid:** Set a "Generating brief..." spinner state before calling `generateBrief()`, then use `setTimeout(() => { ... }, 0)` or `requestAnimationFrame` to defer the heavy work so the spinner renders first. The generation itself is fast (sub-100ms for typical trees) but the UI paint needs a frame.
**Warning signs:** UI jumps directly from "Exporting assets..." to "Brief ready" with no intermediate state.

## Code Examples

### Example 1: Complete Brief Markdown Output Structure

```markdown
# Design Brief

**File:** Login Screen
**Frame:** Login Card
**Extracted:** 2026-02-28
**Figma URL:** https://www.figma.com/design/abc123/...

## Preview

![Preview](.shipstudio/assets/preview.png)

## Layout Tree

Frame 'Login Card' (column, gap: 24, padding: 32, 400x520)
  Frame 'Header' (column, gap: 8, align: center)
    Text 'Welcome Back' (Inter 24/700, line-height: 32)
    Text 'Sign in to your account' (Inter 14/400, line-height: 20)
  Frame 'Form' (column, gap: 16)
    Instance "InputField" x2 (repeated) 360x48
    Instance "Button" (variant: primary, size: large) 360x48
  Frame 'Footer' (row, justify: center, gap: 4)
    Text 'Don't have an account?' (Inter 12/400)
    Text 'Sign up' (Inter 12/600)

## Design Tokens

### Colors

| Name | Value | Usage |
|------|-------|-------|
| Primary/Blue | #0066ff | 5 |
| Text/Primary | #1a1a1a | 8 |
| Text/Secondary | #666666 | 3 |
| Background | #ffffff | 2 |

### Typography

| Name | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Heading/Large | Inter | 24px | 700 | 32px |
| Body/Regular | Inter | 14px | 400 | 20px |
| Body/Small | Inter | 12px | 400 | 16px |

### Spacing

| Value | Sources | Usage |
|-------|---------|-------|
| 4px | gap | 1 |
| 8px | gap | 1 |
| 16px | gap, padding-top | 3 |
| 24px | gap | 1 |
| 32px | padding | 1 |

### Borders

| Name | Radius | Stroke | Usage |
|------|--------|--------|-------|
| border-1 | 8px | -- | 3 |
| border-2 | 4px | 1px #cccccc | 2 |

### Shadows

| Name | Type | Value | Usage |
|------|------|-------|-------|
| shadow-1 | drop-shadow | 0 2px 8px rgba(0,0,0,0.1) | 1 |

## Components

| Component | Source | Variants | Usage |
|-----------|--------|----------|-------|
| InputField | local | -- | 2 |
| Button | local | variant: primary, size: large | 1 |

## Assets

| File | Type | Path |
|------|------|------|
| preview.png | Preview | .shipstudio/assets/preview.png |
| icon-arrow.svg | SVG | .shipstudio/assets/icon-arrow.svg |
| hero-image.png | PNG | .shipstudio/assets/hero-image.png |
```

### Example 2: Token Estimation and Warning

```typescript
function estimateTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

function formatTokenEstimate(tokens: number): string {
  if (tokens >= 1000) {
    return `~${Math.round(tokens / 1000)}K tokens`;
  }
  return `~${tokens} tokens`;
}

const TOKEN_WARNING_THRESHOLD = 12000;

function shouldWarn(tokens: number): boolean {
  return tokens > TOKEN_WARNING_THRESHOLD;
}
```

### Example 3: Compact Padding Formatting

```typescript
function formatPadding(p: { top: number; right: number; bottom: number; left: number }): string | null {
  if (p.top === 0 && p.right === 0 && p.bottom === 0 && p.left === 0) return null;
  if (p.top === p.bottom && p.left === p.right && p.top === p.left) {
    return `padding: ${p.top}`;
  }
  if (p.top === p.bottom && p.left === p.right) {
    return `padding: ${p.top} ${p.left}`;
  }
  return `padding: ${p.top} ${p.right} ${p.bottom} ${p.left}`;
}
```

### Example 4: Safe Shell File Write with Base64

```typescript
// Use btoa (available in browser/Ship Studio runtime) for encoding
async function writeBriefToFile(shell: Shell, projectPath: string, markdown: string): Promise<void> {
  const briefPath = `${projectPath}/.shipstudio/brief.md`;
  await shell.exec('mkdir', ['-p', `${projectPath}/.shipstudio`]);

  // Encode to base64 to avoid shell metacharacter issues
  // btoa only handles Latin1, so encode UTF-8 first
  const encoded = btoa(unescape(encodeURIComponent(markdown)));
  const result = await shell.exec('bash', ['-c', `echo '${encoded}' | base64 -d > '${briefPath}'`]);

  if (result.exit_code !== 0) {
    throw new Error(`Failed to save brief: ${result.stderr}`);
  }
}
```

**Note on base64 and large strings:** The base64-encoded string is passed as a shell argument via `echo '...'`. For very large briefs (50K+ characters, 70K+ base64), this could exceed shell argument limits (ARG_MAX is typically 256KB+ on macOS). For this project's scope (12K tokens ~= 48K chars ~= 64K base64), this is well within limits.

### Example 5: MainView Integration Pattern

```typescript
// After exportResult is set in runAssetExport:
const briefResult = generateBrief({
  extraction: result,  // ExtractLayoutResult
  exportResult: exportRes,
  projectPath: ctx.project.path,
  fileName: fileInfo?.name ?? 'Untitled',
  figmaUrl: urlInput,
});

// Save to file (non-blocking -- don't await before showing UI)
saveBrief(shell, ctx.project.path, briefResult.markdown).catch(err => {
  console.error('Brief save failed:', err);
});

// Update state
setBriefResult(briefResult);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Complex template engines for structured output | Simple string builders with TypeScript types | N/A (always simpler for this use case) | Zero dependencies, full type safety |
| Cross-platform clipboard libraries (clipboardy, etc.) | Platform-specific `pbcopy` via shell | N/A (Ship Studio is macOS) | No npm dependency needed |
| Structured JSON output for LLM consumption | Markdown output for LLM consumption | 2024+ (markdown is universal LLM input) | Better readability for both humans and LLMs |

## Open Questions

1. **base64 encoding availability in Ship Studio runtime**
   - What we know: `btoa` is a standard Web API available in browsers and modern Node.js. Ship Studio plugins run in a webview-like context.
   - What's unclear: Whether `btoa`/`atob` are available in the Ship Studio plugin runtime.
   - Recommendation: Use `btoa` as primary approach. If unavailable at implementation time, fall back to writing via `shell.exec('bash', ['-c', 'printf ...'])` with careful escaping, or write content to a temp file first using multiple `shell.exec` calls with smaller safe chunks. **Confidence: MEDIUM** -- `btoa` is widely available but untested in this specific runtime.

2. **`pbcopy` stdin piping via shell.exec**
   - What we know: `shell.exec('bash', ['-c', 'echo ... | pbcopy'])` should work. The codebase uses `shell.exec('curl', [...args])` extensively which proves shell command execution works.
   - What's unclear: Whether `shell.exec` supports piping between commands within a `bash -c` context. The existing `curl -o` pattern doesn't use piping.
   - Recommendation: Test `shell.exec('bash', ['-c', 'echo test | pbcopy'])` early. If piping doesn't work, use the alternative: write to temp file first, then `pbcopy < tmpfile`. **Confidence: MEDIUM** -- shell.exec supports arbitrary commands but piping is untested.

3. **Gradient tokens in brief**
   - What we know: `GradientToken` has a full CSS gradient string in `value`. It's a separate token type from colors.
   - What's unclear: Whether to include gradients in the Colors table or give them their own section.
   - Recommendation: Include gradients in a separate "Gradients" subsection under Design Tokens if any exist. Skip the subsection entirely if no gradients. The CSS values are long and would break color table formatting.

## Sources

### Primary (HIGH confidence)
- Project codebase analysis: `src/layout/types.ts`, `src/tokens/types.ts`, `src/assets/types.ts` -- complete typed data structures
- Project codebase analysis: `src/layout/extract.ts` -- ExtractLayoutResult interface (the primary input)
- Project codebase analysis: `src/views/MainView.tsx` -- existing UI patterns, state management, pipeline flow
- Project codebase analysis: `src/assets/download.ts` -- shell.exec patterns for file I/O
- Project codebase analysis: `src/tokens/color-utils.ts` -- CSS color/gradient formatting (already done)
- Project codebase analysis: `src/layout/flexbox-map.ts` -- CSS flexbox terms and `describeSizing()` helper
- Project codebase analysis: `src/styles.ts` -- existing CSS classes for warning, spinner, file-info

### Secondary (MEDIUM confidence)
- Shell escaping via base64 -- standard Unix technique, widely documented
- `pbcopy` clipboard on macOS -- standard system utility, no API changes
- Token estimation `chars / 4` -- standard rough estimate used across LLM tooling

### Tertiary (LOW confidence)
- `btoa`/`atob` availability in Ship Studio runtime -- assumed available but untested

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all patterns established in codebase
- Architecture: HIGH -- pure function + shell I/O is a proven pattern in this project (phases 2-4)
- Pitfalls: HIGH -- shell escaping is a well-understood problem, identified from code analysis
- Brief formatting: HIGH -- user decisions are very specific, data types are fully typed
- Clipboard/file I/O: MEDIUM -- `pbcopy` piping and base64 encoding untested in Ship Studio runtime

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable -- no external APIs or fast-moving dependencies)
