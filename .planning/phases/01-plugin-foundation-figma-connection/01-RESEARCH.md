# Phase 1: Plugin Foundation & Figma Connection - Research

**Researched:** 2026-02-28
**Domain:** Ship Studio plugin scaffolding, Figma REST API authentication, URL parsing
**Confidence:** HIGH

## Summary

This phase builds the working foundation for the Figma design extraction plugin. The core work is: (1) clone the plugin-starter template and configure it as the Figma plugin, (2) implement PAT-based authentication against the Figma REST API, (3) build a URL parser that handles all Figma URL formats, and (4) wire up a minimal API client using the `shell.exec` + `curl` pattern established by other Ship Studio plugins.

The technical risk is low. Every pattern needed (toolbar button, modal, shell-based HTTP, plugin storage, CSS injection, theme integration) is demonstrated in the plugin-starter template and battle-tested in production plugins like plugin-client-editor and plugin-memberstack. The Figma REST API is well-documented, the authentication is a single header, and URL parsing is a solved regex problem. The main pitfall is getting the `shell.exec('curl', [...args])` signature right (it takes command + args array, not a single string).

**Primary recommendation:** Start from the plugin-starter template files, split into a multi-file structure matching plugin-memberstack's pattern (separate files for context, types, styles, API client, and views), and build the URL parser as a pure function with comprehensive regex coverage for all Figma URL formats.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Clone/fork the ship-studio/plugin-starter template as the starting point
- Update plugin.json with Figma plugin identity (id, name, description, icon)
- Keep the existing Vite + TypeScript + React build setup from the starter
- Use `@figma/rest-api-spec` (dev dependency) for Figma API TypeScript types
- All HTTP requests via `shell.exec` + `curl` — no fetch/axios (Ship Studio constraint)
- Keep it simple: minimal UI focused on the core workflow
- Primary view: URL input + scope selection + extract button
- Settings accessible via gear icon or separate settings view (token management)
- First-time users see token setup before anything else (if no token stored)
- On first open (no stored token): show a setup view with a text field for the PAT
- Include a brief instruction/link explaining how to generate a Figma PAT
- Validate token immediately on entry via `GET /v1/me` endpoint
- Show success/failure feedback inline — green checkmark or red error message
- Store validated token via Ship Studio plugin storage
- Settings view allows updating or removing the token at any time
- Single text input for pasting Figma URLs
- Plugin auto-parses file key and node ID from the URL
- Support all URL formats: `/file/`, `/design/`, `/proto/`, `/board/`
- Handle node-id query parameter (URL-encoded, `-` to `:` conversion)
- After URL parsing: validate file accessibility with a lightweight API call
- Scope selection: radio buttons or dropdown — single node (from URL), frame, or page
- If URL contains a node-id, default scope to "single node"
- If URL is file-level (no node-id), default scope to "page" or show available frames
- Thin wrapper around `shell.exec` + `curl` for Figma REST API calls
- Pass `X-Figma-Token` header for authentication
- Handle rate limits: detect 429 responses, respect `Retry-After` header
- 120-second timeout per shell command (Ship Studio default, configurable)
- JSON response parsing with error handling for malformed responses
- Batch image requests where possible (Figma rate limits are strict)

### Claude's Discretion
- Exact modal dimensions and spacing
- Whether settings is a separate view or a collapsible section
- Loading state animations during API validation
- Exact error message copy
- How to display parsed URL information (file name, node path) back to the user
- Whether to show a "recent URLs" history

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can enter their Figma personal access token in the plugin settings | Plugin storage API (`storage.read()` / `storage.write()`) for persistence; text input in setup/settings view; pattern established in plugin-client-editor `auth.ts` |
| AUTH-02 | Plugin validates the token against the Figma API (`/v1/me`) on entry | `curl -sS -H "X-Figma-Token: {token}" https://api.figma.com/v1/me` via `shell.exec`; returns `{ id, handle, img_url, email }` on success or `{ status: 403, err: "Invalid token" }` on failure |
| AUTH-03 | Plugin persists the token via Ship Studio plugin storage (survives sessions) | `storage.write({ figmaToken: token })` persists per-plugin per-project; `storage.read()` on mount to restore; async operation requires loading state guard |
| AUTH-04 | User can update or remove their stored token | Settings view with current token status, update field, and remove button; `storage.write()` with updated or deleted token key |
| INPT-01 | User can paste a Figma URL (file, frame, or component link) | Single text input in main view; auto-parse on paste/change; support `figma.com/(file\|design\|proto\|board)/{fileKey}/{name}` patterns |
| INPT-02 | Plugin parses file key and node ID from Figma URLs | Regex pattern covering `/file/`, `/design/`, `/proto/`, `/board/` URL types; file key is 22+ alphanumeric chars; node-id from query param with `-` to `:` conversion and `decodeURIComponent` |
| INPT-03 | User can choose extraction scope: single node, frame, or entire page | Radio buttons or segmented control; default based on URL content (node-id present = single node, no node-id = page); stored as state for future phases to consume |
| INPT-04 | Plugin validates that the URL points to an accessible Figma file before extraction | Lightweight API call: `GET /v1/files/{fileKey}?depth=1` returns file metadata (name, pages) without full tree; 403 = no access, 404 = not found |
| PLUI-01 | Plugin renders a toolbar button that opens the main plugin modal | Direct from plugin-starter template: `toolbar-icon-btn` class, SVG icon, `useState` for modal toggle; Figma-themed icon (e.g., Figma logo or design icon) |
| PLUI-02 | Plugin uses Ship Studio's theme system for consistent styling | CSS variables (`--bg-primary`, `--text-primary`, etc.) in injected styles + `useTheme()` for inline styles; host classes (`toolbar-icon-btn`, `btn-primary`, `btn-secondary`); pattern demonstrated in all existing plugins |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.0.0 | UI framework | Provided by Ship Studio host via `window.__SHIPSTUDIO_REACT__`; not bundled, shared instance |
| TypeScript | ^5.6.0 | Type safety | From plugin-starter template; strict mode enabled |
| Vite | ^6.0.0 | Build tool | From plugin-starter template; ES module output with React externalization via data: URLs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@figma/rest-api-spec` | latest | Figma API TypeScript types | Dev dependency only; import `GetFileResponse`, `GetFileNodesResponse`, `User` types for type-safe API responses |
| `@types/react` | ^19.0.0 | React type definitions | Dev dependency; from plugin-starter |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@figma/rest-api-spec` | Hand-written Figma types | Official types stay current with API changes; hand-written types drift |
| `curl` via `shell.exec` | `fetch` / `axios` | Ship Studio constraint: no direct network access from plugin code; `shell.exec` + `curl` is the only supported HTTP path |

**Installation:**
```bash
npm install -D @figma/rest-api-spec @types/react typescript vite
```

Note: React itself is NOT installed as a dependency. It comes from the Ship Studio host. The Vite config externalizes React imports to `window.__SHIPSTUDIO_REACT__`.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── index.tsx           # Module exports (name, slots, onActivate/Deactivate), top-level ToolbarButton
├── context.ts          # usePluginContext() + convenience hooks (useShell, useTheme, etc.)
├── types.ts            # PluginContextValue interface + plugin-specific types (FigmaUrlParts, etc.)
├── styles.ts           # STYLE_ID + CSS string constant for injection
├── figma-api.ts        # Figma REST API client wrapper (curl-based)
├── url-parser.ts       # parseFigmaUrl() pure function
├── views/
│   ├── SetupView.tsx   # First-time token entry
│   ├── MainView.tsx    # URL input + scope selection + extract button
│   └── SettingsView.tsx # Token management (update/remove)
└── components/
    └── Modal.tsx        # Reusable modal shell (overlay, header, body, escape-to-close)
```

This structure follows the pattern established by plugin-memberstack (separate files for context, types, styles, hooks, and views) while keeping the codebase navigable.

### Pattern 1: Shell-based curl API Client
**What:** A typed wrapper around `shell.exec('curl', [...args])` that handles the `X-Figma-Token` header, JSON parsing, error detection, and rate-limit retries.
**When to use:** Every Figma API call.
**Example:**
```typescript
// Source: Adapted from plugin-client-editor/src/api.ts (verified pattern)
import type { Shell } from './types';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

interface FigmaApiError {
  status: number;
  err: string;
}

export async function figmaApiCall<T>(
  shell: Shell,
  endpoint: string,
  token: string,
  options?: { timeout?: number }
): Promise<T> {
  const url = `${FIGMA_API_BASE}${endpoint}`;
  const args = [
    '-sS',                          // silent but show errors
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
      // Rate limited — could retry, but for Phase 1 just surface the error
      throw new Error(`Rate limited by Figma API. Try again in a moment.`);
    }
    throw new Error(`Figma API error: ${data.err}`);
  }

  return data;
}
```

**Critical implementation note:** `shell.exec` takes `(command: string, args: string[])` — NOT a single concatenated string. The architecture research example incorrectly shows `shell.exec(\`curl -s -H ...\`)`. The correct signature is `shell.exec('curl', ['-sS', '-H', 'X-Figma-Token: ...', url])`. See plugin-client-editor `api.ts` for the verified pattern.

### Pattern 2: Figma URL Parser (Pure Function)
**What:** A pure function that extracts file key and node IDs from any Figma URL format.
**When to use:** When user pastes a URL.
**Example:**
```typescript
// Source: Verified against Figma URL structure (developers.figma.com + community patterns)

export interface FigmaUrlParts {
  fileKey: string;
  nodeId: string | null;     // colon-separated (e.g., "0:1"), null if not in URL
  fileType: 'file' | 'design' | 'proto' | 'board';
}

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
```

### Pattern 3: Plugin Storage for Token Management
**What:** Async storage read/write with loading state guards.
**When to use:** Persisting and retrieving the Figma PAT.
**Example:**
```typescript
// Source: Verified from plugin-starter CLAUDE.md + plugin-memberstack patterns

// Reading stored token on component mount
const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  storage.read().then((data) => {
    setToken(typeof data.figmaToken === 'string' ? data.figmaToken : null);
    setLoading(false);
  });
}, []);

// Guard renders while loading
if (loading) return <span>Loading...</span>;

// Saving token
await storage.write({ figmaToken: validatedToken });

// Removing token
const stored = await storage.read();
delete stored.figmaToken;
await storage.write(stored);
```

### Pattern 4: CSS Injection with Theme Variables
**What:** Injecting plugin-specific CSS that uses Ship Studio theme variables.
**When to use:** All custom styling beyond host CSS classes.
**Example:**
```typescript
// Source: Verified from plugin-memberstack/src/styles.ts

export const STYLE_ID = 'figma-plugin-styles';

export const PLUGIN_CSS = `
.figma-plugin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.figma-plugin-modal {
  width: 480px;
  max-height: 80vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
/* ... more rules using var(--bg-secondary), var(--text-muted), etc. */
`;
```

### Pattern 5: Token Validation via GET /v1/me
**What:** Validate the personal access token by calling the Figma `/v1/me` endpoint.
**When to use:** Immediately after user enters a token; returns user info on success, error on failure.
**Example:**
```typescript
// Source: Figma REST API docs (developers.figma.com/docs/rest-api/authentication/)

interface FigmaUser {
  id: string;
  handle: string;
  img_url: string;
  email?: string;  // Only present on /v1/me
}

async function validateToken(shell: Shell, token: string): Promise<FigmaUser> {
  return figmaApiCall<FigmaUser>(shell, '/me', token);
}

// Usage in component:
const [validating, setValidating] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleTokenSubmit(token: string) {
  setValidating(true);
  setError(null);
  try {
    const user = await validateToken(shell, token);
    await storage.write({ figmaToken: token, figmaUser: user.handle });
    showToast(`Connected as ${user.handle}`, 'success');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Invalid token');
  } finally {
    setValidating(false);
  }
}
```

### Pattern 6: File Accessibility Validation
**What:** After URL parsing, make a lightweight API call to confirm the file exists and is accessible.
**When to use:** After user pastes a URL, before proceeding to extraction.
**Example:**
```typescript
// Source: Figma REST API docs (developers.figma.com/docs/rest-api/file-endpoints/)

// Use depth=1 to get just the file name and page list without the full tree
async function validateFileAccess(
  shell: Shell,
  token: string,
  fileKey: string
): Promise<{ name: string; pages: string[] }> {
  const response = await figmaApiCall<{
    name: string;
    document: { children: Array<{ id: string; name: string; type: string }> };
  }>(shell, `/files/${fileKey}?depth=1`, token);

  return {
    name: response.name,
    pages: response.document.children
      .filter((c) => c.type === 'CANVAS')
      .map((c) => c.name),
  };
}
```

### Anti-Patterns to Avoid
- **Single concatenated shell command:** `shell.exec(\`curl -s -H "X-Figma-Token: ${token}" ...\`)` is WRONG. Use `shell.exec('curl', ['-sS', '-H', \`X-Figma-Token: ${token}\`, url])` with separate command and args array.
- **Bundling React:** Never `npm install react`. React comes from the host app via `window.__SHIPSTUDIO_REACT__`. Installing a separate copy breaks hooks.
- **Forgetting async storage loading:** `storage.read()` is async. Render a loading state until it resolves. Don't assume token is available on first render.
- **Token in error messages or logs:** Never include the PAT value in error messages, console output, or the design brief. It grants full read access to all the user's Figma files.
- **Hardcoding only `/file/` URL format:** Figma changed URLs in May 2024. Must support `/design/`, `/board/`, `/proto/` as well as legacy `/file/`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Figma API TypeScript types | Manual interfaces for GetFileResponse, Node types, etc. | `@figma/rest-api-spec` | Official Figma package; 30+ node types with complex property unions; stays current with API changes |
| React context bridging | Custom window global access | `usePluginContext()` pattern from plugin-starter | Already solves the shared React instance problem; tested in production |
| CSS theming | Custom color tokens | Ship Studio CSS variables (`var(--bg-primary)`, etc.) and host classes (`btn-primary`, `toolbar-icon-btn`) | Theme-aware out of the box; zero maintenance |
| HTTP client | fetch/axios wrapper | `shell.exec('curl', [...args])` pattern | Ship Studio constraint; no direct network from plugins |

**Key insight:** This plugin sits inside an existing host application (Ship Studio) with established patterns. Every existing plugin follows the same architecture. Deviating from these patterns will cause integration failures and maintenance burden. Follow the starter template and existing plugin patterns exactly.

## Common Pitfalls

### Pitfall 1: shell.exec Signature Mismatch
**What goes wrong:** Calling `shell.exec('curl -s -H "X-Figma-Token: ..." URL')` as a single string instead of `shell.exec('curl', ['-s', '-H', 'X-Figma-Token: ...', url])`.
**Why it happens:** The architecture research examples show the incorrect single-string pattern. Other code examples online use the `child_process.exec` single-string pattern.
**How to avoid:** Always use `shell.exec(command, argsArray)` format. Reference plugin-client-editor `api.ts` for the correct pattern.
**Warning signs:** Shell commands silently fail or produce "command not found" errors.

### Pitfall 2: Figma Node ID Format Confusion
**What goes wrong:** Sending URL-format node IDs (e.g., `0-1`) to the Figma API instead of colon-format (e.g., `0:1`).
**Why it happens:** Figma URLs encode colons as dashes (or `%3A`) in the `node-id` query parameter. The API expects colons.
**How to avoid:** Always `decodeURIComponent()` first, then replace remaining `-` with `:` in the node ID. Validate the result matches pattern `\d+:\d+`.
**Warning signs:** "Node not found" API errors despite the URL being valid.

### Pitfall 3: Forgetting to Commit dist/index.js
**What goes wrong:** Plugin works in local dev but fails when installed by others ("Plugin bundle not found" error).
**Why it happens:** Ship Studio clones repos as-is without running build steps. If `dist/index.js` is missing or stale, the plugin won't load.
**How to avoid:** Run `npm run build` before every commit. Never add `dist/` to `.gitignore`.
**Warning signs:** Plugin works locally but not after fresh clone.

### Pitfall 4: Storage is Per-Project, Not Global
**What goes wrong:** User enters their Figma token in one project, opens another project, and the token is gone.
**Why it happens:** Ship Studio plugin storage is scoped per-plugin per-project. There is no global storage API.
**How to avoid:** This is a known limitation. Accept that users may need to re-enter their token when switching projects. Consider storing the token in a file under the user's home directory (like plugin-client-editor does with `~/.shipstudio/plugins/...`) for cross-project persistence. However, this adds complexity and the CONTEXT.md specifies "Store validated token via Ship Studio plugin storage" — so for Phase 1, accept the per-project scoping.
**Warning signs:** User confusion when token "disappears" after switching projects.

### Pitfall 5: Missing PAT Scopes
**What goes wrong:** Token validation succeeds (`/v1/me` works) but file fetching fails with 403.
**Why it happens:** Figma PATs now support scopes. A token generated without `file_content:read` scope cannot access file endpoints, even though `/v1/me` (which requires `current_user:read`) works fine.
**How to avoid:** In the PAT setup instructions, tell users to enable "File content" read scope (or use "All scopes" for simplicity). The `GET /v1/files/:key/nodes` endpoint is Tier 1 and requires `file_content:read` scope.
**Warning signs:** Token validates successfully but file access returns 403.

### Pitfall 6: 10-Second Plugin Load Timeout
**What goes wrong:** Plugin fails to load because heavy work runs at module scope.
**Why it happens:** Ship Studio enforces a 10-second timeout for plugin module loading. If top-level code blocks (e.g., immediate API calls, large computations), the plugin times out.
**How to avoid:** Keep `onActivate()` fast and lightweight. Defer all data loading to React `useEffect` hooks inside components. Never fetch data at module scope.
**Warning signs:** "Plugin load timeout" error in Ship Studio console.

### Pitfall 7: Figma API Rate Limiting
**What goes wrong:** Rapid successive requests (e.g., validate token, then immediately fetch file) trigger 429 responses.
**Why it happens:** Figma uses a leaky bucket rate limiter. Tier 1 endpoints (file endpoints) allow only 10-20 requests/minute depending on plan. Tier 3 (user endpoints) allows 50-150 requests/minute.
**How to avoid:** For Phase 1, rate limiting is unlikely since we make very few calls (1 for token validation, 1 for file validation). But the API client should detect 429 responses and surface a user-friendly message. Full retry logic with `Retry-After` header can be added in later phases when extraction makes more calls.
**Warning signs:** Intermittent 429 responses, especially during development when testing rapidly.

## Code Examples

Verified patterns from official sources and existing plugins:

### curl-based API Call (Correct shell.exec Signature)
```typescript
// Source: plugin-client-editor/src/api.ts (production code)
const result = await shell.exec('curl', [
  '-sS',                            // silent + show errors
  '-H', `X-Figma-Token: ${token}`,  // auth header
  `https://api.figma.com/v1/me`,    // endpoint URL
]);

if (result.exit_code !== 0) {
  throw new Error(`Request failed: ${result.stderr || `exit ${result.exit_code}`}`);
}

const data = JSON.parse(result.stdout);
```

### Plugin Module Exports
```typescript
// Source: plugin-starter/src/index.tsx (template)
export const name = 'Figma';

export const slots = {
  toolbar: FigmaToolbarButton,
};

export function onActivate() {
  console.log('[figma] Plugin activated');
}

export function onDeactivate() {
  console.log('[figma] Plugin deactivated');
}
```

### Storage Read/Write with Loading Guard
```typescript
// Source: plugin-starter CLAUDE.md patterns + plugin-memberstack
const storage = usePluginStorage();
const [token, setToken] = useState<string | null>(null);
const [loaded, setLoaded] = useState(false);

useEffect(() => {
  storage.read().then((data) => {
    setToken(typeof data.figmaToken === 'string' ? data.figmaToken : null);
    setLoaded(true);
  });
}, []);

if (!loaded) return <div>Loading...</div>;

// If no token, show setup view; otherwise show main view
if (!token) return <SetupView onTokenSaved={setToken} />;
return <MainView token={token} />;
```

### Figma URL Parsing (All Formats)
```typescript
// Source: Figma developer docs + community patterns + figma.com URL structure research

// Test cases the parser MUST handle:
// 1. https://www.figma.com/file/ABC123/My-Design
// 2. https://www.figma.com/design/ABC123/My-Design
// 3. https://www.figma.com/design/ABC123/My-Design?node-id=0-1
// 4. https://www.figma.com/design/ABC123/My-Design?node-id=0%3A1
// 5. https://www.figma.com/proto/ABC123/My-Prototype
// 6. https://www.figma.com/board/ABC123/My-FigJam
// 7. https://figma.com/design/ABC123/Name (no www)
// 8. https://www.figma.com/design/ABC123/Name?node-id=123-456&t=xxx (extra params)
// 9. https://www.figma.com/design/ABC123/Name?m=dev&node-id=0-1 (Dev Mode URL)
```

### Toolbar Button with Figma Icon
```typescript
// Source: plugin-starter/src/index.tsx pattern
<button
  onClick={() => setModalOpen(true)}
  title="Figma Design Brief"
  className="toolbar-icon-btn"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Figma-appropriate icon paths */}
  </svg>
</button>
```

### Error Response Handling
```typescript
// Source: Figma REST API error format (verified from forum reports and docs)

// Success: { id: "...", handle: "...", email: "...", img_url: "..." }
// Auth failure: { status: 403, err: "Invalid token" }
// Not found: { status: 404, err: "Not found" }
// Rate limited: { status: 429, err: "Rate limited" }
// (429 also includes Retry-After response header)

function handleFigmaError(data: { status?: number; err?: string }): never {
  if (data.status === 403) throw new Error('Invalid or expired token. Please update your Figma token.');
  if (data.status === 404) throw new Error('File not found. Check that the URL is correct and you have access.');
  if (data.status === 429) throw new Error('Rate limited by Figma. Please wait a moment and try again.');
  throw new Error(data.err || 'Unknown Figma API error');
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `/file/` URLs only | `/design/`, `/board/`, `/proto/`, `/file/` URL types | May 2024 | URL parser must handle all types; `/file/` redirects to `/design/` but users may paste either format |
| PATs without scopes | PATs with configurable scopes and expiration | 2023 | Users must enable correct scopes (`file_content:read`, `current_user:read`) when generating tokens |
| No official TypeScript types | `@figma/rest-api-spec` (OpenAPI-generated) | 2023 | Use official types instead of hand-writing interfaces; types prefixed by operation ID (e.g., `GetFileResponse`) |

**Deprecated/outdated:**
- `figma-api` npm package: Community package that wraps the Figma API with its own HTTP client. Not suitable here because we cannot use fetch/axios; all HTTP must go through `shell.exec` + `curl`. Use `@figma/rest-api-spec` for types only.
- Single-string `shell.exec` calls: The architecture research document shows `shell.exec(\`curl ...\`)` as a single string. This is incorrect for the Ship Studio API. Always use `shell.exec('curl', [...args])`.

## Open Questions

1. **PAT scope guidance in UI**
   - What we know: Figma PATs require specific scopes (`file_content:read` for file access, `current_user:read` for `/v1/me`). Token validation via `/v1/me` may succeed even if file scopes are missing.
   - What's unclear: Whether to recommend "All scopes" for simplicity or list specific required scopes.
   - Recommendation: Tell users to enable at minimum "File content (Read)" scope. Show a help link to `https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens`. If `/v1/me` succeeds but file access fails, show a specific "missing scopes" error message.

2. **Cross-project token persistence**
   - What we know: Plugin storage is per-project. Users must re-enter their token for each new project.
   - What's unclear: Whether this UX friction is acceptable.
   - Recommendation: Accept per-project storage for Phase 1 (locked decision). Consider home-directory file storage as a future enhancement if users report friction.

3. **Rate limit handling depth in Phase 1**
   - What we know: Phase 1 makes only 2-3 API calls total (token validation + file validation). Rate limiting is very unlikely.
   - What's unclear: How much retry infrastructure to build now vs. later phases that make many more calls.
   - Recommendation: Detect 429 and surface the error with a user-friendly message. Don't build automatic retry with backoff until Phase 2+ when extraction makes more calls.

## Sources

### Primary (HIGH confidence)
- [Figma REST API Authentication](https://developers.figma.com/docs/rest-api/authentication/) - PAT header format (`X-Figma-Token`), token generation
- [Figma REST API File Endpoints](https://developers.figma.com/docs/rest-api/file-endpoints/) - `GET /v1/files/:key`, `GET /v1/files/:key/nodes`, query parameters
- [Figma REST API Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits/) - Tier system, 429 handling, `Retry-After` header, leaky bucket algorithm
- [Figma REST API Users Endpoints](https://developers.figma.com/docs/rest-api/users-endpoints/) - `GET /v1/me` endpoint, User type, Tier 3 rate limit
- [@figma/rest-api-spec GitHub](https://github.com/figma/rest-api-spec) - Official TypeScript types, OpenAPI spec, operation ID naming convention
- Ship Studio plugin-starter template (local) - Complete plugin scaffold with all host API patterns
- Ship Studio plugin-client-editor `api.ts` (local) - Production curl-based API client pattern
- Ship Studio plugin-memberstack (local) - Multi-file plugin structure, storage patterns, CSS injection

### Secondary (MEDIUM confidence)
- [Figma URL regex patterns (Latenode community)](https://community.latenode.com/t/validate-figma-url-and-extract-file-node-ids-using-regex/20893) - Regex patterns verified against Figma URL structure
- [Figma URL format change (Figma Forum)](https://forum.figma.com/ask-the-community-7/any-update-figma-to-url-structure-6003) - May 2024 `/design/` URL migration confirmed
- [Figma PAT management (Figma Help)](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens) - Token creation flow, scope configuration

### Tertiary (LOW confidence)
- [Figma 403 error format (Figma Forum)](https://forum.figma.com/ask-the-community-7/rest-api-access-token-returning-status-403-err-invalid-token-7928) - Error response JSON structure `{ status, err }` — confirmed by multiple users but not in official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Plugin-starter template is the literal starting point; Figma API types are official
- Architecture: HIGH - Multi-file structure proven in production Ship Studio plugins; API client pattern verified from working code
- Pitfalls: HIGH - Most pitfalls identified from actual code review (shell.exec signature, storage scoping) and official docs (rate limits, scopes)

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable domain — Figma REST API and Ship Studio plugin API both mature)
