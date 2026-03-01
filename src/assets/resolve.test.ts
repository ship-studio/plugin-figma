import { describe, it, expect } from 'vitest';
import {
  isInstanceChildId,
  extractParentInstanceId,
  suggestFormat,
  resolveFilenameCollision,
  deriveAssetFromNode,
  resolveNode,
} from './resolve';
import type { ManualAsset } from './types';
import type { Shell } from '../types';

// ── I-Prefix Detection ──────────────────────────────────────────────

describe('isInstanceChildId', () => {
  it('returns true for I-prefix node IDs with semicolon', () => {
    expect(isInstanceChildId('I20:1;20:2')).toBe(true);
    expect(isInstanceChildId('I1:2;3:4')).toBe(true);
  });

  it('returns false for regular node IDs', () => {
    expect(isInstanceChildId('12:34')).toBe(false);
    expect(isInstanceChildId('0:1')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isInstanceChildId('')).toBe(false);
  });
});

// ── Parent Instance ID Extraction ───────────────────────────────────

describe('extractParentInstanceId', () => {
  it('extracts parent ID from I-prefix node IDs', () => {
    expect(extractParentInstanceId('I20:1;20:2')).toBe('20:1');
    expect(extractParentInstanceId('I1:2;3:4')).toBe('1:2');
  });

  it('returns null for regular node IDs', () => {
    expect(extractParentInstanceId('12:34')).toBeNull();
  });

  it('returns null for I-prefix without semicolon', () => {
    expect(extractParentInstanceId('Ifoo')).toBeNull();
  });
});

// ── Format Suggestion ───────────────────────────────────────────────

describe('suggestFormat', () => {
  it('suggests svg for vector node types', () => {
    expect(suggestFormat('VECTOR')).toBe('svg');
    expect(suggestFormat('LINE')).toBe('svg');
    expect(suggestFormat('STAR')).toBe('svg');
    expect(suggestFormat('ELLIPSE')).toBe('svg');
    expect(suggestFormat('REGULAR_POLYGON')).toBe('svg');
    expect(suggestFormat('BOOLEAN_OPERATION')).toBe('svg');
  });

  it('suggests png for frame-like node types', () => {
    expect(suggestFormat('FRAME')).toBe('png');
    expect(suggestFormat('GROUP')).toBe('png');
    expect(suggestFormat('COMPONENT')).toBe('png');
    expect(suggestFormat('INSTANCE')).toBe('png');
  });

  it('suggests png for text and shape types', () => {
    expect(suggestFormat('TEXT')).toBe('png');
    expect(suggestFormat('RECTANGLE')).toBe('png');
  });

  it('falls back to png for unknown types', () => {
    expect(suggestFormat('UNKNOWN_TYPE')).toBe('png');
  });
});

// ── Filename Collision Resolution ───────────────────────────────────

describe('resolveFilenameCollision', () => {
  it('returns filename as-is when no collision', () => {
    expect(resolveFilenameCollision('icon.png', [])).toBe('icon.png');
  });

  it('appends -2 for first collision', () => {
    expect(resolveFilenameCollision('icon.png', ['icon.png'])).toBe('icon-2.png');
  });

  it('appends -3 when -2 is also taken', () => {
    expect(resolveFilenameCollision('icon.png', ['icon.png', 'icon-2.png'])).toBe('icon-3.png');
  });

  it('does not collide with different extensions', () => {
    expect(resolveFilenameCollision('icon.svg', ['icon.png'])).toBe('icon.svg');
  });

  it('handles filenames without extension', () => {
    expect(resolveFilenameCollision('logo', [])).toBe('logo');
  });
});

// ── Asset Derivation ────────────────────────────────────────────────

describe('deriveAssetFromNode', () => {
  it('derives a valid asset for a FRAME node', () => {
    const result = deriveAssetFromNode('12:34', 'Hero Image', 'FRAME', []);
    expect(result).toEqual({
      nodeId: '12:34',
      nodeName: 'Hero Image',
      filename: 'hero-image.png',
      format: 'png',
      status: 'valid',
      warning: undefined,
    });
  });

  it('derives svg format for VECTOR nodes', () => {
    const result = deriveAssetFromNode('5:6', 'Arrow', 'VECTOR', []);
    expect(result.filename).toBe('arrow.svg');
    expect(result.format).toBe('svg');
    expect(result.status).toBe('valid');
  });

  it('warns about generic Figma names', () => {
    const result = deriveAssetFromNode('7:8', 'Frame 427', 'FRAME', []);
    expect(result.filename).toBe('frame-427.png');
    expect(result.warning).toBe('Auto-named: frame-427.png -- consider renaming');
  });

  it('auto-numbers duplicate filenames', () => {
    const existing: ManualAsset[] = [
      { nodeId: '1:1', nodeName: 'Icon', filename: 'icon.svg', format: 'svg', status: 'valid' },
    ];
    const result = deriveAssetFromNode('9:10', 'Icon', 'VECTOR', existing);
    expect(result.filename).toBe('icon-2.svg');
  });

  it('handles empty name', () => {
    const result = deriveAssetFromNode('11:12', '', 'FRAME', []);
    expect(result.filename).toBe('unnamed.png');
  });
});

// ── resolveNode (error handling) ────────────────────────────────────

describe('resolveNode', () => {
  it('returns error asset when API call fails', async () => {
    const failingShell: Shell = {
      exec: async () => {
        throw new Error('Network error');
      },
    };

    const result = await resolveNode(failingShell, 'fake-token', 'file-key', '12:34', []);
    expect(result.status).toBe('error');
    expect(result.error).toContain('Network error');
    expect(result.nodeId).toBe('12:34');
    expect(result.format).toBe('png');
  });
});
