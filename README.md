# Ship Studio Figma Plugin

A Figma plugin that extracts design data from Figma files and generates structured markdown briefs for Claude Code.

Paste a Figma URL, and the plugin walks the design tree to produce a layout-aware, token-rich brief that an AI coding agent can use to build faithful UI implementations.

## How It Works

1. **URL input** — User pastes a Figma file/frame/page URL into the plugin UI
2. **Layout extraction** — The Figma REST API tree is fetched and normalized into a CSS-flexbox-oriented layout tree
3. **Token collection** — Colors, typography, spacing, borders, shadows, and gradients are deduplicated into a design token inventory
4. **Asset detection** — Layers prefixed with `@S-` are identified as exportable assets; format (PNG vs SVG) is auto-determined from descendant content
5. **Asset export** — A 2x preview PNG plus all detected assets are rendered via the Figma API and downloaded to `.shipstudio/assets/`
6. **Brief generation** — All extracted data is assembled into a single structured markdown document (`brief.md`)

## Quick Start

```bash
# Install dependencies
npm install

# Dev mode (watches for changes)
npm run dev

# Production build
npm run build

# Run tests
npm test
```

The built plugin is loaded into the Ship Studio desktop app, which provides the shell, storage, and Figma API token context.

## Project Structure

```
src/
  index.tsx              # Plugin entry point
  types.ts               # Shared types (Shell, Storage, PluginContext)
  figma-api.ts           # Figma REST API client (fetch files, render images)
  url-parser.ts          # Figma URL → fileKey + nodeId parser
  context.ts             # React context for plugin host APIs
  styles.ts              # Shared CSS styles

  views/
    MainView.tsx          # Primary plugin UI (URL input, progress, results)
    SettingsView.tsx      # Settings panel
    SetupView.tsx         # First-run setup

  layout/
    extract.ts            # Orchestrates Figma API fetch → normalization
    normalize.ts          # Raw Figma tree → CSS-flexbox LayoutNode tree
    flexbox-map.ts        # Figma auto-layout → CSS flexbox property mapping
    types.ts              # LayoutNode, ExtractionResult types

  tokens/
    collect.ts            # Walks layout tree, deduplicates design tokens
    color-utils.ts        # Figma color → CSS color conversion
    types.ts              # DesignTokens, ColorToken, TypographyToken, etc.

  assets/
    detect.ts             # @S- prefix detection + PNG/SVG format resolution
    export.ts             # Export orchestrator (preview + manual assets)
    download.ts           # File download + assets directory management
    sanitize.ts           # Filename sanitization and collision resolution
    adapt.ts              # Asset adaptation utilities
    breadcrumb.ts         # Breadcrumb path computation for asset cross-refs
    types.ts              # DetectedAsset, ExportResult, ManualAsset types

  brief/
    generate.ts           # Pure function: all data → markdown brief
    io.ts                 # Brief file I/O (write to disk)
    types.ts              # BriefInput, BriefResult, BriefStats

  components/
    Modal.tsx             # Reusable modal component
    ResultsModal.tsx      # Post-extraction results display
```

## Architecture

```
Figma URL
  │
  ▼
url-parser ──→ fileKey + nodeId + scope
  │
  ▼
figma-api (REST) ──→ raw Figma document tree
  │
  ├──→ layout/extract ──→ layout/normalize ──→ LayoutNode tree
  │                                               │
  │                                               ├──→ tokens/collect ──→ DesignTokens
  │                                               │
  │                                               └──→ assets/detect ──→ DetectedAsset[]
  │
  ├──→ assets/export ──→ preview.png + asset files (to .shipstudio/assets/)
  │
  ▼
brief/generate (pure fn) ──→ brief.md
```

All extraction and generation logic is side-effect-free. The only I/O boundaries are `figma-api.ts` (HTTP), `assets/download.ts` (file writes), and `brief/io.ts` (brief write).

## Key Concepts

### `@S-` Asset Prefix

Designers mark layers for export by prefixing their name with `@S-` (case-insensitive). The text after the prefix becomes the filename:

- `@S-hero-banner` → `hero-banner.png`
- `@S-logo` → `logo.svg`

Format is auto-detected: layers with only vector primitives (no text or component instances) export as SVG; everything else exports as PNG. Vector-only groups (illustrations) are detected and exported as single PNGs rather than individual SVG fragments.

### Brief Modes

The plugin supports three brief modes that control the behavioral instructions embedded in the generated markdown:

| Mode | Purpose |
|---|---|
| **Best** (default) | Balanced — the AI agent should match the design closely while making pragmatic implementation choices |
| **Pixel** | Pixel-perfect — every dimension, spacing value, and color must be reproduced exactly |
| **Inspiration** | Use the design as a starting point — the agent has creative freedom to adapt and extend |

### Design Tokens

Tokens are deduplicated values extracted from the layout tree:

- **Colors** — fill and stroke colors (CSS hex/rgba)
- **Gradients** — linear/radial gradient CSS values
- **Typography** — font family, size, weight, line height
- **Spacing** — padding and gap values from auto-layout frames
- **Borders** — stroke weight, color, and radius
- **Shadows** — drop shadow and inner shadow effects

### Layout Tree

The normalized layout tree represents each Figma node as a CSS-flexbox-aware structure with direction, alignment, gap, and padding. The brief renders this as an indented text tree with dimensions and CSS properties, giving the AI agent a structural blueprint of the design.

## Testing

```bash
npm test
```

Tests use Vitest. Coverage includes:

- **URL parsing** — Figma URL variants → fileKey/nodeId extraction (`url-parser.test.ts`)
- **Asset detection** — `@S-` prefix matching, format resolution, dedup (`assets/detect.test.ts`)
- **Asset export** — Preview + manual asset orchestration (`assets/export.test.ts`)
- **Filename sanitization** — Edge cases, collisions, unicode (`assets/sanitize.test.ts`)
- **Breadcrumb paths** — Asset cross-reference path computation (`assets/breadcrumb.test.ts`)
- **Asset adaptation** — Composition and illustration detection (`assets/adapt.test.ts`)
- **Layout normalization** — Figma tree → LayoutNode conversion (`layout/normalize.test.ts`)
- **Token collection** — Deduplication and extraction (`tokens/collect.test.ts`)
- **Token color utils** — Figma color → CSS conversion (`tokens/color-utils.test.ts`)
- **Brief generation** — End-to-end markdown output (`brief/generate.test.ts`)
