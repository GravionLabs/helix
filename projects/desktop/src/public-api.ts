/*
 * Public API Surface of @gravionlabs/helix-desktop
 *
 * The desktop frame (ADR 0005). This entry imports nothing from `@tauri-apps/*`; the Tauri bindings are in
 * the secondary entry point `@gravionlabs/helix-desktop/tauri`.
 */

export const HELIX_DESKTOP_VERSION = '0.1.0';

export * from './lib/activity-bar/activity-bar';
export * from './lib/status-bar/status-bar';
export * from './lib/status-bar/status-item';
export * from './lib/status-bar/status-version';
export * from './lib/status-bar/status-zoom';
export * from './lib/view';
