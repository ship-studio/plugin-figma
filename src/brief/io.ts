/**
 * Brief I/O functions for file save and clipboard copy.
 *
 * Uses base64 encoding to safely pass markdown content through shell commands,
 * avoiding all metacharacter escaping issues (markdown contains quotes, backticks,
 * dollar signs, pipes, etc.).
 */

import type { Shell } from '../types';

/**
 * Save brief markdown to .shipstudio/brief.md in the project directory.
 * Uses base64 encoding to avoid shell metacharacter issues.
 */
export async function saveBrief(
  shell: Shell,
  projectPath: string,
  markdown: string,
): Promise<void> {
  const briefDir = `${projectPath}/.shipstudio`;
  const briefPath = `${briefDir}/brief.md`;

  // Ensure directory exists
  await shell.exec('mkdir', ['-p', briefDir]);

  // Encode to base64 to safely pass through shell.
  // btoa only handles Latin1, so encode UTF-8 first via encodeURIComponent + unescape.
  const encoded = btoa(unescape(encodeURIComponent(markdown)));
  const result = await shell.exec('bash', [
    '-c',
    `echo '${encoded}' | base64 -d > '${briefPath}'`,
  ]);

  if (result.exit_code !== 0) {
    throw new Error(`Failed to save brief: ${result.stderr}`);
  }
}

/**
 * Copy markdown to macOS clipboard via pbcopy.
 * Uses base64 encoding for safety.
 */
export async function copyToClipboard(
  shell: Shell,
  markdown: string,
): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(markdown)));
  const result = await shell.exec('bash', [
    '-c',
    `echo '${encoded}' | base64 -d | pbcopy`,
  ]);

  if (result.exit_code !== 0) {
    throw new Error(`Clipboard copy failed: ${result.stderr}`);
  }
}
