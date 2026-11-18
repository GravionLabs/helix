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
  | { readonly status: 'installing'; readonly update: HxUpdateInfo }
  | { readonly status: 'error'; readonly step: HxUpdateStep; readonly message: string };

/** The backend of the update service; override it in tests. */
export const HX_UPDATE_BACKEND = new InjectionToken<HxUpdateBackend>('HX_UPDATE_BACKEND', {
  factory: () => defaultUpdateBackend(),
});

/**
 * The update state machine: idle, checking, current, available, installing, error (with the failed step).
 * An RC build never checks by itself: `start()` does nothing there, `check()` still works on request.
 */
@Injectable({ providedIn: 'root' })
export class HxUpdateService {
  private readonly backend = inject(HX_UPDATE_BACKEND);
  private readonly info = inject(HX_APP_INFO);
  private readonly _state = signal<HxUpdateState>({ status: 'idle' });

  readonly state = this._state.asReadonly();
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

  async check(): Promise<void> {
    const s = this._state().status;
    if (s === 'checking' || s === 'installing') return;
    this._state.set({ status: 'checking' });
    try {
      const update = await this.backend.check();
      this._state.set(update ? { status: 'available', update } : { status: 'current' });
    } catch (e) {
      this.fail('check', e);
    }
  }

  /** Download, install and restart. */
  async installAndRestart(): Promise<void> {
    const update = this.update();
    if (this._state().status !== 'available' || !update) return;
    this._state.set({ status: 'installing', update });
    try {
      await this.backend.install();
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
