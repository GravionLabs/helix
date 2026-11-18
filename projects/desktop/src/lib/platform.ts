/** The platform an app runs on (ADR 0005): decides the shell, not the viewport width. */
export type HxPlatform = 'desktop' | 'mobile' | 'web';

const PLATFORMS: readonly HxPlatform[] = ['desktop', 'mobile', 'web'];

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
