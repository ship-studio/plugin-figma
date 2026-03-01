import { describe, it, expect } from 'vitest';
import { detectedToManual } from './adapt';
import type { DetectedAsset, ManualAsset } from './types';

describe('detectedToManual', () => {
  it('maps a DetectedAsset with format png to a ManualAsset with status valid', () => {
    const detected: DetectedAsset[] = [
      {
        nodeId: '12:34',
        nodeName: '@S-hero-image',
        filename: 'hero-image.png',
        format: 'png',
        depth: 2,
        parentPath: ['Page 1', 'Frame'],
      },
    ];

    const result = detectedToManual(detected);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      nodeId: '12:34',
      nodeName: '@S-hero-image',
      filename: 'hero-image.png',
      format: 'png',
      status: 'valid',
    });
    // Ensure detection-only fields are NOT present
    expect(result[0]).not.toHaveProperty('depth');
    expect(result[0]).not.toHaveProperty('parentPath');
  });

  it('maps a DetectedAsset with format svg to a ManualAsset with status valid', () => {
    const detected: DetectedAsset[] = [
      {
        nodeId: '56:78',
        nodeName: '@S-logo',
        filename: 'logo.svg',
        format: 'svg',
        depth: 1,
        parentPath: ['Page 1'],
      },
    ];

    const result = detectedToManual(detected);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      nodeId: '56:78',
      nodeName: '@S-logo',
      filename: 'logo.svg',
      format: 'svg',
      status: 'valid',
    });
  });

  it('returns an empty array for empty input', () => {
    const result = detectedToManual([]);
    expect(result).toEqual([]);
  });

  it('preserves order and maps all items in a multi-asset array', () => {
    const detected: DetectedAsset[] = [
      {
        nodeId: '1:1',
        nodeName: '@S-first',
        filename: 'first.png',
        format: 'png',
        depth: 0,
        parentPath: [],
      },
      {
        nodeId: '2:2',
        nodeName: '@S-second',
        filename: 'second.svg',
        format: 'svg',
        depth: 3,
        parentPath: ['A', 'B', 'C'],
      },
      {
        nodeId: '3:3',
        nodeName: '@S-third',
        filename: 'third.png',
        format: 'png',
        depth: 1,
        parentPath: ['Root'],
      },
    ];

    const result = detectedToManual(detected);

    expect(result).toHaveLength(3);
    expect(result.map(a => a.nodeId)).toEqual(['1:1', '2:2', '3:3']);
    expect(result.map(a => a.format)).toEqual(['png', 'svg', 'png']);
    expect(result.every(a => a.status === 'valid')).toBe(true);
  });
});
