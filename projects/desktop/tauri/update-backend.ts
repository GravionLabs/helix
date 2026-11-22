/** What the updater found: a newer version. */
export interface HxUpdateInfo {
  readonly version: string;
  readonly notes: string | null;
  readonly date: string | null;
}

/**
 * The plugin calls behind an interface, so tests and web builds need no Tauri. The Tauri implementation
 * is `tauriUpdateBackend()`; outside Tauri the service uses `noopUpdateBackend`.
 */
export interface HxUpdateBackend {
  /** `null` when the app is current. */
  check(): Promise<HxUpdateInfo | null>;
  /**
   * Download and install the update found by the last `check()`. `onProgress` gets the percent (0 to 100)
   * while it downloads, or `null` when the size is unknown.
   */
  install(onProgress?: (percent: number | null) => void): Promise<void>;
  /** Restart into the new version. */
  relaunch(): Promise<void>;
}

/** The backend of a web build: never finds an update, never throws. */
export const noopUpdateBackend: HxUpdateBackend = {
  check: () => Promise.resolve(null),
  install: () => Promise.resolve(),
  relaunch: () => Promise.resolve(),
};

/** True inside a Tauri webview. */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/** The backend on `@tauri-apps/plugin-updater` and `plugin-process`, loaded on first use. */
export function tauriUpdateBackend(): HxUpdateBackend {
  let pending: {
    downloadAndInstall(
      onEvent?: (e: {
        event: 'Started' | 'Progress' | 'Finished';
        data?: { contentLength?: number; chunkLength?: number };
      }) => void,
    ): Promise<void>;
  } | null = null;
  return {
    async check() {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();
      if (!update) {
        pending = null;
        return null;
      }
      pending = update;
      return { version: update.version, notes: update.body ?? null, date: update.date ?? null };
    },
    async install(onProgress) {
      if (!pending) throw new Error('No update to install');
      let total = 0;
      let done = 0;
      await pending.downloadAndInstall((e) => {
        if (!onProgress) return;
        if (e.event === 'Started') {
          total = e.data?.contentLength ?? 0;
          done = 0;
          onProgress(total > 0 ? 0 : null);
        } else if (e.event === 'Progress') {
          done += e.data?.chunkLength ?? 0;
          onProgress(total > 0 ? Math.min(100, Math.round((done / total) * 100)) : null);
        } else {
          onProgress(total > 0 ? 100 : null);
        }
      });
    },
    async relaunch() {
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    },
  };
}

/** The backend for the current environment. */
export function defaultUpdateBackend(): HxUpdateBackend {
  return isTauri() ? tauriUpdateBackend() : noopUpdateBackend;
}
