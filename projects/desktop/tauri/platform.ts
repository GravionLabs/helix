import { DOCUMENT } from '@angular/common';
import { type EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { type HxOs, setHxPlatform } from '@gravionlabs/helix-desktop';
import { isTauri } from './update-backend';

/** Detect the operating system from the user agent; `web` outside Tauri. */
export function detectHxOs(
  ua: string = typeof navigator === 'undefined' ? '' : navigator.userAgent,
  tauri: boolean = isTauri(),
): HxOs {
  if (!tauri) return 'web';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/windows/i.test(ua)) return 'windows';
  if (/mac/i.test(ua)) return 'macos';
  if (/linux|x11/i.test(ua)) return 'linux';
  return 'web';
}

/** Set `data-platform` on the root element at startup: macos, windows, linux, ios, android or web. */
export function providePlatform(os?: HxOs): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    setHxPlatform(os ?? detectHxOs(), inject(DOCUMENT).documentElement);
  });
}
