import { describe, it, expect } from 'vitest';
import { figmaColorToCSS, gradientToCSS } from './color-utils';

// ────────────────────────────────────────────────────────────────────
// figmaColorToCSS Tests
// ────────────────────────────────────────────────────────────────────

describe('figmaColorToCSS', () => {
  it('converts pure red (opaque) to hex', () => {
    expect(figmaColorToCSS({ r: 1, g: 0, b: 0, a: 1 })).toBe('#ff0000');
  });

  it('converts a mid-range color to hex with rounding', () => {
    // r=0.29 -> 73.95 -> 74 -> 4a
    // g=0.56 -> 142.8 -> 143 -> 8f
    // b=0.85 -> 216.75 -> 217 -> d9
    expect(figmaColorToCSS({ r: 0.29, g: 0.56, b: 0.85, a: 1 })).toBe('#4a8fd9');
  });

  it('converts semi-transparent white to rgba', () => {
    expect(figmaColorToCSS({ r: 1, g: 1, b: 1, a: 0.5 })).toBe('rgba(255, 255, 255, 0.5)');
  });

  it('converts fully transparent black to rgba', () => {
    expect(figmaColorToCSS({ r: 0, g: 0, b: 0, a: 0 })).toBe('rgba(0, 0, 0, 0)');
  });

  it('handles exact 0 values for all channels', () => {
    expect(figmaColorToCSS({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
  });

  it('handles exact 1 values for all channels', () => {
    expect(figmaColorToCSS({ r: 1, g: 1, b: 1, a: 1 })).toBe('#ffffff');
  });

  it('formats alpha with up to 2 decimal places', () => {
    const result = figmaColorToCSS({ r: 0, g: 0, b: 0, a: 0.333 });
    // 0.333 -> toFixed(2) -> "0.33" -> parseFloat -> 0.33
    expect(result).toBe('rgba(0, 0, 0, 0.33)');
  });

  it('formats alpha without trailing zeros', () => {
    const result = figmaColorToCSS({ r: 1, g: 0, b: 0, a: 0.5 });
    // 0.5 -> toFixed(2) -> "0.50" -> parseFloat -> 0.5
    expect(result).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('treats alpha of exactly 1 as opaque (hex)', () => {
    expect(figmaColorToCSS({ r: 0.5, g: 0.5, b: 0.5, a: 1 })).toBe('#808080');
  });
});

// ────────────────────────────────────────────────────────────────────
// gradientToCSS Tests
// ────────────────────────────────────────────────────────────────────

describe('gradientToCSS', () => {
  it('converts GRADIENT_LINEAR with 2 stops', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0, y: 0.5 },  // start: left-center
        { x: 1, y: 0.5 },  // end: right-center
        { x: 0, y: 0 },    // width control (unused for angle)
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    // dx=1, dy=0 -> atan2(0,1) = 0 rad -> 0 deg -> + 90 = 90deg
    expect(result).toBe('linear-gradient(90deg, #ffffff 0%, #000000 100%)');
  });

  it('converts vertical gradient (top to bottom) to 180deg', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0.5, y: 0 },  // start: top-center
        { x: 0.5, y: 1 },  // end: bottom-center
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    // dx=0, dy=1 -> atan2(1,0) = 90 deg -> + 90 = 180deg
    expect(result).toBe('linear-gradient(180deg, #ff0000 0%, #0000ff 100%)');
  });

  it('converts horizontal gradient (left to right) to 90deg', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    expect(result).toBe('linear-gradient(90deg, #ffffff 0%, #000000 100%)');
  });

  it('converts diagonal gradient (top-left to bottom-right) to 135deg', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0, y: 0 },    // start: top-left
        { x: 1, y: 1 },    // end: bottom-right
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    // dx=1, dy=1 -> atan2(1,1) = 45 deg -> + 90 = 135deg
    expect(result).toBe('linear-gradient(135deg, #ffffff 0%, #000000 100%)');
  });

  it('converts GRADIENT_RADIAL to radial-gradient', () => {
    const paint = {
      type: 'GRADIENT_RADIAL',
      gradientHandlePositions: [
        { x: 0.5, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    expect(result).toBe('radial-gradient(#ff0000 0%, #0000ff 100%)');
  });

  it('converts GRADIENT_ANGULAR to conic-gradient', () => {
    const paint = {
      type: 'GRADIENT_ANGULAR',
      gradientHandlePositions: [
        { x: 0.5, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 1, b: 1, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    expect(result).toBe('conic-gradient(#ffff00 0%, #00ffff 100%)');
  });

  it('converts GRADIENT_DIAMOND to radial-gradient fallback with note', () => {
    const paint = {
      type: 'GRADIENT_DIAMOND',
      gradientHandlePositions: [
        { x: 0.5, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0.5, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 0, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    // Diamond gradient has no CSS equivalent; falls back to radial-gradient
    expect(result).toContain('radial-gradient');
    expect(result).toContain('#ffffff 0%');
    expect(result).toContain('#000000 100%');
  });

  it('handles gradient stops with alpha colors', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0.5, y: 0 },
        { x: 0.5, y: 1 },
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 0.5 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 0.8 } },
      ],
    };

    const result = gradientToCSS(paint);
    expect(result).toBe('linear-gradient(180deg, rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 255, 0.8) 100%)');
  });

  it('handles gradient with 3 stops', () => {
    const paint = {
      type: 'GRADIENT_LINEAR',
      gradientHandlePositions: [
        { x: 0, y: 0.5 },
        { x: 1, y: 0.5 },
        { x: 0, y: 0 },
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
        { position: 0.5, color: { r: 0, g: 1, b: 0, a: 1 } },
        { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } },
      ],
    };

    const result = gradientToCSS(paint);
    expect(result).toBe('linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)');
  });
});
