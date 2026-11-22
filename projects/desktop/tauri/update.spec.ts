import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { setHxPlatform } from '@gravionlabs/helix-desktop';
import { channelOfVersion, HX_APP_INFO, provideHxAppInfo, readTauriVersion } from './app-info';
import { detectHxOs, providePlatform } from './platform';
import { HxStatusAppVersion } from './status-app-version';
import { HxStatusUpdate } from './status-update';
import {
  HX_UPDATE_BACKEND,
  HX_UPDATE_BEFORE_INSTALL,
  HX_UPDATE_CURRENT_MS,
  HxUpdateService,
} from './update.service';
import { defaultUpdateBackend, type HxUpdateBackend, noopUpdateBackend } from './update-backend';

const info = { version: '1.5.0', notes: 'Fixes', date: null };

function fake(over: Partial<HxUpdateBackend> = {}): HxUpdateBackend & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    check: () => {
      calls.push('check');
      return Promise.resolve(info);
    },
    install: () => {
      calls.push('install');
      return Promise.resolve();
    },
    relaunch: () => {
      calls.push('relaunch');
      return Promise.resolve();
    },
    ...over,
  };
}

function service(backend: HxUpdateBackend, version = '1.4.0') {
  TestBed.configureTestingModule({
    providers: [{ provide: HX_UPDATE_BACKEND, useValue: backend }, provideHxAppInfo({ version })],
  });
  return TestBed.inject(HxUpdateService);
}

describe('HxUpdateService', () => {
  it('starts idle', () => {
    expect(service(fake()).state().status).toBe('idle');
  });

  it('goes checking, then available', async () => {
    const s = service(fake());
    const p = s.check();
    expect(s.state().status).toBe('checking');
    await p;
    expect(s.state()).toEqual({ status: 'available', update: info });
    expect(s.update()).toEqual(info);
  });

  it('is current when there is no update', async () => {
    const s = service(fake({ check: () => Promise.resolve(null) }));
    await s.check();
    expect(s.state().status).toBe('current');
    expect(s.update()).toBeNull();
  });

  it('reports the failed check step', async () => {
    const s = service(fake({ check: () => Promise.reject(new Error('offline')) }));
    await s.check();
    expect(s.state()).toEqual({ status: 'error', step: 'check', message: 'offline' });
  });

  it('installs, then restarts', async () => {
    const b = fake();
    const s = service(b);
    await s.check();
    const p = s.installAndRestart();
    expect(s.state().status).toBe('installing');
    await p;
    expect(b.calls).toEqual(['check', 'install', 'relaunch']);
  });

  it('reports the failed install and relaunch steps', async () => {
    const s = service(fake({ install: () => Promise.reject('disk full') }));
    await s.check();
    await s.installAndRestart();
    expect(s.state()).toEqual({ status: 'error', step: 'install', message: 'disk full' });

    const r = service2(fake({ relaunch: () => Promise.reject(new Error('no')) }));
    await r.check();
    await r.installAndRestart();
    expect(r.state()).toMatchObject({ status: 'error', step: 'relaunch' });
  });

  it('does not install without an available update', async () => {
    const b = fake();
    const s = service(b);
    await s.installAndRestart();
    expect(b.calls).toEqual([]);
  });

  it('checks at start on stable', async () => {
    const b = fake();
    await service(b).start();
    expect(b.calls).toEqual(['check']);
  });

  it('does not update itself on an RC build, but checks on request', async () => {
    const b = fake();
    const s = service(b, '1.5.0-rc.1');
    expect(s.channel).toBe('rc');
    await s.start();
    expect(b.calls).toEqual([]);
    expect(s.state().status).toBe('idle');
    await s.check();
    expect(b.calls).toEqual(['check']);
  });

  function service2(backend: HxUpdateBackend) {
    TestBed.resetTestingModule();
    return service(backend);
  }
});

describe('HxUpdateService hook, progress and manual check', () => {
  const withHook = (backend: HxUpdateBackend, hook: () => void | Promise<void>) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HX_UPDATE_BACKEND, useValue: backend },
        { provide: HX_UPDATE_BEFORE_INSTALL, useValue: hook },
        provideHxAppInfo({ version: '1.4.0' }),
      ],
    });
    return TestBed.inject(HxUpdateService);
  };

  it('runs the hook while installing, before the install', async () => {
    const b = fake();
    const seen: string[] = [];
    const s: HxUpdateService = withHook(b, async () => {
      await Promise.resolve();
      seen.push(s.state().status);
      b.calls.push('hook');
    });
    await s.check();
    await s.installAndRestart();
    expect(seen).toEqual(['installing']);
    expect(b.calls).toEqual(['check', 'hook', 'install', 'relaunch']);
  });

  it('a throwing hook stops the install, and the install can be retried', async () => {
    const b = fake();
    let fail = true;
    const s = withHook(b, () => {
      if (fail) throw new Error('note not saved');
    });
    await s.check();
    await s.installAndRestart();
    expect(s.state()).toEqual({ status: 'error', step: 'install', message: 'note not saved' });
    expect(b.calls).toEqual(['check']);
    fail = false;
    await s.installAndRestart();
    expect(b.calls).toEqual(['check', 'install', 'relaunch']);
  });

  it('carries the download percent while installing', async () => {
    let report!: (p: number | null) => void;
    let finish!: () => void;
    const s = service(
      fake({
        install: (onProgress) => {
          report = onProgress!;
          return new Promise<void>((r) => (finish = r));
        },
      }),
    );
    await s.check();
    const p = s.installAndRestart();
    await Promise.resolve();
    expect(s.state()).toMatchObject({ status: 'installing', percent: null });
    report(42);
    expect(s.state()).toMatchObject({ status: 'installing', percent: 42 });
    finish();
    await p;
  });

  describe('manual check', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('shows current for a moment, then goes idle', async () => {
      const s = service(fake({ check: () => Promise.resolve(null) }));
      await s.check({ manual: true });
      expect(s.state().status).toBe('current');
      expect(s.currentShown()).toBe(true);
      vi.advanceTimersByTime(HX_UPDATE_CURRENT_MS);
      expect(s.state().status).toBe('idle');
      expect(s.currentShown()).toBe(false);
    });

    it('an automatic check does not show current', async () => {
      const s = service(fake({ check: () => Promise.resolve(null) }));
      await s.check();
      expect(s.currentShown()).toBe(false);
    });
  });
});

describe('web fallback', () => {
  it('resolves every call to a no-op outside Tauri', async () => {
    expect(defaultUpdateBackend()).toBe(noopUpdateBackend);
    expect(await noopUpdateBackend.check()).toBeNull();
    await expect(noopUpdateBackend.install()).resolves.toBeUndefined();
    await expect(noopUpdateBackend.relaunch()).resolves.toBeUndefined();
    expect(await readTauriVersion('0.0.0')).toBe('0.0.0');
    expect(detectHxOs('Mozilla/5.0 (Macintosh)', false)).toBe('web');
  });

  it('the service ends current without Tauri', async () => {
    TestBed.configureTestingModule({});
    const s = TestBed.inject(HxUpdateService);
    await s.start();
    expect(s.state().status).toBe('current');
    expect(TestBed.inject(HX_APP_INFO).channel).toBe('stable');
  });
});

describe('app info', () => {
  it('derives the channel from the version', () => {
    expect(channelOfVersion('1.4.0')).toBe('stable');
    expect(channelOfVersion('1.4.0-rc.2')).toBe('rc');
    expect(channelOfVersion('1.4.0-beta.1')).toBe('stable');
  });
});

describe('providePlatform', () => {
  it('detects the operating system inside Tauri', () => {
    expect(detectHxOs('Mozilla/5.0 (Macintosh; Intel Mac OS X)', true)).toBe('macos');
    expect(detectHxOs('Mozilla/5.0 (Windows NT 10.0)', true)).toBe('windows');
    expect(detectHxOs('Mozilla/5.0 (X11; Linux x86_64)', true)).toBe('linux');
    expect(detectHxOs('Mozilla/5.0 (iPhone; CPU iPhone OS 17)', true)).toBe('ios');
    expect(detectHxOs('Mozilla/5.0 (Linux; Android 14)', true)).toBe('android');
  });

  it('sets data-platform on the root element', () => {
    TestBed.configureTestingModule({ providers: [providePlatform('linux')] });
    TestBed.inject(HxUpdateService);
    expect(document.documentElement.getAttribute('data-platform')).toBe('linux');
    setHxPlatform('web');
  });

  it('falls back to web in a browser', () => {
    TestBed.configureTestingModule({ providers: [providePlatform()] });
    TestBed.inject(HxUpdateService);
    expect(document.documentElement.getAttribute('data-platform')).toBe('web');
  });
});

@Component({ imports: [HxStatusUpdate], template: '<hx-status-update />' })
class Host {}

@Component({ imports: [HxStatusUpdate], template: '<hx-status-update [alwaysVisible]="true" />' })
class AlwaysHost {}

describe('HxStatusUpdate', () => {
  afterEach(() => setHxPlatform('web'));

  const setup = async (backend: HxUpdateBackend, version = '1.4.0') => {
    TestBed.configureTestingModule({
      providers: [{ provide: HX_UPDATE_BACKEND, useValue: backend }, provideHxAppInfo({ version })],
    });
    const fixture = TestBed.createComponent(Host);
    const svc = TestBed.inject(HxUpdateService);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, svc, root, q: (s: string) => root.querySelector(s) as HTMLElement | null };
  };

  it('renders nothing while idle or current', async () => {
    const { fixture, svc, q } = await setup(fake({ check: () => Promise.resolve(null) }));
    expect(q('hx-status-item')).toBeNull();
    await svc.check();
    fixture.detectChanges();
    expect(q('hx-status-item')).toBeNull();
  });

  it('shows checking', async () => {
    const { fixture, svc, q } = await setup(fake({ check: () => new Promise(() => undefined) }));
    void svc.check();
    fixture.detectChanges();
    expect(q('hx-status-item')?.textContent).toContain('Checking for updates');
  });

  it('shows the update with details and installs from the popover', async () => {
    const b = fake();
    const { fixture, svc, q } = await setup(b);
    await svc.check();
    fixture.detectChanges();
    expect(q('hx-status-item')?.textContent).toContain('Update 1.5.0');
    q('.hx-status-control')!.click();
    fixture.detectChanges();
    expect(q('.hx-update-version')?.textContent).toContain('1.5.0');
    expect(q('.hx-update-notes')?.textContent).toContain('Fixes');
    const install = q('.hx-update-action') as HTMLButtonElement;
    expect(install.textContent).toContain('Install and restart');
    install.click();
    await fixture.whenStable();
    expect(b.calls).toEqual(['check', 'install', 'relaunch']);
  });

  it('shows installing with a disabled button', async () => {
    const { fixture, svc, q } = await setup(fake({ install: () => new Promise(() => undefined) }));
    await svc.check();
    void svc.installAndRestart();
    fixture.detectChanges();
    q('.hx-status-control')!.click();
    fixture.detectChanges();
    expect(q('hx-status-item')?.textContent).toContain('Installing update');
    expect((q('.hx-update-action') as HTMLButtonElement).disabled).toBe(true);
  });

  it('shows an error with the step and retries', async () => {
    const { fixture, svc, q } = await setup(fake({ check: () => Promise.reject(new Error('x')) }));
    await svc.check();
    fixture.detectChanges();
    expect(q('hx-status-item')?.classList).toContain('hx-status-error');
    q('.hx-status-control')!.click();
    fixture.detectChanges();
    expect(q('.hx-update-message')?.textContent).toContain('check: x');
    expect(q('.hx-update-action')?.textContent).toContain('Try again');
  });

  it('shows the download percent while installing', async () => {
    const { fixture, svc, q } = await setup(
      fake({
        install: (onProgress) => {
          onProgress?.(42);
          return new Promise(() => undefined);
        },
      }),
    );
    await svc.check();
    void svc.installAndRestart();
    await Promise.resolve();
    fixture.detectChanges();
    expect(q('hx-status-item')?.textContent).toContain('Installing update 42%');
  });

  it('leaves no empty popover frame when the state goes from available to installing', async () => {
    const { fixture, svc, root, q } = await setup(
      fake({ install: () => new Promise(() => undefined) }),
    );
    await svc.check();
    fixture.detectChanges();
    q('.hx-status-control')!.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('.hx-status-popover')).toHaveLength(1);
    void svc.installAndRestart();
    fixture.detectChanges();
    const frames = Array.from(root.querySelectorAll('.hx-status-popover'));
    expect(frames).toHaveLength(1);
    expect(frames[0].textContent?.trim()).not.toBe('');
  });

  it('with alwaysVisible shows "Check for updates" in idle and runs a manual check on a click', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HX_UPDATE_BACKEND, useValue: fake({ check: () => Promise.resolve(null) }) },
        provideHxAppInfo({ version: '1.4.0' }),
      ],
    });
    const fixture = TestBed.createComponent(AlwaysHost);
    const svc = TestBed.inject(HxUpdateService);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('hx-status-item')?.textContent).toContain('Check for updates');
    expect(root.querySelector('.hx-status-popover')).toBeNull();
    (root.querySelector('.hx-status-control') as HTMLElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(svc.state().status).toBe('current');
    expect(root.querySelector('hx-status-item')?.textContent).toContain('Up to date');
  });

  it('is not rendered on mobile', async () => {
    setHxPlatform('ios');
    const { fixture, svc, q } = await setup(fake());
    await svc.check();
    fixture.detectChanges();
    expect(svc.state().status).toBe('available');
    expect(q('hx-status-item')).toBeNull();
  });
});

@Component({ imports: [HxStatusAppVersion], template: '<hx-status-app-version />' })
class VersionHost {}

describe('HxStatusAppVersion', () => {
  const render = (version: string) => {
    TestBed.configureTestingModule({ providers: [provideHxAppInfo({ version })] });
    const f = TestBed.createComponent(VersionHost);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  };

  it('shows the RC badge on an RC build', () => {
    const el = render('1.5.0-rc.1');
    expect(el.querySelector('.hx-status-channel')?.textContent?.trim()).toBe('RC');
  });

  it('shows no badge on stable', () => {
    const el = render('1.5.0');
    expect(el.querySelector('.hx-status-version-text')?.textContent).toContain('v1.5.0');
    expect(el.querySelector('.hx-status-channel')).toBeNull();
  });
});
