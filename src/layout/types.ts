/**
 * Layout normalization types.
 *
 * These are the normalized output types consumed by Phase 3+ (design tokens,
 * asset export, brief assembly). All Figma node properties are mapped to
 * CSS-oriented equivalents.
 */

import type { LayoutConstraint } from '@figma/rest-api-spec';

/** Re-export LayoutConstraint for downstream convenience. */
export type { LayoutConstraint };

/**
 * A normalized representation of a Figma node, expressed in CSS flexbox terms.
 * This is the core output type of layout extraction.
 */
export interface LayoutNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;

  /** Dimensions (LYOT-03) */
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

  /** Auto-layout in CSS flexbox terms (LYOT-02) */
  autoLayout?: AutoLayoutProps;

  /** Positioning within auto-layout parent (LYOT-05) */
  positioning?: 'AUTO' | 'ABSOLUTE';

  /** Text content (user decision: include actual text) */
  textContent?: string;

  /** Component reference -- instances treated as leaf nodes */
  componentRef?: ComponentRef;

  /** Deduplication: how many identical instances this represents */
  repeatCount?: number;

  /** Children (LYOT-01) */
  children?: LayoutNode[];

  // ── Style data (Phase 3 — design token extraction) ──────────────

  /** Raw fill paints from Figma (for token extraction) */
  fills?: any[];
  /** Raw stroke paints from Figma */
  strokes?: any[];
  /** Stroke weight */
  strokeWeight?: number;
  /** Raw effects from Figma (shadows, blurs) */
  effects?: any[];
  /** Corner radius (uniform) */
  cornerRadius?: number;
  /** Per-corner radii [TL, TR, BR, BL] */
  rectangleCornerRadii?: number[];
  /** Typography style (TEXT nodes only) */
  textStyle?: any;
  /** Style overrides table (TEXT nodes with mixed styles) */
  textStyleOverrides?: any;
  /** Node-level opacity */
  opacity?: number;
  /** References to named Figma styles { fill: 'styleId', text: 'styleId', ... } */
  styleRefs?: Record<string, string>;
}

/**
 * CSS flexbox properties mapped from Figma auto-layout (LYOT-02).
 */
export interface AutoLayoutProps {
  flexDirection: 'row' | 'column';
  justifyContent: string;
  alignItems: string;
  gap: number;
  padding: { top: number; right: number; bottom: number; left: number };
  flexWrap: 'wrap' | 'nowrap';
  rowGap?: number;
}

/**
 * Component instance metadata. Instances are treated as leaf nodes
 * with component name, variant properties, and source tagging.
 */
export interface ComponentRef {
  componentId: string;
  componentName: string;
  description?: string;
  isRemote: boolean;
  source: 'local' | 'library';
  variantProperties?: Record<string, string | boolean>;
  overrides?: any[];
}

/**
 * Result of normalizing a Figma node tree.
 */
export interface ExtractionResult {
  rootNodes: LayoutNode[];
  nodeCount: number;
  truncated: boolean;
}
