// Stub file -- implementation in GREEN phase
import type { LayoutNode, ExtractionResult } from './types';

export function normalizeNode(_figmaNode: any, _components: Record<string, any>, _depth: number): LayoutNode | null {
  throw new Error('Not implemented');
}

export function normalizeTree(_rootNodes: any[], _components: Record<string, any>): ExtractionResult {
  throw new Error('Not implemented');
}

export function countNodes(_node: any): number {
  throw new Error('Not implemented');
}

export function deduplicateChildren(_children: LayoutNode[]): LayoutNode[] {
  throw new Error('Not implemented');
}
