import { computed, Injectable, InjectionToken, inject, signal } from '@angular/core';
import { HX_APP_INFO } from './app-info';
import { defaultUpdateBackend, type HxUpdateBackend, type HxUpdateInfo } from './update-backend';

/** The step that failed. */
export type HxUpdateStep = 'check' | 'install' | 'relaunch';

export type HxUpdateState =
  | { readonly status: 'idle' }
  | { readonly status: 'checking' }
  | { readonly status: 'current' }
  | { readonly status: 'available'; readonly update: HxUpdateInfo }
  | {
      readonly status: 'installing';
      readonly update: HxUpdateInfo;
      /** The download progress, 0 to 100; `null` while the size is unknown. */
      readonly percent: number | null;
    }
  | { readonly status: 'error'; readonly step: HxUpdateStep; readonly message: string };

/** The backend of the update service; override it in tests. */
export const HX_UPDATE_BACKEND = new InjectionToken<HxUpdateBackend>('HX_UPDATE_BACKEND', {
  factory: () => defaultUpdateBackend(),
});

/**
 * A hook that runs after the state is `installing` and before the install, for example to save the open
 * document. When it throws, the state is `error` (step `install`) and the update stays available for a retry.
 */
export type HxUpdateBeforeInstall = (update: HxUpdateInfo) => void | Promise<void>;

/** The hook before the install; `null` (the default) means none. */
export const HX_UPDATE_BEFORE_INSTALL = new InjectionToken<HxUpdateBeforeInstall | null>(
  'HX_UPDATE_BEFORE_INSTALL',
  { factory: () => null },
);

/** How long a manual check shows "Up to date", in milliseconds. */
export const HX_UPDATE_CURRENT_MS = 3000;

/**
 * The update state machine: idle, checking, current, available, installing, error (with the failed step).
 * An RC build never checks by itself: `start()` does nothing there, `check()` still works on request.
 */
@Injectable({ providedIn: 'root' })
export class HxUpdateService {
  private readonly backend = inject(HX_UPDATE_BACKEND);
  private readonly beforeInstall = inject(HX_UPDATE_BEFORE_INSTALL);
  private readonly info = inject(HX_APP_INFO);
  private readonly _currentShown = signal(false);
  private retryUpdate: HxUpdateInfo | null = null;
  private currentTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly _state = signal<HxUpdateState>({ status: 'idle' });

  readonly state = this._state.asReadonly();
  /** True while a manual check shows its "up to date" result. */
  readonly currentShown = this._currentShown.asReadonly();
  readonly version = this.info.version;
  readonly channel = this.info.channel;
  /** The found update, while available or installing. */
  readonly update = computed(() => {
    const s = this._state();
    return s.status === 'available' || s.status === 'installing' ? s.update : null;
  });

  /** The automatic check at startup; skipped for an RC build. */
  start(): Promise<void> {
    return this.channel === 'rc' ? Promise.resolve() : this.check();
  }

  /**
   * Check for an update. With `manual: true` a result of "current" stays visible for a moment
   * (`HX_UPDATE_CURRENT_MS`), then the state goes back to `idle`.
   */
  async check(options: { readonly manual?: boolean } = {}): Promise<void> {
    const s = this._state().status;
    if (s === 'checking' || s === 'installing') return;
    clearTimeout(this.currentTimer);
    this._currentShown.set(false);
    this.retryUpdate = null;
    this._state.set({ status: 'checking' });
    try {
      const update = await this.backend.check();
      this._state.set(update ? { status: 'available', update } : { status: 'current' });
      if (!update && options.manual) {
        this._currentShown.set(true);
        this.currentTimer = setTimeout(() => {
          this._currentShown.set(false);
          if (this._state().status === 'current') this._state.set({ status: 'idle' });
        }, HX_UPDATE_CURRENT_MS);
      }
    } catch (e) {
      this.fail('check', e);
    }
  }

  /**
   * Download, install and restart. Also the retry after a failed install step: the update stays available.
   */
  async installAndRestart(): Promise<void> {
    const state = this._state();
    const update =
      state.status === 'available'
        ? state.update
        : state.status === 'error' && state.step === 'install'
          ? this.retryUpdate
          : null;
    if (!update) return;
    this.retryUpdate = update;
    this._state.set({ status: 'installing', update, percent: null });
    try {
      await this.beforeInstall?.(update);
      await this.backend.install((percent) => {
        if (this._state().status === 'installing')
          this._state.set({ status: 'installing', update, percent });
      });
    } catch (e) {
      this.fail('install', e);
      return;
    }
    try {
      await this.backend.relaunch();
    } catch (e) {
      this.fail('relaunch', e);
    }
  }

  private fail(step: HxUpdateStep, e: unknown): void {
    this._state.set({ status: 'error', step, message: e instanceof Error ? e.message : String(e) });
  }
}
