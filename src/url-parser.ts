import type { FigmaUrlParts } from './types';

/**
 * Parse a Figma URL into its constituent parts.
 *
 * Supported formats:
 * - https://www.figma.com/file/{key}/{name}
 * - https://www.figma.com/design/{key}/{name}
 * - https://www.figma.com/proto/{key}/{name}
 * - https://www.figma.com/board/{key}/{name}
 * - All of the above with ?node-id={id} query parameter
 * - Node IDs may be URL-encoded: "0-1" or "0%3A1" both map to "0:1"
 */
export function parseFigmaUrl(url: string): FigmaUrlParts | null {
  // Match: figma.com/(file|design|proto|board)/{fileKey}/{optional-name}
  const urlMatch = url.match(
    /figma\.com\/(file|design|proto|board)\/([A-Za-z0-9]+)/
  );
  if (!urlMatch) return null;

  const fileType = urlMatch[1] as FigmaUrlParts['fileType'];
  const fileKey = urlMatch[2];

  // Extract node-id from query string
  let nodeId: string | null = null;
  const nodeIdMatch = url.match(/[?&]node-id=([^&]+)/);
  if (nodeIdMatch) {
    // Decode URL encoding (%3A -> :) and convert dashes to colons (0-1 -> 0:1)
    nodeId = decodeURIComponent(nodeIdMatch[1]).replace(/-/g, ':');
  }

  return { fileKey, nodeId, fileType };
}
