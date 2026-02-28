import { describe, it, expect } from 'vitest';
import { parseFigmaUrl } from './url-parser';

describe('parseFigmaUrl', () => {
  it('parses /file/ URLs', () => {
    const result = parseFigmaUrl('https://www.figma.com/file/ABC123/My-Design');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: null, fileType: 'file' });
  });

  it('parses /design/ URLs', () => {
    const result = parseFigmaUrl('https://www.figma.com/design/ABC123/My-Design');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: null, fileType: 'design' });
  });

  it('parses /design/ URLs with node-id using dash format', () => {
    const result = parseFigmaUrl('https://www.figma.com/design/ABC123/My-Design?node-id=0-1');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: '0:1', fileType: 'design' });
  });

  it('parses /design/ URLs with node-id using URL-encoded colon', () => {
    const result = parseFigmaUrl('https://www.figma.com/design/ABC123/My-Design?node-id=0%3A1');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: '0:1', fileType: 'design' });
  });

  it('parses /proto/ URLs', () => {
    const result = parseFigmaUrl('https://www.figma.com/proto/ABC123/My-Prototype');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: null, fileType: 'proto' });
  });

  it('parses /board/ URLs', () => {
    const result = parseFigmaUrl('https://www.figma.com/board/ABC123/My-FigJam');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: null, fileType: 'board' });
  });

  it('parses URLs without www prefix', () => {
    const result = parseFigmaUrl('https://figma.com/design/ABC123/Name');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: null, fileType: 'design' });
  });

  it('parses Dev Mode URLs with extra params before node-id', () => {
    const result = parseFigmaUrl('https://www.figma.com/design/ABC123/Name?m=dev&node-id=0-1');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: '0:1', fileType: 'design' });
  });

  it('parses multi-digit node IDs with extra params after', () => {
    const result = parseFigmaUrl('https://www.figma.com/design/ABC123/Name?node-id=123-456&t=xxx');
    expect(result).toEqual({ fileKey: 'ABC123', nodeId: '123:456', fileType: 'design' });
  });

  it('returns null for non-Figma URLs', () => {
    const result = parseFigmaUrl('not a figma url');
    expect(result).toBeNull();
  });

  it('returns null for other domains with similar path structure', () => {
    const result = parseFigmaUrl('https://www.google.com/file/ABC123/test');
    expect(result).toBeNull();
  });
});
