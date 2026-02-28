import type { Shell, FigmaUser, FigmaFileInfo } from './types';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

interface FigmaApiError {
  status: number;
  err: string;
}

/**
 * Generic typed wrapper around shell.exec('curl', [...args]) for Figma API calls.
 * Uses -sS flag, X-Figma-Token header, 120s default timeout.
 * Parses JSON response and detects Figma error format ({ status, err }).
 */
export async function figmaApiCall<T>(
  shell: Shell,
  endpoint: string,
  token: string,
  options?: { timeout?: number }
): Promise<T> {
  const url = `${FIGMA_API_BASE}${endpoint}`;
  const args = [
    '-sS',
    '-H', `X-Figma-Token: ${token}`,
    url,
  ];

  const result = await shell.exec('curl', args, {
    timeout: options?.timeout ?? 120000,
  });

  if (result.exit_code !== 0) {
    throw new Error(`Figma API request failed: ${result.stderr || `exit code ${result.exit_code}`}`);
  }

  if (!result.stdout.trim()) {
    throw new Error('Empty response from Figma API');
  }

  let data: T & Partial<FigmaApiError>;
  try {
    data = JSON.parse(result.stdout);
  } catch {
    throw new Error(`Invalid JSON from Figma API: ${result.stdout.slice(0, 200)}`);
  }

  // Figma error responses: { status: 403, err: "Invalid token" }
  if (data.status && data.err) {
    if (data.status === 429) {
      throw new Error('Rate limited by Figma API. Try again in a moment.');
    }
    if (data.status === 403) {
      throw new Error('Invalid or expired token. Please update your Figma token.');
    }
    if (data.status === 404) {
      throw new Error('File not found. Check that the URL is correct and you have access.');
    }
    throw new Error(`Figma API error: ${data.err}`);
  }

  return data;
}

/**
 * Validate a Figma personal access token by calling GET /v1/me.
 * Returns the authenticated user's info on success.
 */
export async function validateToken(shell: Shell, token: string): Promise<FigmaUser> {
  return figmaApiCall<FigmaUser>(shell, '/me', token);
}

/**
 * Validate that a Figma file is accessible by calling GET /v1/files/{fileKey}?depth=1.
 * Returns the file name and list of pages (canvas nodes).
 */
export async function validateFileAccess(
  shell: Shell,
  token: string,
  fileKey: string
): Promise<FigmaFileInfo> {
  const response = await figmaApiCall<{
    name: string;
    document: { children: Array<{ id: string; name: string; type: string }> };
  }>(shell, `/files/${fileKey}?depth=1`, token);

  return {
    name: response.name,
    pages: response.document.children
      .filter((c) => c.type === 'CANVAS')
      .map((c) => ({ id: c.id, name: c.name })),
  };
}
