import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxAvatar, HxAvatarGroup } from './avatar';

@Component({
  imports: [HxAvatar, HxAvatarGroup],
  template: `
    <hx-avatar id="label" label="JK" />
    <hx-avatar id="named" label="JK" ariaLabel="Jerome K" size="large" shape="circle" />
    <hx-avatar id="image" image="/a.png" icon="pi pi-user" label="X" ariaLabel="Amy" size="xlarge" />
    <hx-avatar id="icon" icon="pi pi-user" label="X" />
    <hx-avatar id="content"><b>?</b></hx-avatar>
    <hx-avatar-group id="group" ariaLabel="Team">
      <hx-avatar label="A" />
      <hx-avatar label="+2" />
    </hx-avatar-group>
  `,
})
class Host {}

describe('HxAvatar', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('shows initials as text, with no role without a name', () => {
    expect(el('label').textContent?.trim()).toBe('JK');
    expect(el('label').getAttribute('role')).toBeNull();
    expect(el('label').querySelector('.hx-avatar-label')?.getAttribute('aria-hidden')).toBeNull();
  });

  it('with ariaLabel it is a named img and hides what it draws', () => {
    expect(el('named').getAttribute('role')).toBe('img');
    expect(el('named').getAttribute('aria-label')).toBe('Jerome K');
    expect(el('named').querySelector('.hx-avatar-label')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('size and shape classes', () => {
    expect(el('named').classList).toContain('hx-avatar-lg');
    expect(el('named').classList).toContain('hx-avatar-circle');
    expect(el('image').classList).toContain('hx-avatar-xl');
    expect(el('label').classList).not.toContain('hx-avatar-circle');
  });

  it('image wins over icon, icon over label; the picture is decorative', () => {
    const img = el('image').querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/a.png');
    expect(img.getAttribute('alt')).toBe('');
    expect(el('image').querySelector('.hx-avatar-icon')).toBeNull();
    expect(el('icon').querySelector('.hx-avatar-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(el('icon').querySelector('.hx-avatar-label')).toBeNull();
  });

  it('projects content when nothing else is given', () => {
    expect(el('content').querySelector('b')?.textContent).toBe('?');
  });

  it('a group is a named group of its avatars', () => {
    expect(el('group').getAttribute('role')).toBe('group');
    expect(el('group').getAttribute('aria-label')).toBe('Team');
    expect(el('group').querySelectorAll('hx-avatar').length).toBe(2);
  });
});
