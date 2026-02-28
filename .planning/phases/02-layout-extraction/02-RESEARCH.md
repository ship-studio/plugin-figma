# Phase 2: Layout Extraction - Research

**Researched:** 2026-02-28
**Domain:** Figma REST API tree traversal, node property extraction, TypeScript data modeling
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Component Instance Handling**
- Treat component instances as **named references** (leaf nodes), not expanded trees
- Include: component name, variant properties, description (when available)
- Include **override values** -- text overrides, icon swaps, nested instance replacements
- Tag source as **local** or **library: [library name]** so Claude Code knows whether it's a custom or design-system component

**Node Filtering**
- **Hidden layers**: Include in the tree but mark as hidden (designers use hidden layers for alternate states like hover, error, loading)
- **Boolean operations and masks**: Treat as leaf nodes with a descriptive name (e.g., "icon-shape [boolean]") -- don't expose constituent shapes
- **Text nodes**: Include the actual text content string (e.g., "Text: 'Sign up for free'") -- essential for Claude Code to generate matching UI
- **Structural groups/wrappers**: Claude's discretion on collapsing single-child frames with no auto-layout

**Auto-layout Language**
- Express direction and alignment using **CSS flexbox terms** (flex-direction, justify-content, align-items, gap)
- Express sizing modes using **semantic labels with resolved values**: e.g., "width: hug (240px)", "height: fill"
- Report spacing values as **exact pixels** from Figma (padding: 12px 16px, gap: 8px) -- no rounding to scales
- **Capture constraints**: min/max width/height and aspect ratio locks alongside auto-layout props (important for responsive behavior)

**Large Tree Handling**
- **Truncation strategy**: Claude's discretion on depth limits vs node count limits and thresholds
- **Warn before extracting large trees**: After API fetch, check node count; if large, prompt user: "This selection has ~N nodes. Extract anyway or narrow your scope?"
- **Deduplicate repeated instances**: When multiple identical component instances appear (e.g., 20 list items), show one representative instance with "repeated N more times"
- **API fetching strategy**: Claude's discretion on single call with depth param vs incremental fetching

### Claude's Discretion
- Structural group collapsing heuristic (single-child frames with no auto-layout)
- Truncation thresholds and strategy (depth limit vs node count)
- API fetching approach (single call vs incremental)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LYOT-01 | Plugin extracts component hierarchy (parent-child node tree) from selected scope | Figma `GET /v1/files/:key` and `GET /v1/files/:key/nodes` endpoints return full node trees with `children` arrays. `@figma/rest-api-spec` provides typed `Node`, `SubcanvasNode`, `HasChildrenTrait` types. Recursive traversal pattern documented below. |
| LYOT-02 | Plugin extracts auto-layout properties (direction, spacing, padding, alignment, sizing modes, wrap) | `HasFramePropertiesTrait` provides `layoutMode`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `paddingLeft/Right/Top/Bottom`, `itemSpacing`, `layoutWrap`, `counterAxisSpacing`, `counterAxisAlignContent`. `HasLayoutTrait` provides `layoutSizingHorizontal/Vertical`. Mapping to CSS flexbox terms documented in Architecture Patterns. |
| LYOT-03 | Plugin extracts node dimensions (width, height, constraints) | `HasLayoutTrait` provides `absoluteBoundingBox` (Rectangle with x,y,width,height), `size` (Vector with x,y), `constraints` (LayoutConstraint), `minWidth/maxWidth/minHeight/maxHeight`, `preserveRatio`. |
| LYOT-04 | Plugin preserves Figma layer names as semantic hints in the extracted tree | `IsLayerTrait` provides `name` on every node. Directly mapped to output tree. |
| LYOT-05 | Plugin handles absolute-positioned children within auto-layout frames correctly | `HasLayoutTrait` provides `layoutPositioning: 'AUTO' | 'ABSOLUTE'`. Children with `layoutPositioning === 'ABSOLUTE'` should be tagged distinctly from flow children. |
</phase_requirements>

## Summary

Phase 2 extracts a normalized layout tree from Figma via the REST API. The project already has a working `figmaApiCall<T>()` wrapper, URL parsing, file validation, and the `@figma/rest-api-spec@0.36.0` package installed for official Figma types. The core work is: (1) fetch the full node tree from the API using the appropriate endpoint based on extraction scope, (2) recursively walk the tree to build a normalized layout structure, (3) map Figma's auto-layout properties to CSS flexbox terms, (4) handle component instances as leaf nodes with metadata, and (5) manage large trees with node counting and deduplication.

The Figma REST API provides two endpoints for fetching node data: `GET /v1/files/:key` (full file, with optional `ids` and `depth` params) and `GET /v1/files/:key/nodes` (specific nodes with subtrees). Both return typed `Node` unions with `children` arrays, auto-layout properties, dimensions, and component metadata. The `@figma/rest-api-spec` package provides complete TypeScript types for all response structures, so there is no need to hand-define API response types.

**Primary recommendation:** Use `GET /v1/files/:key/nodes` with the target node ID for node/frame scopes (returns focused subtree), and `GET /v1/files/:key` with `depth` unset for page scope. Build a recursive tree walker that normalizes Figma node properties into a clean `LayoutNode` interface expressed in CSS flexbox terms. The existing `figmaApiCall<T>()` handles all HTTP concerns.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@figma/rest-api-spec` | 0.36.0 | TypeScript types for Figma REST API responses | Official Figma package, already installed. Provides `Node`, `GetFileResponse`, `GetFileNodesResponse`, component types, and all trait types. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | All extraction logic is pure TypeScript data transformation -- no additional libraries required. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@figma/rest-api-spec` types | Hand-written types | `@figma/rest-api-spec` is official, complete, and already installed. No reason to hand-write. |
| `figma-api` npm package | Raw curl via `figmaApiCall` | The `figma-api` package uses fetch/axios internally, which won't work in Ship Studio's shell-exec-only environment. Must continue using `figmaApiCall`. |

**Installation:**
No new packages needed. `@figma/rest-api-spec` is already a devDependency.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── figma-api.ts          # Existing -- add fetchFileNodes(), fetchFile()
├── layout/
│   ├── types.ts          # LayoutNode interface (our normalized output type)
│   ├── extract.ts        # Main extraction orchestrator (scope -> API call -> normalize)
│   ├── normalize.ts      # Recursive tree walker: Figma Node -> LayoutNode
│   └── flexbox-map.ts    # Figma auto-layout -> CSS flexbox term mapping
├── types.ts              # Existing -- add ExtractionResult type
└── views/
    └── MainView.tsx      # Existing -- wire handleExtract to extraction logic
```

### Pattern 1: Figma API Endpoint Selection by Scope
**What:** Choose the correct Figma API endpoint based on the user's extraction scope.
**When to use:** Always -- scope determines which API call to make.
**Example:**
```typescript
// Source: @figma/rest-api-spec GetFileResponse, GetFileNodesResponse types
import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';

async function fetchLayoutTree(
  shell: Shell,
  token: string,
  fileKey: string,
  scope: ExtractionScope,
  nodeId: string | null
): Promise<{ rootNodes: Node[]; components: Record<string, Component> }> {
  if (scope === 'node' || scope === 'frame') {
    // Use /nodes endpoint -- returns focused subtree from the specified node
    if (!nodeId) throw new Error('Node ID required for node/frame scope');
    const response = await figmaApiCall<GetFileNodesResponse>(
      shell,
      `/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`,
      token
    );
    const nodeData = response.nodes[nodeId];
    if (!nodeData) throw new Error('Node not found in response');
    return {
      rootNodes: [nodeData.document],
      components: nodeData.components,
    };
  }

  // Page scope -- fetch entire file
  const response = await figmaApiCall<GetFileResponse>(
    shell,
    `/files/${fileKey}`,
    token
  );
  // Return first page's children (or all pages depending on UI)
  return {
    rootNodes: response.document.children.flatMap(page => page.children),
    components: response.components,
  };
}
```

### Pattern 2: Recursive Tree Normalization with Node Type Dispatch
**What:** Walk the Figma node tree recursively, dispatching on node type to build a normalized `LayoutNode` tree.
**When to use:** Core extraction logic -- every Figma node gets normalized.
**Example:**
```typescript
// Core normalization function
function normalizeNode(
  figmaNode: Node | SubcanvasNode,
  components: Record<string, Component>,
  depth: number
): LayoutNode | null {
  const base = figmaNode as any; // All nodes share IsLayerTrait

  // Skip SLICE nodes (export regions, not layout)
  if (base.type === 'SLICE') return null;

  const node: LayoutNode = {
    id: base.id,
    name: base.name,
    type: base.type,
    visible: base.visible !== false, // defaults to true
  };

  // Dimensions from HasLayoutTrait
  if ('absoluteBoundingBox' in base && base.absoluteBoundingBox) {
    node.width = base.absoluteBoundingBox.width;
    node.height = base.absoluteBoundingBox.height;
  }

  // Sizing mode from HasLayoutTrait
  if ('layoutSizingHorizontal' in base) {
    node.widthMode = base.layoutSizingHorizontal; // FIXED | HUG | FILL
  }
  if ('layoutSizingVertical' in base) {
    node.heightMode = base.layoutSizingVertical;
  }

  // Absolute positioning flag (LYOT-05)
  if ('layoutPositioning' in base) {
    node.positioning = base.layoutPositioning; // AUTO | ABSOLUTE
  }

  // Auto-layout properties from HasFramePropertiesTrait
  if ('layoutMode' in base && base.layoutMode && base.layoutMode !== 'NONE') {
    node.autoLayout = mapToFlexbox(base);
  }

  // Constraints from HasLayoutTrait
  if ('constraints' in base && base.constraints) {
    node.constraints = base.constraints;
  }

  // Min/max dimensions
  if ('minWidth' in base) node.minWidth = base.minWidth;
  if ('maxWidth' in base) node.maxWidth = base.maxWidth;
  if ('minHeight' in base) node.minHeight = base.minHeight;
  if ('maxHeight' in base) node.maxHeight = base.maxHeight;
  if ('preserveRatio' in base) node.preserveRatio = base.preserveRatio;

  // Dispatch by type for specialized handling
  switch (base.type) {
    case 'TEXT':
      node.textContent = base.characters;
      break;
    case 'INSTANCE':
      node.componentRef = buildComponentRef(base, components);
      break;
    case 'BOOLEAN_OPERATION':
      // Leaf node, don't recurse into children
      node.type = `${base.type}`;
      return node;
  }

  // Recurse into children (for FRAME, GROUP, COMPONENT, SECTION, etc.)
  if ('children' in base && Array.isArray(base.children)) {
    node.children = base.children
      .map(child => normalizeNode(child, components, depth + 1))
      .filter((n): n is LayoutNode => n !== null);
  }

  return node;
}
```

### Pattern 3: Figma Auto-Layout to CSS Flexbox Mapping
**What:** Convert Figma's auto-layout enum values to CSS flexbox terms.
**When to use:** Every frame with `layoutMode !== 'NONE'`.
**Example:**
```typescript
// Source: Figma HasFramePropertiesTrait documentation
function mapToFlexbox(frame: HasFramePropertiesTrait & HasLayoutTrait): AutoLayoutProps {
  return {
    // layoutMode HORIZONTAL -> row, VERTICAL -> column
    flexDirection: frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column',

    // primaryAxisAlignItems -> justify-content
    justifyContent: mapPrimaryAlign(frame.primaryAxisAlignItems),

    // counterAxisAlignItems -> align-items
    alignItems: mapCounterAlign(frame.counterAxisAlignItems),

    // itemSpacing -> gap
    gap: frame.itemSpacing ?? 0,

    // Individual padding values
    padding: {
      top: frame.paddingTop ?? 0,
      right: frame.paddingRight ?? 0,
      bottom: frame.paddingBottom ?? 0,
      left: frame.paddingLeft ?? 0,
    },

    // Wrap
    flexWrap: frame.layoutWrap === 'WRAP' ? 'wrap' : 'nowrap',

    // Counter axis spacing (only relevant when wrapping)
    ...(frame.layoutWrap === 'WRAP' && {
      rowGap: frame.counterAxisSpacing ?? 0,
    }),
  };
}

function mapPrimaryAlign(
  align?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
): string {
  switch (align) {
    case 'MIN': return 'flex-start';
    case 'CENTER': return 'center';
    case 'MAX': return 'flex-end';
    case 'SPACE_BETWEEN': return 'space-between';
    default: return 'flex-start';
  }
}

function mapCounterAlign(
  align?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE'
): string {
  switch (align) {
    case 'MIN': return 'flex-start';
    case 'CENTER': return 'center';
    case 'MAX': return 'flex-end';
    case 'BASELINE': return 'baseline';
    default: return 'flex-start';
  }
}
```

### Pattern 4: Component Instance as Named Reference
**What:** Extract component metadata from INSTANCE nodes using the `components` map in the API response.
**When to use:** Every node with `type === 'INSTANCE'`.
**Example:**
```typescript
// Source: @figma/rest-api-spec InstanceNode, Component types
function buildComponentRef(
  instance: InstanceNode,
  components: Record<string, Component>
): ComponentRef {
  const componentMeta = components[instance.componentId];
  return {
    componentId: instance.componentId,
    componentName: componentMeta?.name ?? instance.name,
    description: componentMeta?.description || undefined,
    isRemote: componentMeta?.remote ?? false,
    source: componentMeta?.remote ? 'library' : 'local',
    // Variant properties from componentProperties
    variantProperties: extractVariantProps(instance.componentProperties),
    // Override values
    overrides: instance.overrides,
  };
}

function extractVariantProps(
  props?: Record<string, ComponentProperty>
): Record<string, string | boolean> | undefined {
  if (!props) return undefined;
  const result: Record<string, string | boolean> = {};
  for (const [key, prop] of Object.entries(props)) {
    if (prop.type === 'VARIANT' || prop.type === 'BOOLEAN' || prop.type === 'TEXT') {
      result[key] = prop.value;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}
```

### Pattern 5: Node Counting and Large Tree Warning
**What:** After fetching the API response, count total nodes before normalization. Warn user if count exceeds threshold.
**When to use:** Always -- count after fetch, before expensive normalization.
**Example:**
```typescript
function countNodes(node: any): number {
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

// Threshold recommendation: 500 nodes triggers warning, 2000 nodes max before forced truncation
const WARN_THRESHOLD = 500;
const MAX_THRESHOLD = 2000;
```

### Pattern 6: Deduplication of Repeated Component Instances
**What:** Detect groups of identical component instances (same `componentId` with same property values) and collapse them to one representative plus a count.
**When to use:** During normalization, after children are processed for a parent node.
**Example:**
```typescript
function deduplicateChildren(children: LayoutNode[]): LayoutNode[] {
  const seen = new Map<string, { node: LayoutNode; count: number; indices: number[] }>();

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.componentRef) {
      // Build fingerprint from componentId + variant properties
      const key = buildInstanceFingerprint(child);
      const existing = seen.get(key);
      if (existing) {
        existing.count++;
        existing.indices.push(i);
      } else {
        seen.set(key, { node: child, count: 1, indices: [i] });
      }
    }
  }

  // Replace duplicate groups with representative + count annotation
  // Only deduplicate groups of 3+ identical instances
  const result: LayoutNode[] = [];
  const skipIndices = new Set<number>();

  for (const entry of seen.values()) {
    if (entry.count >= 3) {
      entry.node.repeatCount = entry.count;
      // Keep the first occurrence, skip the rest
      for (let i = 1; i < entry.indices.length; i++) {
        skipIndices.add(entry.indices[i]);
      }
    }
  }

  for (let i = 0; i < children.length; i++) {
    if (!skipIndices.has(i)) {
      result.push(children[i]);
    }
  }
  return result;
}
```

### Anti-Patterns to Avoid
- **Expanding component instances into full subtrees:** The user decision explicitly says treat instances as leaf nodes. Do NOT recurse into INSTANCE node children -- extract metadata only.
- **Using `GET /v1/files/:key` for single-node extraction:** This fetches the entire file. Use `GET /v1/files/:key/nodes?ids=X` instead -- it returns only the targeted subtree, which is much faster and smaller.
- **Rounding spacing values to design token scales:** The user decision says exact pixels from Figma. No rounding.
- **Ignoring `layoutPositioning: 'ABSOLUTE'`:** This is a critical distinction (LYOT-05). Absolute children within auto-layout frames are positioned absolutely, not in the flow. They must be tagged distinctly.
- **Omitting hidden layers:** User decided to include them but mark as hidden. Do not filter them out.
- **Building response types by hand:** The `@figma/rest-api-spec` package provides complete `GetFileResponse`, `GetFileNodesResponse`, and all node types. Import, don't recreate.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Figma API response types | Custom TypeScript interfaces for API shapes | `@figma/rest-api-spec` types (`GetFileResponse`, `GetFileNodesResponse`, `Node`, etc.) | Official, complete, already installed. Hand-rolling misses edge cases and breaks on API changes. |
| HTTP client for Figma | `fetch()` or `axios` | `figmaApiCall<T>()` via `shell.exec('curl', ...)` | Ship Studio constraint: no direct network access, shell.exec + curl is the only path. Already built in Phase 1. |
| Node type guards | Manual `type === 'FRAME'` checks everywhere | Centralized type dispatch in `normalizeNode` | Figma has 20+ node types. Centralizing the dispatch prevents missed types and makes it easy to add handling. |

**Key insight:** The Figma API already returns a well-structured tree with typed properties. The extraction work is entirely data transformation -- mapping Figma terminology to CSS flexbox terminology and filtering/restructuring the tree. No new network logic, no new dependencies needed.

## Common Pitfalls

### Pitfall 1: Node Property Availability Varies by Type
**What goes wrong:** Attempting to read `layoutMode`, `children`, `characters`, or `componentProperties` on nodes that don't have those traits crashes or returns `undefined`.
**Why it happens:** The Figma API uses trait composition. `FrameNode` has `HasFramePropertiesTrait` (with `layoutMode`), but `TextNode` does not. `TextNode` has `TypePropertiesTrait` (with `characters`), but `FrameNode` does not.
**How to avoid:** Always check `'property' in node` or dispatch on `node.type` before accessing type-specific properties. The normalized `LayoutNode` type should use optional fields so callers don't assume presence.
**Warning signs:** TypeScript "property does not exist" errors, runtime `undefined` access.

### Pitfall 2: `visible` Defaults to `true` When Omitted
**What goes wrong:** Treating `visible === undefined` as hidden, when it actually means visible.
**Why it happens:** The Figma API only includes `visible: false` in the response when a layer is explicitly hidden. When `visible` is omitted, the node is visible.
**How to avoid:** Use `node.visible !== false` (not `node.visible === true`).
**Warning signs:** Most nodes appear as "hidden" in the output.

### Pitfall 3: Node ID Encoding Differences
**What goes wrong:** Node IDs from URL parsing use colon format ("12:34"), but the API `ids` parameter needs the same colon format -- however URL-encoded as "12%3A34" when passed as a query parameter.
**Why it happens:** Figma node IDs use colons internally. URLs often encode these as dashes ("12-34") or percent-encode them.
**How to avoid:** The existing `parseFigmaUrl` already converts dashes to colons. When passing to API endpoints, use `encodeURIComponent()` on the node ID.
**Warning signs:** 404 or empty results from `/nodes` endpoint.

### Pitfall 4: `absoluteBoundingBox` Can Be `null`
**What goes wrong:** Attempting to read `.width` or `.height` from `absoluteBoundingBox` throws when the node is invisible.
**Why it happens:** Per the Figma API: "This value will be `null` if the node is invisible." Hidden nodes may not have bounding box data.
**How to avoid:** Always null-check `absoluteBoundingBox` before accessing dimensions. For invisible nodes, fall back to `size` property (a Vector) if available.
**Warning signs:** Runtime null reference errors on hidden nodes.

### Pitfall 5: Component `remote` Flag May Not Reliably Indicate Library Source
**What goes wrong:** Assuming `remote: true` means the component comes from a shared library, and `remote: false` means local.
**Why it happens:** The `Component.remote` boolean only indicates whether the component definition exists in a different file. It doesn't provide the library name.
**How to avoid:** Use `remote` as the local/library discriminator as the user requested. The Component metadata in the response does not include the library name directly -- the `component.key` is a globally unique identifier, but the library name requires a separate `GET /v1/files/:key/components` or team library endpoint. For v1, tag as "library" (without specific name) when `remote: true`.
**Warning signs:** Missing library names in output (acceptable for v1).

### Pitfall 6: Large File API Timeout
**What goes wrong:** `GET /v1/files/:key` for a large file (hundreds of frames, thousands of nodes) exceeds the 55-second Figma server timeout or the 120-second shell timeout.
**Why it happens:** Complex Figma files can produce enormous JSON responses (100MB+). Figma's server may return "Request timeout" for very large files.
**How to avoid:** For page scope, consider fetching with `depth=2` first to get top-level structure, then fetch specific nodes as needed. For node/frame scope, `GET /v1/files/:key/nodes` already returns only the targeted subtree. The 120s shell timeout in `figmaApiCall` should be sufficient for most cases.
**Warning signs:** Curl returns empty response or Figma returns "Request timeout, try a smaller request."

### Pitfall 7: `primaryAxisSizingMode` / `counterAxisSizingMode` vs `layoutSizingHorizontal` / `layoutSizingVertical`
**What goes wrong:** Using the wrong sizing property -- the frame-level sizing modes (`primaryAxisSizingMode`, `counterAxisSizingMode`) are different from the child-level sizing modes (`layoutSizingHorizontal`, `layoutSizingVertical`).
**Why it happens:** `primaryAxisSizingMode` and `counterAxisSizingMode` describe whether the frame itself sizes to FIXED or AUTO along each axis. `layoutSizingHorizontal` and `layoutSizingVertical` describe how a child sizes within its parent (FIXED, HUG, or FILL). These are complementary but apply at different levels.
**How to avoid:** For the user-facing output, use `layoutSizingHorizontal/Vertical` which maps directly to the user's decision of "width: hug (240px)", "height: fill". The axis-level properties are less useful for the CSS-oriented output.
**Warning signs:** Confusion between "the frame is auto-sized" and "the child fills its parent."

### Pitfall 8: `children` Array Ordering is Visual Order (Bottom to Top)
**What goes wrong:** Assuming children are listed in z-order from top to bottom.
**Why it happens:** Figma's API returns children in the order they appear in the layers panel, which is bottom-most first (index 0 = bottom of stack). The `itemReverseZIndex` property on auto-layout frames can reverse this.
**How to avoid:** Preserve the array order as-is from the API. The layer panel order is the logical order designers work with. Do not reverse it unless `itemReverseZIndex` indicates otherwise.
**Warning signs:** Layout order appears inverted compared to Figma's layer panel.

## Code Examples

Verified patterns from official sources:

### Importing Types from @figma/rest-api-spec
```typescript
// Source: https://github.com/figma/rest-api-spec README
import type {
  GetFileResponse,
  GetFileNodesResponse,
  Node,
  SubcanvasNode,
  FrameNode,
  InstanceNode,
  TextNode,
  BooleanOperationNode,
  Component,
  ComponentProperty,
  HasFramePropertiesTrait,
  HasLayoutTrait,
  LayoutConstraint,
  Rectangle,
} from '@figma/rest-api-spec';
```

### Fetching a Specific Node Subtree
```typescript
// Source: Figma API docs GET /v1/files/:key/nodes
// Returns only the targeted node and its full subtree
const nodeId = '12:34';
const response = await figmaApiCall<GetFileNodesResponse>(
  shell,
  `/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`,
  token
);
// Response shape: { nodes: { "12:34": { document: Node, components: {...} } } }
const nodeData = response.nodes[nodeId];
const rootNode = nodeData.document;
const componentMap = nodeData.components;
```

### Fetching Full File for Page Scope
```typescript
// Source: Figma API docs GET /v1/files/:key
const response = await figmaApiCall<GetFileResponse>(
  shell,
  `/files/${fileKey}`,
  token
);
// response.document is DocumentNode with children: CanvasNode[]
// Each CanvasNode is a page with children: SubcanvasNode[]
const pages = response.document.children; // CanvasNode[]
const componentMap = response.components; // Component metadata for all components in file
```

### Checking if a Node Has Auto-Layout
```typescript
// Source: @figma/rest-api-spec HasFramePropertiesTrait
function hasAutoLayout(node: any): boolean {
  return 'layoutMode' in node &&
    node.layoutMode !== undefined &&
    node.layoutMode !== 'NONE';
}
```

### Reading Sizing Mode with Resolved Value
```typescript
// User decision: "width: hug (240px)", "height: fill"
function describeSizing(
  mode: 'FIXED' | 'HUG' | 'FILL' | undefined,
  resolvedPx: number | undefined
): string {
  switch (mode) {
    case 'HUG': return `hug${resolvedPx != null ? ` (${resolvedPx}px)` : ''}`;
    case 'FILL': return 'fill';
    case 'FIXED': return `${resolvedPx ?? 0}px`;
    default: return `${resolvedPx ?? 0}px`;
  }
}
```

### The LayoutNode Output Interface
```typescript
// This is the normalized output type the phase produces
interface LayoutNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;

  // Dimensions (LYOT-03)
  width?: number;
  height?: number;
  widthMode?: 'FIXED' | 'HUG' | 'FILL';
  heightMode?: 'FIXED' | 'HUG' | 'FILL';
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  preserveRatio?: boolean;
  constraints?: LayoutConstraint;

  // Auto-layout in CSS flexbox terms (LYOT-02)
  autoLayout?: {
    flexDirection: 'row' | 'column';
    justifyContent: string;
    alignItems: string;
    gap: number;
    padding: { top: number; right: number; bottom: number; left: number };
    flexWrap: 'wrap' | 'nowrap';
    rowGap?: number;
  };

  // Positioning within auto-layout parent (LYOT-05)
  positioning?: 'AUTO' | 'ABSOLUTE';

  // Text content
  textContent?: string;

  // Component reference (instances as leaf nodes)
  componentRef?: {
    componentId: string;
    componentName: string;
    description?: string;
    isRemote: boolean;
    source: 'local' | 'library';
    variantProperties?: Record<string, string | boolean>;
    overrides?: any[];
  };

  // Deduplication
  repeatCount?: number;

  // Children (LYOT-01)
  children?: LayoutNode[];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `layoutAlign: 'MIN' \| 'CENTER' \| 'MAX'` for child alignment | `layoutSizingHorizontal: 'FIXED' \| 'HUG' \| 'FILL'` | Figma auto-layout v4 (2022) | Old `layoutAlign` still appears for legacy compatibility but `layoutSizingHorizontal/Vertical` is the current API |
| No `layoutWrap` property | `layoutWrap: 'NO_WRAP' \| 'WRAP'` | Figma wrap auto-layout (2023) | Wrap support added to API, with `counterAxisSpacing` and `counterAxisAlignContent` |
| No `layoutMode: 'GRID'` | `layoutMode: 'GRID'` supported | Figma grid auto-layout (2024) | Grid layout mode added alongside HORIZONTAL/VERTICAL. Includes `gridRowCount`, `gridColumnCount`, `gridRowGap`, `gridColumnGap`, `gridColumnsSizing`, `gridRowsSizing` |
| `absoluteBoundingBox` only for dimensions | `size` (Vector) also available | Figma v1 | `size` gives width/height without position; `absoluteBoundingBox` gives position + size but can be null for invisible nodes |

**Deprecated/outdated:**
- `background` on frames: Deprecated in favor of `fills` (same data, different field)
- `backgroundColor` on frames: Deprecated in favor of `fills`
- `isFixed` on nodes: Deprecated in favor of `scrollBehavior`
- `layoutAlign` for sizing: Old API used `layoutAlign: 'STRETCH'` and `layoutGrow: 1` for what is now expressed as `layoutSizingHorizontal: 'FILL'`

## Open Questions

1. **Grid auto-layout handling**
   - What we know: Figma added `layoutMode: 'GRID'` with properties like `gridRowCount`, `gridColumnCount`, `gridColumnsSizing`, `gridRowsSizing`. The `@figma/rest-api-spec` types include these.
   - What's unclear: The user decisions only mention CSS flexbox terms. CSS Grid is a different layout model.
   - Recommendation: For v1, map `layoutMode: 'GRID'` to a `display: grid` equivalent in the output, including `grid-template-columns`, `grid-template-rows`, row/column gap. If this is too complex, tag it as `[grid layout]` and include the raw properties. This is at Claude's discretion since the user didn't explicitly address grid.

2. **Library name resolution for remote components**
   - What we know: The `Component.remote` boolean tells us the component is from another file. The user wants `library: [library name]` tagging.
   - What's unclear: The `GET /v1/files/:key` and `/nodes` endpoints don't include the library name directly. Getting the library name would require additional API calls to team/project endpoints.
   - Recommendation: For v1, use `source: 'library'` without the specific library name when `remote: true`. The component name and description still provide useful context. Flag this as a v2 enhancement.

3. **Structural group collapsing threshold**
   - What we know: User delegated this to Claude's discretion. Single-child frames with no auto-layout are structural wrappers.
   - What's unclear: How aggressive to be -- some single-child frames have meaningful names that designers intend as semantic boundaries.
   - Recommendation: Collapse only when ALL of these are true: (a) single child, (b) no auto-layout (`layoutMode === 'NONE'` or undefined), (c) no meaningful name (starts with "Frame" or "Group" -- the Figma defaults), (d) not a component instance. Preserve the child's properties but keep the parent's name if it's more descriptive.

## Sources

### Primary (HIGH confidence)
- `@figma/rest-api-spec@0.36.0` `dist/api_types.ts` -- All node types, trait types, response types, property enums. Read directly from installed package.
- [Figma REST API file endpoints documentation](https://developers.figma.com/docs/rest-api/file-endpoints) -- GET /v1/files/:key and GET /v1/files/:key/nodes query parameters (depth, ids).
- [Figma REST API files documentation](https://developers.figma.com/docs/rest-api/files) -- Node type hierarchy, property descriptions.

### Secondary (MEDIUM confidence)
- [Figma REST API rate limits](https://developers.figma.com/docs/rest-api/rate-limits/) -- Tier 2 for GET /v1/files (10-20 req/min depending on plan). Verified via official docs.
- [@figma/rest-api-spec GitHub README](https://github.com/figma/rest-api-spec) -- Import patterns, type naming conventions.

### Tertiary (LOW confidence)
- Large file timeout behavior (55s server-side limit, ~320MB max response size) -- sourced from Figma forum reports, not official documentation. Likely accurate but thresholds may change.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- `@figma/rest-api-spec` types verified directly from installed package, API endpoints verified from official docs
- Architecture: HIGH -- Recursive tree normalization is straightforward data transformation; all property types inspected in source
- Pitfalls: HIGH -- Node type trait composition, `visible` defaulting, `absoluteBoundingBox` nullability all verified from type definitions
- Flexbox mapping: HIGH -- All auto-layout property values enumerated in `@figma/rest-api-spec` HasFramePropertiesTrait, mapping is deterministic

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable -- Figma REST API changes are versioned and backward-compatible)
