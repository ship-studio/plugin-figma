/**
 * Token collection and deduplication engine.
 *
 * Walks an enriched LayoutNode tree and produces a deduplicated DesignTokens
 * collection with colors, gradients, typography, spacing, borders, shadows,
 * imageFills, and components.
 */

import type { LayoutNode } from '../layout/types';
import type {
  DesignTokens,
  ColorToken,
  GradientToken,
  TypographyToken,
  SpacingToken,
  BorderToken,
  ShadowToken,
  ImageFillRef,
  ComponentInventoryEntry,
} from './types';
import { figmaColorToCSS, gradientToCSS } from './color-utils';

// ────────────────────────────────────────────────────────────────────
// Internal accumulator types (mutable during walk, converted at end)
// ────────────────────────────────────────────────────────────────────

interface ColorAccum {
  value: string;
  name: string;
  usageCount: number;
  nodeIds: string[];
  source: Set<'fill' | 'stroke' | 'shadow'>;
}

interface GradientAccum {
  value: string;
  name: string;
  gradientType: string;
  usageCount: number;
  nodeIds: string[];
}

interface TypographyAccum {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | null;
  letterSpacing: number;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

interface BorderAccum {
  radius: number | null;
  cornerRadii: number[] | null;
  strokeColor: string | null;
  strokeWeight: number | null;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

interface ShadowAccum {
  type: 'drop-shadow' | 'inner-shadow';
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

interface ComponentAccum {
  componentName: string;
  description?: string;
  variantProperties?: Record<string, string | boolean>;
  source: 'local' | 'library';
  usageCount: number;
}

// ────────────────────────────────────────────────────────────────────
// Main collection function
// ────────────────────────────────────────────────────────────────────

/**
 * Walk an enriched LayoutNode tree and produce a deduplicated DesignTokens
 * collection.
 *
 * @param rootNodes - Array of root LayoutNodes (enriched with style data)
 * @param stylesMap - Map of Figma style IDs to { name, styleType }
 * @returns Complete DesignTokens collection
 */
export function collectTokens(
  rootNodes: LayoutNode[],
  stylesMap: Record<string, { name: string; styleType: string }>,
): DesignTokens {
  // Accumulators keyed by dedup key
  const colors = new Map<string, ColorAccum>();
  const gradients = new Map<string, GradientAccum>();
  const typography = new Map<string, TypographyAccum>();
  const spacing = new Map<number, SpacingToken>();
  const borders = new Map<string, BorderAccum>();
  const shadows = new Map<string, ShadowAccum>();
  const imageFills: ImageFillRef[] = [];
  const components = new Map<string, ComponentAccum>();

  // Auto-name counters
  let borderIndex = 0;
  let shadowIndex = 0;
  let gradientIndex = 0;

  // ── Walk the tree ─────────────────────────────────────────────────

  function walk(node: LayoutNode): void {
    // Extract colors from fills
    if (node.fills && Array.isArray(node.fills)) {
      const fillStyleName = resolveFillStyleName(node, stylesMap);
      for (const paint of node.fills) {
        if (paint.visible === false) continue;
        if (paint.type === 'SOLID') {
          const effectiveColor = { ...paint.color };
          if (paint.opacity != null && paint.opacity !== 1) {
            effectiveColor.a = effectiveColor.a * paint.opacity;
          }
          const cssValue = figmaColorToCSS(effectiveColor);
          accumulateColor(colors, cssValue, node.id, 'fill', fillStyleName);
        } else if (paint.type?.startsWith('GRADIENT_')) {
          const cssValue = gradientToCSS(paint);
          const key = cssValue;
          const existing = gradients.get(key);
          if (existing) {
            existing.usageCount++;
            existing.nodeIds.push(node.id);
          } else {
            gradientIndex++;
            gradients.set(key, {
              value: cssValue,
              name: fillStyleName ?? `gradient-${gradientIndex}`,
              gradientType: paint.type,
              usageCount: 1,
              nodeIds: [node.id],
            });
          }
        } else if (paint.type === 'IMAGE') {
          imageFills.push({
            imageRef: paint.imageRef,
            scaleMode: paint.scaleMode,
            nodeId: node.id,
            nodeName: node.name,
          });
        }
      }
    }

    // Extract colors from strokes
    if (node.strokes && Array.isArray(node.strokes)) {
      const strokeStyleName = resolveStrokeStyleName(node, stylesMap);
      for (const paint of node.strokes) {
        if (paint.visible === false) continue;
        if (paint.type === 'SOLID') {
          const effectiveColor = { ...paint.color };
          if (paint.opacity != null && paint.opacity !== 1) {
            effectiveColor.a = effectiveColor.a * paint.opacity;
          }
          const cssValue = figmaColorToCSS(effectiveColor);
          accumulateColor(colors, cssValue, node.id, 'stroke', strokeStyleName);
        }
      }
    }

    // Extract shadows from effects
    if (node.effects && Array.isArray(node.effects)) {
      const effectStyleName = resolveEffectStyleName(node, stylesMap);
      for (const effect of node.effects) {
        if (effect.visible !== true) continue;
        if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
          const shadowType: 'drop-shadow' | 'inner-shadow' =
            effect.type === 'DROP_SHADOW' ? 'drop-shadow' : 'inner-shadow';
          const colorCSS = figmaColorToCSS(effect.color);
          const offsetX = effect.offset?.x ?? 0;
          const offsetY = effect.offset?.y ?? 0;
          const blur = effect.radius ?? 0;
          const spread = effect.spread ?? 0;

          const key = `${shadowType}|${colorCSS}|${offsetX}|${offsetY}|${blur}|${spread}`;
          const existing = shadows.get(key);
          if (existing) {
            existing.usageCount++;
            existing.nodeIds.push(node.id);
          } else {
            shadowIndex++;
            shadows.set(key, {
              type: shadowType,
              color: colorCSS,
              offsetX,
              offsetY,
              blur,
              spread,
              name: effectStyleName ?? `shadow-${shadowIndex}`,
              usageCount: 1,
              nodeIds: [node.id],
            });
          }

          // Shadow colors also become ColorTokens with source 'shadow'
          accumulateColor(colors, colorCSS, node.id, 'shadow', null);
        }
        // Ignore LAYER_BLUR, BACKGROUND_BLUR, etc.
      }
    }

    // Extract typography from TEXT nodes
    if (node.type === 'TEXT' && node.textStyle) {
      const textStyleName = resolveTextStyleName(node, stylesMap);
      accumulateTypography(typography, node.textStyle, node.id, textStyleName);

      // Also check textStyleOverrides
      if (node.textStyleOverrides && typeof node.textStyleOverrides === 'object') {
        for (const overrideStyle of Object.values<any>(node.textStyleOverrides)) {
          accumulateTypography(typography, overrideStyle, node.id, null);
        }
      }
    }

    // Extract spacing from auto-layout
    if (node.autoLayout) {
      const al = node.autoLayout;
      // Padding values
      if (al.padding) {
        addSpacing(spacing, al.padding.top, 'padding-top');
        addSpacing(spacing, al.padding.right, 'padding-right');
        addSpacing(spacing, al.padding.bottom, 'padding-bottom');
        addSpacing(spacing, al.padding.left, 'padding-left');
      }
      // Gap
      addSpacing(spacing, al.gap, 'gap');
      // Row gap
      if (al.rowGap != null) {
        addSpacing(spacing, al.rowGap, 'row-gap');
      }
    }

    // Extract borders (cornerRadius, rectangleCornerRadii, strokes)
    if (
      node.cornerRadius != null ||
      node.rectangleCornerRadii != null ||
      hasVisibleSolidStroke(node)
    ) {
      const radius = node.rectangleCornerRadii ? null : (node.cornerRadius ?? null);
      const cornerRadii = node.rectangleCornerRadii ?? null;

      // Get stroke info from first visible solid stroke
      let strokeColor: string | null = null;
      let strokeWeight: number | null = null;
      if (node.strokes && Array.isArray(node.strokes)) {
        const firstSolid = node.strokes.find(
          (s: any) => s.visible !== false && s.type === 'SOLID',
        );
        if (firstSolid) {
          strokeColor = figmaColorToCSS(firstSolid.color);
          strokeWeight = node.strokeWeight ?? null;
        }
      }

      const key = `${radius}|${JSON.stringify(cornerRadii)}|${strokeColor}|${strokeWeight}`;
      const existing = borders.get(key);
      if (existing) {
        existing.usageCount++;
        existing.nodeIds.push(node.id);
      } else {
        borderIndex++;
        borders.set(key, {
          radius,
          cornerRadii,
          strokeColor,
          strokeWeight,
          name: `border-${borderIndex}`,
          usageCount: 1,
          nodeIds: [node.id],
        });
      }
    }

    // Extract component inventory from INSTANCE nodes with componentRef
    if (node.componentRef) {
      const ref = node.componentRef;
      const compKey = `${ref.componentName}::${JSON.stringify(ref.variantProperties ?? {})}`;
      const existing = components.get(compKey);
      const count = node.repeatCount ?? 1;
      if (existing) {
        existing.usageCount += count;
      } else {
        const entry: ComponentAccum = {
          componentName: ref.componentName,
          source: ref.source,
          usageCount: count,
        };
        if (ref.description) {
          entry.description = ref.description;
        }
        if (ref.variantProperties) {
          entry.variantProperties = ref.variantProperties;
        }
        components.set(compKey, entry);
      }
    }

    // Recurse into children
    if (node.children) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  for (const root of rootNodes) {
    walk(root);
  }

  // ── Convert accumulators to sorted output arrays ──────────────────

  const colorTokens: ColorToken[] = Array.from(colors.values()).map((c) => ({
    value: c.value,
    name: c.name,
    usageCount: c.usageCount,
    nodeIds: c.nodeIds,
    source: Array.from(c.source),
  }));
  colorTokens.sort((a, b) => b.usageCount - a.usageCount);

  const gradientTokens: GradientToken[] = Array.from(gradients.values());
  gradientTokens.sort((a, b) => b.usageCount - a.usageCount);

  const typographyTokens: TypographyToken[] = Array.from(typography.values());
  typographyTokens.sort((a, b) => b.usageCount - a.usageCount);

  const spacingTokens: SpacingToken[] = Array.from(spacing.values());
  spacingTokens.sort((a, b) => a.value - b.value);

  const borderTokens: BorderToken[] = Array.from(borders.values());
  borderTokens.sort((a, b) => b.usageCount - a.usageCount);

  const shadowTokens: ShadowToken[] = Array.from(shadows.values());
  shadowTokens.sort((a, b) => b.usageCount - a.usageCount);

  const componentEntries: ComponentInventoryEntry[] = Array.from(components.values());
  componentEntries.sort((a, b) => b.usageCount - a.usageCount);

  return {
    colors: colorTokens,
    gradients: gradientTokens,
    typography: typographyTokens,
    spacing: spacingTokens,
    borders: borderTokens,
    shadows: shadowTokens,
    imageFills,
    components: componentEntries,
  };
}

// ────────────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────────────

function accumulateColor(
  colors: Map<string, ColorAccum>,
  cssValue: string,
  nodeId: string,
  source: 'fill' | 'stroke' | 'shadow',
  styleName: string | null,
): void {
  const existing = colors.get(cssValue);
  if (existing) {
    existing.usageCount++;
    if (!existing.nodeIds.includes(nodeId)) {
      existing.nodeIds.push(nodeId);
    }
    existing.source.add(source);
    // Keep named style if we didn't have one
    if (styleName && existing.name.startsWith('color-')) {
      existing.name = styleName;
    }
  } else {
    // Auto-generate name from hex value
    const autoName = `color-${cssValue.replace(/^#/, '').replace(/[^a-f0-9]/gi, '')}`;
    colors.set(cssValue, {
      value: cssValue,
      name: styleName ?? autoName,
      usageCount: 1,
      nodeIds: [nodeId],
      source: new Set([source]),
    });
  }
}

function accumulateTypography(
  typography: Map<string, TypographyAccum>,
  style: any,
  nodeId: string,
  styleName: string | null,
): void {
  const fontFamily = style.fontFamily ?? 'Unknown';
  const fontSize = style.fontSize ?? 16;
  const fontWeight = style.fontWeight ?? 400;
  const lineHeight = style.lineHeightPx ?? null;
  const letterSpacing = style.letterSpacing ?? 0;

  const key = `${fontFamily}|${fontSize}|${fontWeight}|${lineHeight}|${letterSpacing}`;
  const existing = typography.get(key);
  if (existing) {
    existing.usageCount++;
    if (!existing.nodeIds.includes(nodeId)) {
      existing.nodeIds.push(nodeId);
    }
    if (styleName && existing.name.startsWith(fontFamily)) {
      existing.name = styleName;
    }
  } else {
    const autoName = `${fontFamily}-${fontSize}-${fontWeight}`;
    typography.set(key, {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      name: styleName ?? autoName,
      usageCount: 1,
      nodeIds: [nodeId],
    });
  }
}

function addSpacing(
  spacing: Map<number, SpacingToken>,
  value: number,
  source: string,
): void {
  if (value === 0) return;
  const existing = spacing.get(value);
  if (existing) {
    existing.usageCount++;
    if (!existing.sources.includes(source)) {
      existing.sources.push(source);
    }
  } else {
    spacing.set(value, {
      value,
      usageCount: 1,
      sources: [source],
    });
  }
}

function hasVisibleSolidStroke(node: LayoutNode): boolean {
  if (!node.strokes || !Array.isArray(node.strokes)) return false;
  return node.strokes.some((s: any) => s.visible !== false && s.type === 'SOLID');
}

// ── Style name resolution ───────────────────────────────────────────

function resolveFillStyleName(
  node: LayoutNode,
  stylesMap: Record<string, { name: string; styleType: string }>,
): string | null {
  const styleId = node.styleRefs?.fill;
  if (!styleId) return null;
  return stylesMap[styleId]?.name ?? null;
}

function resolveStrokeStyleName(
  node: LayoutNode,
  stylesMap: Record<string, { name: string; styleType: string }>,
): string | null {
  const styleId = node.styleRefs?.stroke;
  if (!styleId) return null;
  return stylesMap[styleId]?.name ?? null;
}

function resolveTextStyleName(
  node: LayoutNode,
  stylesMap: Record<string, { name: string; styleType: string }>,
): string | null {
  const styleId = node.styleRefs?.text;
  if (!styleId) return null;
  return stylesMap[styleId]?.name ?? null;
}

function resolveEffectStyleName(
  node: LayoutNode,
  stylesMap: Record<string, { name: string; styleType: string }>,
): string | null {
  const styleId = node.styleRefs?.effect;
  if (!styleId) return null;
  return stylesMap[styleId]?.name ?? null;
}
