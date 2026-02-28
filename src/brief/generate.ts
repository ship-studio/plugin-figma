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
import type { ExportResult } from '../assets/types';

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
 * 2. Preview (image link)
 * 3. Layout Tree (indented CSS flexbox tree)
 * 4. Design Tokens (grouped tables)
 * 5. Components (inventory table)
 * 6. Assets (file reference table)
 *
 * Empty sections are omitted entirely.
 */
export function generateBrief(input: BriefInput): BriefResult {
  const { extraction, exportResult, projectPath } = input;
  const tokens = extraction.tokens;

  const sections = [
    buildMetadataSection(input),
    buildPreviewSection(exportResult.previewPath, projectPath),
    buildLayoutTreeSection(extraction.extraction.rootNodes),
    buildDesignTokensSection(tokens),
    buildComponentsSection(tokens.components),
    buildAssetsSection(exportResult.previewPath, exportResult.assets, projectPath),
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

function buildPreviewSection(previewPath: string, projectPath: string): string {
  if (!previewPath) return '';
  const relativePath = toRelativePath(previewPath, projectPath);
  return `## Preview\n\n![Preview](${relativePath})`;
}

function buildLayoutTreeSection(rootNodes: LayoutNode[]): string {
  const lines: string[] = [];
  for (const node of rootNodes) {
    renderTree(node, 0, lines);
  }
  if (lines.length === 0) return '';
  return '## Layout Tree\n\n' + lines.join('\n');
}

function renderTree(node: LayoutNode, depth: number, lines: string[]): void {
  if (node.visible === false) return;

  lines.push(renderNodeLine(node, depth));

  // INSTANCE nodes are leaf -- do not recurse into children
  if (node.componentRef) return;

  if (node.children) {
    for (const child of node.children) {
      renderTree(child, depth + 1, lines);
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

function renderNodeLine(node: LayoutNode, depth: number): string {
  const indent = '  '.repeat(depth);
  const parts: string[] = [];

  // Type/name/component/text label
  if (node.componentRef) {
    let label = `Instance "${node.componentRef.componentName}"`;
    if (node.repeatCount && node.repeatCount > 1) {
      label += ` x${node.repeatCount} (repeated)`;
    }
    if (node.componentRef.variantProperties && Object.keys(node.componentRef.variantProperties).length > 0) {
      const variants = Object.entries(node.componentRef.variantProperties)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      label += ` (${variants})`;
    }
    parts.push(label);
  } else if (node.type === 'TEXT') {
    const content = node.textContent ?? '';
    const truncated = content.length > 60 ? content.slice(0, 60) + '...' : content;
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
    parts.push('[absolute]');
  }

  return `${indent}${parts.join(' ')}`;
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
    const variants = (c.variantProperties && Object.keys(c.variantProperties).length > 0)
      ? Object.entries(c.variantProperties).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '--';
    return `| ${c.componentName} | ${c.source} | ${variants} | ${c.usageCount} |`;
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
): string {
  if (!previewPath && assets.length === 0) return '';

  const rows: string[] = [];

  if (previewPath) {
    const relPreview = toRelativePath(previewPath, projectPath);
    const filename = relPreview.split('/').pop() ?? relPreview;
    rows.push(`| ${filename} | Preview | ${relPreview} |`);
  }

  for (const asset of assets) {
    const relPath = toRelativePath(asset.path, projectPath);
    const ext = asset.filename.split('.').pop()?.toUpperCase() ?? 'FILE';
    rows.push(`| ${asset.filename} | ${ext} | ${relPath} |`);
  }

  return [
    '## Assets',
    '',
    '| File | Type | Path |',
    '|------|------|------|',
    ...rows,
  ].join('\n');
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
