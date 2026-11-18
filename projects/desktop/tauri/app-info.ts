import { InjectionToken, type Provider } from '@angular/core';
import { isTauri } from './update-backend';

/** `stable`, or `rc` for a release candidate. */
export type HxChannel = 'stable' | 'rc';

export interface HxAppInfo {
  readonly version: string;
  readonly channel: HxChannel;
}

/** The app version and channel. Without `provideHxAppInfo()` it is an empty stable version. */
export const HX_APP_INFO = new InjectionToken<HxAppInfo>('HX_APP_INFO', {
  factory: () => ({ version: '', channel: 'stable' }),
});

/** `1.4.0-rc.1` is `rc`; everything else is `stable`. */
export function channelOfVersion(version: string): HxChannel {
  return /-rc(\.|\d|$)/i.test(version) ? 'rc' : 'stable';
}

/** Provide the version and, when not given, the channel derived from it. */
export function provideHxAppInfo(info: { version: string; channel?: HxChannel }): Provider {
  return {
    provide: HX_APP_INFO,
    useValue: { version: info.version, channel: info.channel ?? channelOfVersion(info.version) },
  };
}

/** Read the version from Tauri (`getVersion`); outside Tauri it resolves to `fallback`. */
export async function readTauriVersion(fallback = ''): Promise<string> {
  if (!isTauri()) return fallback;
  try {
    const { getVersion } = await import('@tauri-apps/api/app');
    return await getVersion();
  } catch {
    return fallback;
  }
}
