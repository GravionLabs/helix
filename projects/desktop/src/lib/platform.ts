/** The operating system a Tauri app runs on, or `web` outside Tauri. */
export type HxOs = 'macos' | 'windows' | 'linux' | 'ios' | 'android' | 'web';

/**
 * The platform an app runs on (ADR 0005): decides the shell, not the viewport width. `data-platform`
 * holds an {@link HxOs} (set by `providePlatform()` of the tauri entry) or the coarse `desktop` / `mobile`.
 */
export type HxPlatform = 'desktop' | 'mobile' | HxOs;

const PLATFORMS: readonly HxPlatform[] = [
  'desktop',
  'mobile',
  'macos',
  'windows',
  'linux',
  'ios',
  'android',
  'web',
];

/** The shell kind of a platform: `mobile` for ios, android and mobile, `web` for web, else `desktop`. */
export function getHxPlatformKind(platform: HxPlatform): 'desktop' | 'mobile' | 'web' {
  if (platform === 'ios' || platform === 'android' || platform === 'mobile') return 'mobile';
  return platform === 'web' ? 'web' : 'desktop';
}

/** Read `data-platform` of the root element; `web` when it is absent or unknown. */
export function getHxPlatform(root: HTMLElement = document.documentElement): HxPlatform {
  const value = root.getAttribute('data-platform') as HxPlatform | null;
  return value && PLATFORMS.includes(value) ? value : 'web';
}

/** Set `data-platform` on the root element, before the first render. */
export function setHxPlatform(
  platform: HxPlatform,
  root: HTMLElement = document.documentElement,
): void {
  root.setAttribute('data-platform', platform);
}
