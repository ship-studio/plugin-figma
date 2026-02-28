export interface Shell {
  exec(command: string, args: string[], options?: { timeout?: number }): Promise<{
    exit_code: number;
    stdout: string;
    stderr: string;
  }>;
}

export interface Storage {
  read(): Promise<Record<string, unknown>>;
  write(data: Record<string, unknown>): Promise<void>;
}

export interface PluginActions {
  showToast(message: string, type?: 'info' | 'success' | 'error'): void;
}

export interface PluginContextValue {
  project: { path: string; name: string };
  shell: Shell;
  storage: Storage;
  theme: { mode: 'light' | 'dark' };
  actions: PluginActions;
}

export interface FigmaUrlParts {
  fileKey: string;
  nodeId: string | null;
  fileType: 'file' | 'design' | 'proto' | 'board';
}

export type ExtractionScope = 'node' | 'frame' | 'page';

export interface FigmaUser {
  id: string;
  handle: string;
  img_url: string;
  email?: string;
}

export interface FigmaFileInfo {
  name: string;
  pages: Array<{ id: string; name: string }>;
}
