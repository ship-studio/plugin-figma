/**
 * Brief generation pure function.
 *
 * Transforms all extracted Figma data (layout tree, design tokens, components,
 * asset references) into a structured markdown design brief. This is the core
 * deliverable of the plugin -- the formatted output that Claude Code consumes.
 *
 * Pure function: no side effects, no async, no API calls.
 */

import type { BriefInput, BriefResult, BriefStats } from './types';
import type { LayoutNode } from '../layout/types';
import type { DesignTokens, ColorToken, GradientToken, TypographyToken, SpacingToken, BorderToken, ShadowToken, ComponentInventoryEntry } from '../tokens/types';
import { figmaColorToCSS } from '../tokens/color-utils';
import type { ExportResult } from '../assets/types';
import { buildBreadcrumbMap } from '../assets/breadcrumb';

/** Token count above which a warning is shown in the UI. */
export const TOKEN_WARNING_THRESHOLD = 12_000;

/**
 * Estimate token count from a markdown string.
 * Standard rough estimate: chars / 4.
 */
export function estimateTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

/**
 * Generate a structured markdown design brief from extracted Figma data.
 *
 * The brief follows a locked section order:
 * 1. Metadata (file, frame, date, URL)
 * 2. How to Use This Brief (behavioral instructions)
 * 3. Preview (image link)
 * 4. Layout Tree (indented CSS flexbox tree)
 * 5. Design Tokens (grouped tables)
 * 6. Components (inventory table)
 * 7. Assets (file reference table)
 *
 * Empty sections are omitted entirely.
 */
export function generateBrief(input: BriefInput): BriefResult {
  const { extraction, exportResult, projectPath } = input;
  const tokens = extraction.tokens;

  // Build asset node map (nodeId → filename) for tree cross-referencing
  const assetNodeMap = new Map<string, string>();
  for (const asset of exportResult.assets) {
    if (asset.nodeId) {
      assetNodeMap.set(asset.nodeId, asset.filename);
    }
    // Map parentInstanceId -> filename so INSTANCE lines show -> child-image.png
    if (asset.parentInstanceId && !assetNodeMap.has(asset.parentInstanceId)) {
      assetNodeMap.set(asset.parentInstanceId, asset.filename);
    }
  }

  // Compute breadcrumb map from rootNodes for asset location column
  const rootNodes = input.rootNodes ?? extraction.extraction.rootNodes;
  const breadcrumbMap = buildBreadcrumbMap(rootNodes);

  const sections = [
    buildMetadataSection(input),
    buildInstructionsSection(),
    buildPreviewSection(exportResult.previewPath, projectPath),
    buildLayoutTreeSection(extraction.extraction.rootNodes, assetNodeMap),
    buildDesignTokensSection(tokens),
    buildComponentsSection(tokens.components),
    buildAssetsSection(exportResult.previewPath, exportResult.assets, projectPath, breadcrumbMap),
  ].filter(Boolean);

  const markdown = sections.join('\n\n');
  const charCount = markdown.length;
  const estimated = estimateTokens(markdown);

  const stats: BriefStats = {
    nodeCount: extraction.extraction.nodeCount,
    colorCount: tokens.colors.length,
    fontCount: tokens.typography.length,
    assetCount: exportResult.assets.length,
    estimatedTokens: estimated,
  };

  return {
    markdown,
    charCount,
    estimatedTokens: estimated,
    stats,
  };
}

// ── Section builders (module-private) ─────────────────────────────────

function buildMetadataSection(input: BriefInput): string {
  const { extraction, fileName, figmaUrl } = input;
  const frameName = extraction.extraction.rootNodes[0]?.name ?? 'Untitled';
  const date = input.date ?? new Date().toISOString().slice(0, 10);

  return [
    '# Design Brief',
    '',
    `**File:** ${fileName}`,
    `**Frame:** ${frameName}`,
    `**Extracted:** ${date}`,
    `**Figma URL:** ${figmaUrl}`,
  ].join('\n');
}

function buildInstructionsSection(): string {
  return [
    '## How to Use This Brief',
    '',
    '**Before building:** Read this brief fully. Plan your approach and ask clarifying questions before writing any code.',
    '**During building:** Use only the assets listed in the Assets section below -- if an asset is missing, ask the user rather than substituting or fabricating a replacement.',
    '**After building:** Compare your result against the Preview image above and verify that all design tokens and assets are correctly applied.',
  ].join('\n');
}

function buildPreviewSection(previewPath: string, projectPath: string): string {
  if (!previewPath) return '';
  const relativePath = toRelativePath(previewPath, projectPath);
  return `## Preview\n\n![Preview](${relativePath})`;
}

function buildLayoutTreeSection(
  rootNodes: LayoutNode[],
  assetNodeMap: Map<string, string>,
): string {
  const lines: string[] = [];
  for (const node of rootNodes) {
    renderTree(node, 0, lines, assetNodeMap);
  }
  if (lines.length === 0) return '';
  return '## Layout Tree\n\n' + lines.join('\n');
}

function renderTree(
  node: LayoutNode,
  depth: number,
  lines: string[],
  assetNodeMap: Map<string, string>,
): void {
  if (node.visible === false) return;

  lines.push(renderNodeLine(node, depth, assetNodeMap));

  // INSTANCE nodes are leaf -- do not recurse into children
  if (node.componentRef) return;

  if (node.children) {
    for (const child of node.children) {
      renderTree(child, depth + 1, lines, assetNodeMap);
    }
  }
}

/**
 * Convert Figma node type to display-friendly title case.
 * FRAME -> Frame, GROUP -> Group, RECTANGLE -> Rectangle, etc.
 */
function displayType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

/**
 * Clean up Figma component names for display.
 * Strips "Property N=" prefixes from variant-encoded component names.
 * e.g. "Property 1=Green, Property 2=Large" → "Green, Large"
 */
function cleanComponentName(name: string): string {
  if (/Property\s+\d+=/i.test(name)) {
    return name
      .split(',')
      .map(part => {
        const eqIdx = part.indexOf('=');
        if (eqIdx !== -1) {
          const key = part.slice(0, eqIdx).trim();
          const val = part.slice(eqIdx + 1).trim();
          if (/^Property\s+\d+$/i.test(key)) return val;
        }
        return part.trim();
      })
      .join(', ');
  }
  return name;
}

function renderNodeLine(node: LayoutNode, depth: number, assetNodeMap?: Map<string, string>): string {
  const indent = '  '.repeat(depth);
  const parts: string[] = [];

  // Type/name/component/text label
  if (node.componentRef) {
    const displayName = cleanComponentName(node.componentRef.componentName);
    let label = `Instance "${displayName}"`;
    if (node.repeatCount && node.repeatCount > 1) {
      label += ` x${node.repeatCount} (repeated)`;
    }
    if (node.componentRef.variantProperties && Object.keys(node.componentRef.variantProperties).length > 0) {
      const variants = Object.entries(node.componentRef.variantProperties)
        .map(([k, v]) => {
          // Strip generic Figma property names like "Property 1"
          if (/^Property\s+\d+$/i.test(k)) return String(v);
          return `${k}: ${v}`;
        })
        .join(', ');
      label += ` (${variants})`;
    }
    // Add asset cross-reference if available
    const assetFile = assetNodeMap?.get(node.id);
    if (assetFile) {
      label += ` -> ${assetFile}`;
    }
    parts.push(label);
  } else if (node.type === 'TEXT') {
    const content = node.textContent ?? '';
    const truncated = content.length > 200 ? content.slice(0, 200) + '...' : content;
    let fontInfo = '';
    if (node.textStyle) {
      fontInfo = ` (${node.textStyle.fontFamily} ${node.textStyle.fontSize}/${node.textStyle.fontWeight})`;
    }
    parts.push(`Text '${truncated}'${fontInfo}`);
  } else {
    parts.push(`${displayType(node.type)} '${node.name}'`);
  }

  // Auto-layout props (skip defaults)
  if (node.autoLayout) {
    const al = node.autoLayout;
    const props: string[] = [al.flexDirection];

    if (al.gap > 0) props.push(`gap: ${al.gap}`);
    if (al.justifyContent !== 'flex-start') props.push(`justify: ${al.justifyContent}`);
    if (al.alignItems !== 'flex-start') props.push(`align: ${al.alignItems}`);

    const padding = formatPadding(al.padding);
    if (padding) props.push(padding);

    if (al.flexWrap === 'wrap') props.push('wrap');

    parts.push(`(${props.join(', ')})`);
  }

  // Dimensions
  if (node.width != null && node.height != null) {
    parts.push(`${Math.round(node.width)}x${Math.round(node.height)}`);
  }

  // Positioning
  if (node.positioning === 'ABSOLUTE') {
    if (node.absoluteOffset) {
      parts.push(`[absolute] top:${node.absoluteOffset.top} left:${node.absoluteOffset.left}`);
    } else {
      parts.push('[absolute]');
    }
  }

  // Inline visual styles — bg, text color, border-radius, opacity
  const styles = buildInlineStyles(node);
  if (styles) {
    parts.push(styles);
  }

  return `${indent}${parts.join(' ')}`;
}

/**
 * Extract primary solid fill color from a Figma fills array.
 */
function getPrimaryFill(fills: any[] | undefined): string | null {
  if (!fills) return null;
  // Find the first visible solid fill
  for (const f of fills) {
    if (f.visible === false) continue;
    if (f.type === 'SOLID' && f.color) {
      const opacity = f.opacity ?? 1;
      const color = { ...f.color, a: (f.color.a ?? 1) * opacity };
      return figmaColorToCSS(color);
    }
  }
  return null;
}

/**
 * Build compact inline style annotation for a node.
 * Returns string like "bg:#191a23 r:14 opacity:0.5" or null if nothing interesting.
 */
function buildInlineStyles(node: LayoutNode): string | null {
  const props: string[] = [];

  // Size modes (FILL/HUG are interesting; FIXED is default)
  if (node.widthMode === 'FILL') props.push('w:fill');
  if (node.heightMode === 'FILL') props.push('h:fill');
  if (node.widthMode === 'HUG') props.push('w:hug');
  if (node.heightMode === 'HUG') props.push('h:hug');

  // Background color (skip for TEXT nodes — their fills are text color)
  if (node.type !== 'TEXT') {
    const bg = getPrimaryFill(node.fills);
    if (bg && bg !== '#ffffff' && bg !== '#000000') {
      // Skip ultra-common defaults to reduce noise
      props.push(`bg:${bg}`);
    } else if (bg) {
      props.push(`bg:${bg}`);
    }
  }

  // Text color (from fills on TEXT nodes)
  if (node.type === 'TEXT') {
    const textColor = getPrimaryFill(node.fills);
    if (textColor) {
      props.push(`color:${textColor}`);
    }
  }

  // Border radius
  if (node.cornerRadius && node.cornerRadius > 0) {
    props.push(`r:${Math.round(node.cornerRadius)}`);
  }

  // Stroke
  if (node.strokeWeight && node.strokeWeight > 0 && node.strokes?.length) {
    const strokeColor = getPrimaryFill(node.strokes);
    if (strokeColor) {
      props.push(`border:${node.strokeWeight}px ${strokeColor}`);
    }
  }

  // Flex-child properties (SPACE-01, SPACE-02)
  if (node.layoutGrow === 1) {
    props.push('flex-grow:1');
  }
  if (node.layoutAlign === 'STRETCH') {
    props.push('align-self:stretch');
  }

  // Opacity (only when < 1)
  if (node.opacity != null && node.opacity < 1) {
    props.push(`opacity:${node.opacity.toFixed(2)}`);
  }

  if (props.length === 0) return null;
  return `{${props.join(' ')}}`;
}

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

function buildDesignTokensSection(tokens: DesignTokens): string {
  const subsections: string[] = [];

  if (tokens.colors.length > 0) {
    subsections.push(buildColorsTable(tokens.colors));
  }
  if (tokens.gradients.length > 0) {
    subsections.push(buildGradientsTable(tokens.gradients));
  }
  if (tokens.typography.length > 0) {
    subsections.push(buildTypographyTable(tokens.typography));
  }
  if (tokens.spacing.length > 0) {
    subsections.push(buildSpacingTable(tokens.spacing));
  }
  if (tokens.borders.length > 0) {
    subsections.push(buildBordersTable(tokens.borders));
  }
  if (tokens.shadows.length > 0) {
    subsections.push(buildShadowsTable(tokens.shadows));
  }

  if (subsections.length === 0) return '';
  return '## Design Tokens\n\n' + subsections.join('\n\n');
}

function buildColorsTable(colors: ColorToken[]): string {
  const rows = colors.map(c => `| ${c.name} | ${c.value} | ${c.usageCount} |`);
  return [
    '### Colors',
    '',
    '| Name | Value | Usage |',
    '|------|-------|-------|',
    ...rows,
  ].join('\n');
}

function buildGradientsTable(gradients: GradientToken[]): string {
  const rows = gradients.map(g => `| ${g.name} | ${g.value} | ${g.usageCount} |`);
  return [
    '### Gradients',
    '',
    '| Name | Value | Usage |',
    '|------|-------|-------|',
    ...rows,
  ].join('\n');
}

function buildTypographyTable(typography: TypographyToken[]): string {
  const rows = typography.map(t => {
    const lh = t.lineHeight !== null ? `${t.lineHeight}px` : 'auto';
    return `| ${t.name} | ${t.fontFamily} | ${t.fontSize}px | ${t.fontWeight} | ${lh} |`;
  });
  return [
    '### Typography',
    '',
    '| Name | Font | Size | Weight | Line Height |',
    '|------|------|------|--------|-------------|',
    ...rows,
  ].join('\n');
}

function buildSpacingTable(spacing: SpacingToken[]): string {
  const rows = spacing.map(s => `| ${s.value}px | ${s.sources.join(', ')} | ${s.usageCount} |`);
  return [
    '### Spacing',
    '',
    '| Value | Sources | Usage |',
    '|-------|---------|-------|',
    ...rows,
  ].join('\n');
}

function buildBordersTable(borders: BorderToken[]): string {
  const rows = borders.map(b => {
    const radius = b.radius !== null ? `${b.radius}px` : (b.cornerRadii ? b.cornerRadii.map(r => `${r}px`).join(' ') : '--');
    const stroke = (b.strokeWeight !== null && b.strokeColor !== null) ? `${b.strokeWeight}px ${b.strokeColor}` : '--';
    return `| ${b.name} | ${radius} | ${stroke} | ${b.usageCount} |`;
  });
  return [
    '### Borders',
    '',
    '| Name | Radius | Stroke | Usage |',
    '|------|--------|--------|-------|',
    ...rows,
  ].join('\n');
}

function buildShadowsTable(shadows: ShadowToken[]): string {
  const rows = shadows.map(s => {
    const value = `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
    return `| ${s.name} | ${s.type} | ${value} | ${s.usageCount} |`;
  });
  return [
    '### Shadows',
    '',
    '| Name | Type | Value | Usage |',
    '|------|------|-------|-------|',
    ...rows,
  ].join('\n');
}

function buildComponentsSection(components: ComponentInventoryEntry[]): string {
  if (components.length === 0) return '';

  const rows = components.map(c => {
    const displayName = cleanComponentName(c.componentName);
    const variants = (c.variantProperties && Object.keys(c.variantProperties).length > 0)
      ? Object.entries(c.variantProperties)
          .map(([k, v]) => {
            if (/^Property\s+\d+$/i.test(k)) return String(v);
            return `${k}: ${v}`;
          })
          .join(', ')
      : '--';
    return `| ${displayName} | ${c.source} | ${variants} | ${c.usageCount} |`;
  });

  return [
    '## Components',
    '',
    '| Component | Source | Variants | Usage |',
    '|-----------|--------|----------|-------|',
    ...rows,
  ].join('\n');
}

function buildAssetsSection(
  previewPath: string,
  assets: ExportResult['assets'],
  projectPath: string,
  breadcrumbMap: Map<string, string>,
): string {
  if (!previewPath && assets.length === 0) return '';

  const rows: string[] = [];

  if (previewPath) {
    const relPreview = toRelativePath(previewPath, projectPath);
    const filename = relPreview.split('/').pop() ?? relPreview;
    rows.push(`| ${filename} | Preview | -- | ${relPreview} |`);
  }

  for (const asset of assets) {
    const relPath = toRelativePath(asset.path, projectPath);
    const typeLabel = assetTypeLabel(asset.assetType);
    // Breadcrumb lookup: try direct nodeId first, then fallback to parentInstanceId
    // (instance child nodeIds aren't in the normalized tree's breadcrumb map)
    let location = '--';
    if (asset.nodeId) {
      location = breadcrumbMap.get(asset.nodeId) || (asset.parentInstanceId ? (breadcrumbMap.get(asset.parentInstanceId) || '--') : '--');
    }
    rows.push(`| ${asset.filename} | ${typeLabel} | ${location} | ${relPath} |`);
  }

  return [
    '## Assets',
    '',
    '| File | Type | Location | Path |',
    '|------|------|----------|------|',
    ...rows,
  ].join('\n');
}

/**
 * Map asset type to display label for the brief table.
 */
function assetTypeLabel(assetType?: 'icon' | 'image'): string {
  switch (assetType) {
    case 'icon': return 'Icon';
    case 'image': return 'Image';
    default: return 'File';
  }
}

/**
 * Convert an absolute path to project-relative by stripping the projectPath prefix.
 */
function toRelativePath(absolutePath: string, projectPath: string): string {
  if (absolutePath.startsWith(projectPath + '/')) {
    return absolutePath.slice(projectPath.length + 1);
  }
  return absolutePath;
}
