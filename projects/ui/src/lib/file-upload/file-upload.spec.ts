import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { formatFileSize, HxFileUpload, matchesAccept } from './file-upload';

const file = (name: string, size = 100, type = 'text/plain') =>
  new File([new Uint8Array(size)], name, { type });

@Component({
  imports: [HxFileUpload],
  template: `
    <hx-file-upload id="adv" accept="image/*,.pdf" multiple [maxFileSize]="1000" [fileLimit]="3" [progress]="progress()"
      (select)="selected.push($event)" (remove)="removed.push($event)" (clear)="cleared = cleared + 1" (upload)="uploaded.push($event)" />
    <hx-file-upload id="basic" mode="basic" chooseLabel="Import" accept=".csv" (select)="basicSelected.push($event)" />
    <hx-file-upload id="off" disabled />
  `,
})
class Host {
  progress = signal<number | null>(null);
  selected: File[][] = [];
  removed: File[] = [];
  cleared = 0;
  uploaded: File[][] = [];
  basicSelected: File[][] = [];
}

describe('HxFileUpload', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let cmp: HxFileUpload;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const adv = () => fixture.debugElement.children[0].componentInstance as HxFileUpload;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
    cmp = adv();
  });

  it('formats sizes and matches accept rules', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB');
    expect(matchesAccept(file('a.png', 1, 'image/png'), 'image/*')).toBe(true);
    expect(matchesAccept(file('a.PDF', 1, ''), '.pdf')).toBe(true);
    expect(matchesAccept(file('a.txt', 1, 'text/plain'), 'image/*,.pdf')).toBe(false);
    expect(matchesAccept(file('a.txt'), '')).toBe(true);
  });

  it('chooses through a native file input behind a button-like label', () => {
    const input = el('adv').querySelector('input[type=file]') as HTMLInputElement;
    expect(input.accept).toBe('image/*,.pdf');
    expect(input.multiple).toBe(true);
    const label = input.closest('label') as HTMLElement;
    expect(label.classList).toContain('hx-button');
    expect(label.textContent?.trim()).toBe('Choose');
    input.focus();
    expect(document.activeElement).toBe(input);
  });

  it('adds valid files, lists name and size, and emits select', async () => {
    cmp.add([file('a.pdf', 300, 'application/pdf'), file('b.png', 2048 - 1048, 'image/png')]);
    await settle();
    expect(host.selected.length).toBe(1);
    expect(host.selected[0].map((f) => f.name)).toEqual(['a.pdf', 'b.png']);
    const items = [...el('adv').querySelectorAll('.hx-file-upload-file')];
    expect(items.map((i) => i.querySelector('.hx-file-upload-file-name')?.textContent)).toEqual([
      'a.pdf',
      'b.png',
    ]);
    expect(items[0].querySelector('.hx-file-upload-file-size')?.textContent).toBe('300 B');
  });

  it('rejects files of the wrong type, too large, or beyond the limit, and says why in a live region', async () => {
    cmp.add([file('a.txt', 10), file('big.pdf', 5000, 'application/pdf')]);
    await settle();
    const region = el('adv').querySelector('.hx-file-upload-messages') as HTMLElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('role')).toBe('status');
    const text = [...region.querySelectorAll('p')].map((p) => p.textContent);
    expect(text[0]).toBe('a.txt: Invalid file type, allowed file types: image/*,.pdf.');
    expect(text[1]).toBe('big.pdf: Invalid file size, file size should be smaller than 1000 B.');
    expect(host.selected.length).toBe(0);

    cmp.add([
      file('1.pdf', 1, 'application/pdf'),
      file('2.pdf', 1, 'application/pdf'),
      file('3.pdf', 1, 'application/pdf'),
      file('4.pdf', 1, 'application/pdf'),
    ]);
    await settle();
    expect(cmp.files().length).toBe(3);
    expect(region.textContent).toContain('limit is 3 at most');
  });

  it('removes a file and emits remove; cancel empties the list and emits clear', async () => {
    cmp.add([file('a.pdf', 1, 'application/pdf'), file('b.pdf', 1, 'application/pdf')]);
    await settle();
    const remove = el('adv').querySelector('.hx-file-upload-file button') as HTMLButtonElement;
    expect(remove.getAttribute('aria-label')).toBe('Remove a.pdf');
    remove.click();
    await settle();
    expect(host.removed.map((f) => f.name)).toEqual(['a.pdf']);
    expect(cmp.files().map((f) => f.name)).toEqual(['b.pdf']);
    const [, upload, cancel] = [
      ...el('adv').querySelectorAll('.hx-file-upload-header > *'),
    ] as HTMLButtonElement[];
    upload.click();
    expect(host.uploaded[0].map((f) => f.name)).toEqual(['b.pdf']);
    cancel.click();
    await settle();
    expect(host.cleared).toBe(1);
    expect(cmp.files()).toEqual([]);
  });

  it('adds dropped files and highlights the zone while dragging', async () => {
    const zone = el('adv').querySelector('.hx-file-upload-content') as HTMLElement;
    zone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    await settle();
    expect(el('adv').classList).toContain('hx-file-upload-highlight');
    const drop = new Event('drop', { bubbles: true, cancelable: true }) as Event & {
      dataTransfer?: unknown;
    };
    drop.dataTransfer = { files: [file('d.pdf', 1, 'application/pdf')] };
    zone.dispatchEvent(drop);
    await settle();
    expect(el('adv').classList).not.toContain('hx-file-upload-highlight');
    expect(cmp.files().map((f) => f.name)).toEqual(['d.pdf']);
  });

  it('shows a progress bar with the value', async () => {
    expect(el('adv').querySelector('[role=progressbar]')).toBeNull();
    host.progress.set(40);
    await settle();
    const bar = el('adv').querySelector('[role=progressbar]') as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('has a basic mode with only the choose button and the chosen names', async () => {
    expect(el('basic').querySelector('.hx-file-upload-content')).toBeNull();
    expect(el('basic').querySelector('label')?.textContent?.trim()).toBe('Import');
    const basic = fixture.debugElement.children[1].componentInstance as HxFileUpload;
    basic.add([file('data.csv', 10)]);
    await settle();
    expect(host.basicSelected[0][0].name).toBe('data.csv');
    expect(el('basic').querySelector('.hx-file-upload-names')?.textContent).toBe('data.csv');
    basic.add([file('x.png', 1, 'image/png')]);
    await settle();
    expect(el('basic').querySelector('[role=status]')?.textContent).toContain(
      'x.png: Invalid file type',
    );
  });

  it('is inert when disabled', () => {
    expect((el('off').querySelector('input[type=file]') as HTMLInputElement).disabled).toBe(true);
    expect(el('off').classList).toContain('hx-file-upload-disabled');
  });
});
