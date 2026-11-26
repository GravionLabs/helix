import { FocusKeyManager, type FocusableOption } from '@angular/cdk/a11y';
import {
  afterEveryRender,
  booleanAttribute,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  HostAttributeToken,
  inject,
  Injector,
  input,
} from '@angular/core';

/** What the list is: a plain list of buttons and links, or a listbox of options. */
export type HxListRole = 'list' | 'listbox';

/** The `aria-current` value of the current row; `true` writes `aria-current="true"`. */
export type HxListRowCurrent = boolean | 'page' | 'step' | 'location' | 'date' | 'time';

/**
 * A list of rows for sidebars, search results, outlines and pickers: the container of `[hx-list-row]`. It owns
 * the keyboard: the list is one tab stop, Arrow Up and Down move between the rows (without wrapping), Home and
 * End jump to the first and last one. Disabled and `hidden` rows are skipped.
 *
 * ```html
 * <hx-list aria-label="Branches">
 *   <button hx-list-row type="button" [selected]="branch() === 'main'">main</button>
 *   <a hx-list-row routerLink="/settings" [current]="settingsOpen()">Settings</a>
 * </hx-list>
 * ```
 *
 * With `role="list"` (default) the rows keep their native roles inside a `group`, and `selected` is
 * `aria-pressed`. With `role="listbox"` the rows are `option`s and `selected` is `aria-selected`. Give the list
 * an accessible name.
 */
@Directive({
  selector: 'hx-list',
  exportAs: 'hx-list',
  host: {
    class: 'hx-list',
    // a `list` role would require `listitem` children, which would replace the rows' button and link roles
    '[attr.role]': "role() === 'listbox' ? 'listbox' : 'group'",
    '(keydown)': 'onKeydown($event)',
  },
})
export class HxList {
  /** `list` (default) or `listbox`. */
  readonly role = input<HxListRole>('list');

  private readonly allRows = contentChildren(
    forwardRef(() => HxListRow),
    { descendants: true },
  );
  /** The rows of this list, in document order, without the rows of a nested list. */
  private readonly rows = computed(() => this.allRows().filter((row) => row.list === this));

  private readonly keys = new FocusKeyManager<HxListRow>(this.rows, inject(Injector))
    .withVerticalOrientation()
    .withHomeAndEnd();

  /** The row that had the focus last; it stays the tab stop. */
  private focused: HxListRow | null = null;

  constructor() {
    // after the render, so `disabled`, `hidden` and the inputs of every row are up to date
    afterEveryRender(() => this.updateTabStop());
    inject(DestroyRef).onDestroy(() => this.keys.destroy());
  }

  /** Called by a row that received the focus. */
  rowFocused(row: HxListRow): void {
    this.focused = row;
    this.keys.updateActiveItem(row);
    this.updateTabStop();
  }

  protected onKeydown(event: KeyboardEvent): void {
    // keys of other content in the list, and of the rows of a nested list, are not ours
    const row = this.rows().find((r) => r.element === event.target);
    if (!row) return;
    this.keys.updateActiveItem(row);
    this.keys.onKeydown(event);
  }

  /**
   * One row is reachable with Tab: the one focused last, else the current one, else the selected one, else the
   * first.
   */
  private updateTabStop(): void {
    const rows = this.rows();
    const enabled = rows.filter((row) => !row.disabled);
    const stop =
      enabled.find((row) => row === this.focused) ??
      enabled.find((row) => row.current() !== false) ??
      enabled.find((row) => row.selected()) ??
      enabled[0];
    for (const row of rows) row.element.tabIndex = row === stop ? 0 : -1;
  }
}

/**
 * A row of an `hx-list`, on a native `button` or `a`, so activation and link behaviour stay native. Put
 * `.hx-list-row-icon`, `.hx-list-row-label` (truncates) and `.hx-list-row-meta` (trailing text or badge) inside.
 *
 * `selected` sets `aria-selected` in a listbox and `aria-pressed` on a button in a list; a selected link in a
 * list gets `aria-current="true"`, because a link cannot be pressed. Left unbound, a button is a plain button.
 * `current` sets `aria-current`.
 */
@Directive({
  selector: 'button[hx-list-row], a[hx-list-row]',
  exportAs: 'hx-list-row',
  host: {
    class: 'hx-list-row',
    '[class.hx-list-row-selected]': 'selected()',
    '[class.hx-list-row-current]': 'current() !== false',
    '[attr.role]': "listbox ? 'option' : staticRole",
    '[attr.aria-selected]': 'listbox ? !!selected() : null',
    '[attr.aria-pressed]': 'ariaPressed',
    '[attr.aria-current]': 'ariaCurrent',
    '(focus)': 'list?.rowFocused(this)',
  },
})
export class HxListRow implements FocusableOption {
  /** The row is selected. */
  readonly selected = input<boolean | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined ? undefined : booleanAttribute(value)),
  });

  /** The row is the current item, e.g. the open page: `true`, `'page'`, `'step'`, `'location'`, … */
  readonly current = input<HxListRowCurrent, HxListRowCurrent | '' | 'true' | null | undefined>(
    false,
    {
      transform: (value) => {
        if (value === '' || value === 'true') return true;
        return value ?? false;
      },
    },
  );

  /** The list the row belongs to. */
  readonly list = inject(HxList, { optional: true });
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly staticRole = inject(new HostAttributeToken('role'), { optional: true });

  /** Disabled (`disabled` or `aria-disabled="true"`) and hidden rows are skipped by the keyboard. */
  get disabled(): boolean {
    return (
      this.element.matches(':disabled') ||
      this.element.getAttribute('aria-disabled') === 'true' ||
      this.element.hasAttribute('hidden')
    );
  }

  focus(): void {
    this.element.focus();
  }

  protected get listbox(): boolean {
    return this.list?.role() === 'listbox';
  }

  protected get ariaPressed(): boolean | null {
    if (this.listbox || this.element.tagName !== 'BUTTON') return null;
    return this.selected() ?? null;
  }

  protected get ariaCurrent(): string | null {
    const current = this.current();
    if (current !== false) return String(current);
    const selectedLink = !this.listbox && this.element.tagName === 'A' && this.selected();
    return selectedLink ? 'true' : null;
  }
}
