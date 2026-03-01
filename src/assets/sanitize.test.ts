import { describe, it, expect } from 'vitest';
import { sanitizeFilename, resolveCollisions, resolveFilenameCollision } from './sanitize';
import type { AssetEntry } from './types';

describe('sanitizeFilename', () => {
  it('converts slashes and spaces to hyphens', () => {
    expect(sanitizeFilename('Icon / Arrow Right')).toBe('icon-arrow-right');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeFilename('  My Button  ')).toBe('my-button');
  });

  it('strips special characters including @ and .', () => {
    expect(sanitizeFilename('Logo@2x.png')).toBe('logo2xpng');
  });

  it('collapses and trims hyphens', () => {
    expect(sanitizeFilename('---triple---dash---')).toBe('triple-dash');
  });

  it('falls back to "unnamed" for empty string', () => {
    expect(sanitizeFilename('')).toBe('unnamed');
  });

  it('converts uppercase to lowercase', () => {
    expect(sanitizeFilename('UPPERCASE')).toBe('uppercase');
  });

  it('converts nested slashes to hyphens', () => {
    expect(sanitizeFilename('a/b/c')).toBe('a-b-c');
  });

  it('handles string that becomes empty after sanitization', () => {
    expect(sanitizeFilename('/@#$%')).toBe('unnamed');
  });

  it('handles single character names', () => {
    expect(sanitizeFilename('X')).toBe('x');
  });

  it('preserves numbers', () => {
    expect(sanitizeFilename('icon-24px')).toBe('icon-24px');
  });
});

describe('resolveCollisions', () => {
  function makeEntry(filename: string): AssetEntry {
    return {
      nodeId: '1:' + Math.random().toString(36).slice(2, 6),
      nodeName: 'node',
      exportType: 'svg',
      filename,
    };
  }

  it('does not modify array with no collisions', () => {
    const entries = [makeEntry('icon-a.svg'), makeEntry('icon-b.svg')];
    const result = resolveCollisions(entries);
    expect(result.map((e) => e.filename)).toEqual(['icon-a.svg', 'icon-b.svg']);
  });

  it('appends -2 suffix for first collision', () => {
    const entries = [makeEntry('icon.svg'), makeEntry('icon.svg')];
    const result = resolveCollisions(entries);
    expect(result.map((e) => e.filename)).toEqual(['icon.svg', 'icon-2.svg']);
  });

  it('appends -2, -3 suffixes for multiple collisions', () => {
    const entries = [
      makeEntry('button.svg'),
      makeEntry('button.svg'),
      makeEntry('button.svg'),
    ];
    const result = resolveCollisions(entries);
    expect(result.map((e) => e.filename)).toEqual([
      'button.svg',
      'button-2.svg',
      'button-3.svg',
    ]);
  });

  it('does not mutate the input array', () => {
    const entries = [makeEntry('icon.svg'), makeEntry('icon.svg')];
    const original = entries.map((e) => e.filename);
    resolveCollisions(entries);
    expect(entries.map((e) => e.filename)).toEqual(original);
  });

  it('handles collisions across different extensions', () => {
    const entries = [makeEntry('logo.svg'), makeEntry('logo.png')];
    const result = resolveCollisions(entries);
    // Different extensions = no collision
    expect(result.map((e) => e.filename)).toEqual(['logo.svg', 'logo.png']);
  });
});

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
