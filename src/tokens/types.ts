/**
 * Design token type definitions.
 *
 * These types define the structured output of token extraction from Figma nodes.
 * Consumed by collectTokens (Plan 02) and the brief assembly (Phase 5).
 */

/** A solid color extracted from fills, strokes, or shadow effects. */
export interface ColorToken {
  /** CSS color value: #RRGGBB or rgba(R,G,B,A) */
  value: string;
  /** Figma style name if available, auto-generated otherwise */
  name: string;
  /** Number of nodes using this exact color */
  usageCount: number;
  /** Node IDs that use this color */
  nodeIds: string[];
  /** Where the color appears */
  source: ('fill' | 'stroke' | 'shadow')[];
}

/** A gradient fill converted to CSS gradient syntax. */
export interface GradientToken {
  /** Full CSS gradient syntax: linear-gradient(135deg, #fff 0%, #000 100%) */
  value: string;
  /** Figma style name or auto-generated */
  name: string;
  /** Figma gradient type for reference (e.g., GRADIENT_LINEAR) */
  gradientType: string;
  usageCount: number;
  nodeIds: string[];
}

/** Typography style extracted from TEXT nodes. */
export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  /** Line height in px, or null if Figma uses AUTO */
  lineHeight: number | null;
  letterSpacing: number;
  /** Figma style name or auto-generated */
  name: string;
  usageCount: number;
  nodeIds: string[];
}

/** A spacing value extracted from auto-layout padding/gap. */
export interface SpacingToken {
  /** Spacing value in px */
  value: number;
  usageCount: number;
  /** Where the value appears: padding-top, gap, etc. */
  sources: string[];
}

/** Border properties (corner radius + stroke). */
export interface BorderToken {
  /** Uniform radius or null if per-corner */
  radius: number | null;
  /** Per-corner radii [TL, TR, BR, BL] or null if uniform */
  cornerRadii: number[] | null;
  strokeColor: string | null;
  strokeWeight: number | null;
  name: string;
  usageCount: number;
  nodeIds: string[];
}

/** Shadow effect (drop or inner shadow). */
export interface ShadowToken {
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

/** Reference to an image fill (actual export deferred to Phase 4). */
export interface ImageFillRef {
  /** Image reference key from Figma */
  imageRef: string;
  scaleMode: string;
  nodeId: string;
  nodeName: string;
  /** When this image fill lives inside an INSTANCE, the instance's node ID */
  parentInstanceId?: string;
}

/** A component instance entry for the component inventory. */
export interface ComponentInventoryEntry {
  componentName: string;
  description?: string;
  variantProperties?: Record<string, string | boolean>;
  source: 'local' | 'library';
  usageCount: number;
}

/** Complete collection of extracted design tokens. */
export interface DesignTokens {
  colors: ColorToken[];
  gradients: GradientToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  borders: BorderToken[];
  shadows: ShadowToken[];
  imageFills: ImageFillRef[];
  components: ComponentInventoryEntry[];
}
