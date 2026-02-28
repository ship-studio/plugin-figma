/**
 * Pure color conversion utilities for Figma -> CSS.
 *
 * Converts Figma 0-1 RGBA floats to CSS hex/rgba strings, and
 * Figma gradient paints to CSS gradient syntax.
 */

/**
 * Convert a Figma RGBA color (0-1 floats) to a CSS color string.
 *
 * - Opaque colors (a >= 1) return #RRGGBB hex
 * - Transparent colors (a < 1) return rgba(R, G, B, A)
 *
 * @param color - Figma RGBA with channels in 0-1 range
 * @returns CSS color string
 */
export function figmaColorToCSS(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  if (color.a >= 1) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const alpha = parseFloat(color.a.toFixed(2));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Convert a Figma gradient paint to CSS gradient syntax.
 *
 * - GRADIENT_LINEAR -> linear-gradient(Ndeg, stops...)
 * - GRADIENT_RADIAL -> radial-gradient(stops...)
 * - GRADIENT_ANGULAR -> conic-gradient(stops...)
 * - GRADIENT_DIAMOND -> radial-gradient(stops...) (CSS approximation)
 *
 * @param paint - Figma GradientPaint object (typed as any)
 * @returns CSS gradient string
 */
export function gradientToCSS(paint: any): string {
  const stops = paint.gradientStops
    .map((stop: any) => {
      const color = figmaColorToCSS(stop.color);
      return `${color} ${Math.round(stop.position * 100)}%`;
    })
    .join(', ');

  switch (paint.type) {
    case 'GRADIENT_LINEAR': {
      const [start, end] = paint.gradientHandlePositions;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      // atan2 gives angle from positive x-axis; CSS 0deg = bottom-to-top
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
      // Normalize to 0-360
      const normalizedAngle = ((angleDeg % 360) + 360) % 360;
      return `linear-gradient(${normalizedAngle}deg, ${stops})`;
    }

    case 'GRADIENT_RADIAL':
      return `radial-gradient(${stops})`;

    case 'GRADIENT_ANGULAR':
      return `conic-gradient(${stops})`;

    case 'GRADIENT_DIAMOND':
      // No CSS equivalent for diamond gradients; approximate with radial
      return `/* diamond */ radial-gradient(${stops})`;

    default:
      return `linear-gradient(${stops})`;
  }
}
