/*
 * Public API Surface of @gravionlabs/helix-desktop/tauri
 *
 * The only entry that may import `@tauri-apps/*` (`pnpm lint:no-tauri`). Those packages are optional peer
 * dependencies, so a consumer of the main entry installs none of them. Outside Tauri every service
 * resolves to a no-op.
 */

export const HELIX_DESKTOP_TAURI = true;

export * from './app-info';
export * from './platform';
export * from './status-update';
export * from './update.service';
export * from './update-backend';
