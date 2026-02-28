/**
 * Brief generation types.
 *
 * These types define the input, output, and stats for the design brief
 * assembly function. The brief is the core deliverable of the plugin --
 * a structured markdown document consumed by Claude Code.
 */

import type { ExtractLayoutResult } from '../layout/extract';
import type { ExportResult } from '../assets/types';

/** Input to the brief generator. */
export interface BriefInput {
  extraction: ExtractLayoutResult;
  exportResult: ExportResult;
  projectPath: string;
  fileName: string;
  figmaUrl: string;
  /** Optional date override for test determinism (YYYY-MM-DD). */
  date?: string;
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
