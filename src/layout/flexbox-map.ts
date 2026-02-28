/**
 * Figma auto-layout to CSS flexbox mapping.
 *
 * Converts Figma's HasFramePropertiesTrait values into CSS flexbox terms
 * per user decision: express direction/alignment using flex-direction,
 * justify-content, align-items, gap. Exact pixel values, no rounding.
 */

import type { AutoLayoutProps } from './types';

/**
 * Map Figma primaryAxisAlignItems to CSS justify-content.
 */
function mapPrimaryAlign(align?: string): string {
  switch (align) {
    case 'MIN': return 'flex-start';
    case 'CENTER': return 'center';
    case 'MAX': return 'flex-end';
    case 'SPACE_BETWEEN': return 'space-between';
    default: return 'flex-start';
  }
}

/**
 * Map Figma counterAxisAlignItems to CSS align-items.
 */
function mapCounterAlign(align?: string): string {
  switch (align) {
    case 'MIN': return 'flex-start';
    case 'CENTER': return 'center';
    case 'MAX': return 'flex-end';
    case 'BASELINE': return 'baseline';
    default: return 'flex-start';
  }
}

/**
 * Convert a Figma auto-layout frame's properties to CSS flexbox terms.
 *
 * @param frame - A Figma node with auto-layout properties (HasFramePropertiesTrait)
 * @returns AutoLayoutProps with CSS flexbox equivalents
 */
export function mapToFlexbox(frame: any): AutoLayoutProps {
  const result: AutoLayoutProps = {
    flexDirection: frame.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
    justifyContent: mapPrimaryAlign(frame.primaryAxisAlignItems),
    alignItems: mapCounterAlign(frame.counterAxisAlignItems),
    gap: frame.itemSpacing ?? 0,
    padding: {
      top: frame.paddingTop ?? 0,
      right: frame.paddingRight ?? 0,
      bottom: frame.paddingBottom ?? 0,
      left: frame.paddingLeft ?? 0,
    },
    flexWrap: frame.layoutWrap === 'WRAP' ? 'wrap' : 'nowrap',
  };

  // Include rowGap only when wrapping
  if (frame.layoutWrap === 'WRAP') {
    result.rowGap = frame.counterAxisSpacing ?? 0;
  }

  return result;
}

/**
 * Describe a sizing mode with resolved pixel value.
 *
 * Examples:
 * - describeSizing('HUG', 240) -> 'hug (240px)'
 * - describeSizing('FILL', undefined) -> 'fill'
 * - describeSizing('FIXED', 100) -> '100px'
 * - describeSizing(undefined, 50) -> '50px'
 */
export function describeSizing(mode: string | undefined, resolvedPx: number | undefined): string {
  switch (mode) {
    case 'HUG':
      return resolvedPx != null ? `hug (${resolvedPx}px)` : 'hug';
    case 'FILL':
      return 'fill';
    case 'FIXED':
    default:
      return `${resolvedPx ?? 0}px`;
  }
}
