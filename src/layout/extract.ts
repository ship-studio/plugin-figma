/**
 * Layout extraction orchestrator.
 *
 * Bridges the Figma API (fetch) with normalization (normalize.ts) to produce
 * a complete ExtractionResult from a user's URL + scope selection.
 *
 * Flow: scope-based API call -> node counting -> large tree warning -> normalization
 */

import type { Shell, ExtractionScope } from '../types';
import type { ExtractionResult } from './types';
import type { DesignTokens } from '../tokens/types';
import { fetchFileNodes, fetchFullFile } from '../figma-api';
import { normalizeTree, countNodes } from './normalize';
import { collectTokens } from '../tokens/collect';

/** Node count above which a warning is shown to the user. */
export const WARN_THRESHOLD = 500;

/** Node count above which the extraction result is marked as truncated. */
export const MAX_THRESHOLD = 2000;

export interface ExtractLayoutOptions {
  shell: Shell;
  token: string;
  fileKey: string;
  nodeId: string | null;
  scope: ExtractionScope;
}

export interface ExtractLayoutResult {
  extraction: ExtractionResult;
  tokens: DesignTokens;
  /** Figma file key, passed through for asset export. */
  fileKey: string;
  /** Set when nodeCount exceeds WARN_THRESHOLD before normalization. */
  largeTreeWarning?: { nodeCount: number; message: string };
}

/**
 * Extract and normalize a Figma layout tree based on scope.
 *
 * 1. Fetches the appropriate API endpoint based on scope
 * 2. Counts raw nodes to detect large trees
 * 3. Normalizes through normalizeTree (from 02-01)
 * 4. Returns result with optional large-tree warning
 *
 * @throws Error if scope is node/frame but nodeId is null
 * @throws Error on API failures (propagated from figmaApiCall)
 */
export async function extractLayout(options: ExtractLayoutOptions): Promise<ExtractLayoutResult> {
  const { shell, token, fileKey, nodeId, scope } = options;

  let rootNodes: any[];
  let components: Record<string, any>;
  let styles: Record<string, any>;

  // 1. Fetch based on scope
  if (scope === 'node' || scope === 'frame') {
    if (!nodeId) {
      throw new Error(
        `Cannot extract ${scope}: no node ID found in the URL. ` +
        'Paste a Figma URL that includes a node-id, or switch to "Entire Page" scope.',
      );
    }
    const result = await fetchFileNodes(shell, token, fileKey, nodeId);
    // fetchFileNodes returns a single root node; wrap in array for normalizeTree
    rootNodes = [result.rootNode];
    components = result.components;
    styles = result.styles;
  } else {
    // scope === 'page': fetch full file, use first page's children
    const result = await fetchFullFile(shell, token, fileKey);
    // result.rootNodes are CanvasNode[] (pages). Use first page's children (frames).
    const firstPage = result.rootNodes[0];
    rootNodes = firstPage?.children || [];
    components = result.components;
    styles = result.styles;
  }

  // 2. Count raw nodes before normalization
  let rawNodeCount = 0;
  for (const node of rootNodes) {
    rawNodeCount += countNodes(node);
  }

  // 3. Determine large tree warning
  let largeTreeWarning: ExtractLayoutResult['largeTreeWarning'];
  if (rawNodeCount > WARN_THRESHOLD) {
    largeTreeWarning = {
      nodeCount: rawNodeCount,
      message:
        `This selection has ~${rawNodeCount} nodes. ` +
        'Large extractions may produce verbose output.',
    };
  }

  // 4. Normalize the tree
  const extraction = normalizeTree(rootNodes, components);

  // Mark as truncated if exceeding MAX_THRESHOLD
  if (rawNodeCount > MAX_THRESHOLD) {
    extraction.truncated = true;
  }

  // 5. Collect design tokens from the normalized tree
  const tokens = collectTokens(extraction.rootNodes, styles);

  return { extraction, tokens, fileKey, largeTreeWarning };
}
