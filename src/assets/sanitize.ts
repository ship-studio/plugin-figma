/**
 * Filename sanitization and collision handling for asset export.
 *
 * Converts Figma layer names to filesystem-safe lowercase-hyphenated strings
 * and resolves duplicate filenames with numeric suffixes.
 */

import type { AssetEntry } from './types';

/**
 * Convert a Figma layer name to a filesystem-safe filename (without extension).
 *
 * Rules: lowercase, slashes and spaces become hyphens, strip non-alphanumeric
 * (except hyphens), collapse multiple hyphens, trim leading/trailing hyphens,
 * fallback to "unnamed" if empty.
 */
export function sanitizeFilename(layerName: string): string {
  const sanitized = layerName
    .toLowerCase()
    .replace(/[/\s]+/g, '-')        // slashes and whitespace become hyphens
    .replace(/[^a-z0-9-]/g, '')     // strip anything that isn't alphanumeric or hyphen
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-$/g, '');         // trim leading/trailing hyphens

  return sanitized || 'unnamed';
}

/**
 * Resolve filename collisions in an AssetEntry array by appending numeric suffixes.
 *
 * First occurrence keeps its name. Subsequent duplicates get -2, -3, etc.
 * Returns a new array (does not mutate input).
 */
export function resolveCollisions(entries: AssetEntry[]): AssetEntry[] {
  const seen = new Map<string, number>();

  return entries.map((entry) => {
    const count = seen.get(entry.filename) ?? 0;
    seen.set(entry.filename, count + 1);

    if (count === 0) {
      return { ...entry };
    }

    // Split at last dot to preserve extension
    const dotIndex = entry.filename.lastIndexOf('.');
    if (dotIndex === -1) {
      return { ...entry, filename: `${entry.filename}-${count + 1}` };
    }

    const base = entry.filename.slice(0, dotIndex);
    const ext = entry.filename.slice(dotIndex);
    return { ...entry, filename: `${base}-${count + 1}${ext}` };
  });
}

/**
 * Resolve a filename collision against a list of existing filenames.
 * If the candidate is unique, returns it as-is. Otherwise appends
 * -2, -3, etc. before the extension until a unique name is found.
 */
export function resolveFilenameCollision(
  candidateFilename: string,
  existingFilenames: string[],
): string {
  if (!existingFilenames.includes(candidateFilename)) {
    return candidateFilename;
  }
  const dotIndex = candidateFilename.lastIndexOf('.');
  const hasExtension = dotIndex !== -1;
  const base = hasExtension ? candidateFilename.slice(0, dotIndex) : candidateFilename;
  const ext = hasExtension ? candidateFilename.slice(dotIndex) : '';
  let counter = 2;
  while (existingFilenames.includes(`${base}-${counter}${ext}`)) {
    counter++;
  }
  return `${base}-${counter}${ext}`;
}
