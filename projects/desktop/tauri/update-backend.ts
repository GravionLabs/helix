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
  /** Download and install the update found by the last `check()`. */
  install(): Promise<void>;
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
  let pending: { downloadAndInstall(): Promise<void> } | null = null;
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
    async install() {
      if (!pending) throw new Error('No update to install');
      await pending.downloadAndInstall();
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
