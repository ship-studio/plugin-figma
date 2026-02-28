import type { Shell, FigmaUser, FigmaFileInfo } from './types';
import type { GetFileResponse, GetFileNodesResponse } from '@figma/rest-api-spec';

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
  const timeoutSec = Math.ceil((options?.timeout ?? 30000) / 1000);
  const args = [
    '-sS',
    '--max-time', String(timeoutSec),
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

/**
 * Fetch a specific node (and its subtree) from a Figma file.
 * Uses GET /v1/files/{fileKey}/nodes?ids={nodeId} endpoint.
 *
 * @param shell - Shell for executing curl
 * @param token - Figma personal access token
 * @param fileKey - Figma file key
 * @param nodeId - Node ID to fetch (e.g. "12:34")
 * @returns The document node and its components map
 */
export async function fetchFileNodes(
  shell: Shell,
  token: string,
  fileKey: string,
  nodeId: string,
): Promise<{ rootNode: any; components: Record<string, any>; styles: Record<string, any> }> {
  const response = await figmaApiCall<GetFileNodesResponse>(
    shell,
    `/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`,
    token,
    { timeout: 120000 },
  );

  const nodeData = response.nodes[nodeId];
  if (!nodeData) {
    // The API may URL-encode the node ID differently; check all keys
    const availableKeys = Object.keys(response.nodes);
    const match = availableKeys.find(
      (key) => key.replace(/%3A/g, ':') === nodeId || key === nodeId.replace(/:/g, '%3A'),
    );
    if (match) {
      return {
        rootNode: response.nodes[match].document,
        components: response.nodes[match].components,
        styles: response.nodes[match].styles ?? {},
      };
    }
    throw new Error(
      `Node "${nodeId}" not found in API response. Available nodes: ${availableKeys.join(', ')}`,
    );
  }

  return {
    rootNode: nodeData.document,
    components: nodeData.components,
    styles: nodeData.styles ?? {},
  };
}

/**
 * Fetch an entire Figma file (all pages and their children).
 * Uses GET /v1/files/{fileKey} endpoint.
 *
 * @param shell - Shell for executing curl
 * @param token - Figma personal access token
 * @param fileKey - Figma file key
 * @returns Root page nodes (CanvasNode[]) and components map
 */
export async function fetchFullFile(
  shell: Shell,
  token: string,
  fileKey: string,
): Promise<{ rootNodes: any[]; components: Record<string, any>; styles: Record<string, any> }> {
  const response = await figmaApiCall<GetFileResponse>(
    shell,
    `/files/${fileKey}`,
    token,
    { timeout: 120000 },
  );

  return {
    rootNodes: response.document.children,
    components: response.components,
    styles: (response as any).styles ?? {},
  };
}
