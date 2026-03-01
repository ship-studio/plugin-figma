/**
 * Brief generation types.
 *
 * These types define the input, output, and stats for the design brief
 * assembly function. The brief is the core deliverable of the plugin --
 * a structured markdown document consumed by Claude Code.
 */

import type { ExtractLayoutResult } from '../layout/extract';
import type { ExportResult } from '../assets/types';
import type { LayoutNode } from '../layout/types';

/** Input to the brief generator. */
export interface BriefInput {
  extraction: ExtractLayoutResult;
  exportResult: ExportResult;
  projectPath: string;
  fileName: string;
  figmaUrl: string;
  /** Optional date override for test determinism (YYYY-MM-DD). */
  date?: string;
  /** Root nodes for breadcrumb computation (optional; falls back to extraction.extraction.rootNodes). */
  rootNodes?: LayoutNode[];
  /** Brief mode selected by the user. Defaults to 'best'. */
  mode?: 'best' | 'pixel' | 'inspiration';
  /** User-provided context for inspiration mode. */
  inspirationText?: string;
}

/** Summary statistics for the plugin UI. */
export interface BriefStats {
  nodeCount: number;
  colorCount: number;
  fontCount: number;
  assetCount: number;
  estimatedTokens: number;
}

/** Output of the brief generator. */
export interface BriefResult {
  markdown: string;
  charCount: number;
  estimatedTokens: number;
  stats: BriefStats;
}
