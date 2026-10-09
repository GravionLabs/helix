import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
} from '@angular/core';
import { HxCheckbox } from '../checkbox/checkbox';
import { HxInput } from '../input/input';

/** One node of the tree. Keys must be unique in the whole tree. */
export interface HxTreeNode<T = unknown> {
  key: string;
  label: string;
  /** CSS classes of an icon font, e.g. `pi pi-folder`. */
  icon?: string;
  children?: HxTreeNode<T>[];
  /**
   * `true`: no toggle. `false`: has a toggle even without children (children are loaded when it is expanded, see
   * `nodeExpand`). By default a node is a leaf when it has no children.
   */
  leaf?: boolean;
  /** Starts expanded. */
  expanded?: boolean;
  /** Shows a spinner instead of the toggle, e.g. while the children load. */
  loading?: boolean;
  disabled?: boolean;
  /** Anything the app wants to read back in templates and events. */
  data?: T;
}

export type HxTreeSelectionMode = 'none' | 'single' | 'multiple' | 'checkbox';
export type HxTreeFilterMode = 'lenient' | 'strict';

/** `selection` of a tree: a key (single), keys (multiple, checkbox) or `null`. */
export type HxTreeSelection = string | readonly string[] | null;

/** What a `nodeExpand` / `nodeCollapse` event carries. */
export interface HxTreeNodeEvent<T = unknown> {
  node: HxTreeNode<T>;
}

/** What the node template receives. */
export interface HxTreeNodeContext<T = unknown> {
  $implicit: HxTreeNode<T>;
  selected: boolean;
  expanded: boolean;
  level: number;
}

/** Replaces the label of a node: `<ng-template hxTreeNode let-node>…</ng-template>`. */
@Directive({ selector: 'ng-template[hxTreeNode]' })
export class HxTreeNodeTemplate {
  readonly template = inject<TemplateRef<HxTreeNodeContext>>(TemplateRef);
}

interface TreeEntry {
  node: HxTreeNode;
  parent: string | null;
}

interface ViewNode {
  node: HxTreeNode;
  children: ViewNode[];
  leaf: boolean;
  /** Filtering opens a node whose descendants match. */
  forceOpen: boolean;
}

/**
 * Hierarchical data with expand, collapse, selection, filter and lazy children, in the WAI-ARIA tree view pattern.
 *
 * ```html
 * <hx-tree [value]="nodes" selectionMode="single" [(selection)]="selected" ariaLabel="Files" />
 * <hx-tree [value]="nodes" selectionMode="checkbox" [(selection)]="checked" filter />
 * ```
 *
 * `selection` holds node keys: one key (or `null`) with `single`, an array with `multiple` and `checkbox`. In
 * `checkbox` mode checking a node checks everything below it, and a parent is checked when all its children are and
 * shown as mixed when only some are.
 *
 * Lazy children: give the node `leaf: false`; `(nodeExpand)` fires when it is expanded, the app sets `loading` and
 * then puts the children into a new `value`.
 *
 * Keyboard: Tab enters the tree once; Up/Down move, Right expands or goes to the first child, Left collapses or goes
 * to the parent, Home/End jump, typing jumps by label, Enter or Space selects (checks).
 */
@Component({
  selector: 'hx-tree',
  imports: [NgTemplateOutlet, HxInput, HxCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tree' },
  template: `
    @if (filter()) {
      <input
        hx-input
        type="search"
        class="hx-tree-filter"
        [placeholder]="filterPlaceholder()"
        [attr.aria-label]="filterLabel()"
        [value]="query()"
        (input)="query.set($any($event.target).value)"
      />
    }
    <ul
      class="hx-tree-list"
      role="tree"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-multiselectable]="multiple() ? 'true' : null"
      (keydown)="onKeydown($event)"
      (focusin)="onFocusIn($event)"
    >
      <ng-container [ngTemplateOutlet]="level" [ngTemplateOutletContext]="{ $implicit: view(), depth: 1 }" />
    </ul>
    @if (filtering() && view().length === 0) {
      <div class="hx-tree-empty" role="status">{{ emptyMessage() }}</div>
    }

    <ng-template #level let-items let-depth="depth">
      @for (item of items; track item.node.key; let i = $index) {
        <li
          class="hx-tree-node"
          role="treeitem"
          [attr.data-key]="item.node.key"
          [attr.aria-level]="depth"
          [attr.aria-setsize]="items.length"
          [attr.aria-posinset]="i + 1"
          [attr.aria-expanded]="item.leaf ? null : isOpen(item)"
          [attr.aria-selected]="mode() === 'single' || mode() === 'multiple' ? isSelected(item.node.key) : null"
          [attr.aria-checked]="mode() === 'checkbox' ? checkState(item.node.key) : null"
          [attr.aria-disabled]="item.node.disabled ? 'true' : null"
          [attr.tabindex]="item.node.key === tabKey() ? 0 : -1"
        >
          <div
            class="hx-tree-node-content"
            [class.hx-tree-node-selected]="mode() !== 'checkbox' && isSelected(item.node.key)"
            [class.hx-tree-node-disabled]="item.node.disabled"
            (click)="onClick(item, $event)"
          >
            <span class="hx-tree-node-toggle" [class.hx-tree-node-toggle-leaf]="item.leaf" aria-hidden="true" (click)="onToggleClick(item, $event)">
              @if (item.node.loading) {
                <span class="hx-tree-loading-icon"></span>
              } @else if (!item.leaf) {
                <span class="hx-tree-toggle-icon" [class.hx-tree-toggle-icon-open]="isOpen(item)"></span>
              }
            </span>
            @if (mode() === 'checkbox') {
              <input
                hx-checkbox
                type="checkbox"
                class="hx-tree-node-checkbox"
                tabindex="-1"
                aria-hidden="true"
                [checked]="checkState(item.node.key) === 'true'"
                [indeterminate]="checkState(item.node.key) === 'mixed'"
                [disabled]="!!item.node.disabled"
              />
            }
            @if (template(); as tpl) {
              <ng-container
                [ngTemplateOutlet]="tpl.template"
                [ngTemplateOutletContext]="{ $implicit: item.node, selected: isSelected(item.node.key), expanded: isOpen(item), level: depth }"
              />
            } @else {
              @if (item.node.icon) {
                <span class="hx-tree-node-icon" [class]="item.node.icon" aria-hidden="true"></span>
              }
              <span class="hx-tree-node-label">{{ item.node.label }}</span>
            }
          </div>
          @if (!item.leaf && isOpen(item) && item.children.length) {
            <ul class="hx-tree-group" role="group">
              <ng-container [ngTemplateOutlet]="level" [ngTemplateOutletContext]="{ $implicit: item.children, depth: depth + 1 }" />
            </ul>
          }
        </li>
      }
    </ng-template>
  `,
})
export class HxTree {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The root nodes. Pass a new array (or new nodes) to change the tree; the tree never mutates it. */
  readonly value = input<readonly HxTreeNode[]>([]);
  readonly selectionMode = input<HxTreeSelectionMode>('none');
  /** Keys of the selected (checked) nodes: a key with `single`, an array otherwise. */
  readonly selection = model<HxTreeSelection>(null);
  /** Shows a text field above the tree that filters it by label. */
  readonly filter = input(false, { transform: booleanAttribute });
  /** `lenient`: a matching node shows all its children; `strict`: only matching nodes and their ancestors. */
  readonly filterMode = input<HxTreeFilterMode>('lenient');
  readonly filterPlaceholder = input('');
  readonly filterLabel = input('Filter');
  readonly emptyMessage = input('No results found');
  /** Accessible name of the tree. */
  readonly ariaLabel = input<string>();

  /** A node was expanded; load its children here when it is lazy. */
  readonly nodeExpand = output<HxTreeNodeEvent>();
  readonly nodeCollapse = output<HxTreeNodeEvent>();

  protected readonly template = contentChild(HxTreeNodeTemplate);
  protected readonly query = signal('');
  protected readonly mode = computed(() => this.selectionMode());
  protected readonly multiple = computed(
    () => this.mode() === 'multiple' || this.mode() === 'checkbox',
  );
  protected readonly filtering = computed(() => this.filter() && this.query().trim() !== '');

  /** Keys of the expanded nodes. */
  readonly #expanded = signal<ReadonlySet<string>>(new Set());
  readonly #focused = signal<string | null>(null);

  readonly #index = computed(() => {
    const map = new Map<string, TreeEntry>();
    const walk = (nodes: readonly HxTreeNode[], parent: string | null) => {
      for (const node of nodes) {
        map.set(node.key, { node, parent });
        if (node.children) walk(node.children, node.key);
      }
    };
    walk(this.value(), null);
    return map;
  });

  readonly #selected = computed<ReadonlySet<string>>(() => {
    const selection = this.selection();
    if (selection === null || selection === undefined) return new Set();
    return new Set(typeof selection === 'string' ? [selection] : selection);
  });

  protected readonly view = computed(() => {
    const filtering = this.filtering();
    const query = this.query().trim().toLowerCase();
    const strict = this.filterMode() === 'strict';
    const build = (nodes: readonly HxTreeNode[], shown: boolean): ViewNode[] => {
      const out: ViewNode[] = [];
      for (const node of nodes) {
        const matches = !filtering || node.label.toLowerCase().includes(query);
        const children = node.children
          ? build(node.children, !strict && filtering && (shown || matches))
          : [];
        const included = !filtering || matches || shown || children.length > 0;
        if (!included) continue;
        out.push({
          node,
          children,
          leaf: node.leaf ?? !node.children?.length,
          forceOpen: filtering && children.length > 0 && !shown,
        });
      }
      return out;
    };
    return build(this.value(), false);
  });

  /** The tree item that is in the tab order: the focused one while it is visible, else the first. */
  protected readonly tabKey = computed(() => {
    const visible = this.#visibleKeys();
    const focused = this.#focused();
    if (focused !== null && visible.includes(focused)) return focused;
    const selected = visible.find((key) => this.#selected().has(key));
    return selected ?? visible[0] ?? null;
  });

  readonly #visibleKeys = computed(() => {
    const keys: string[] = [];
    const walk = (items: readonly ViewNode[]) => {
      for (const item of items) {
        keys.push(item.node.key);
        if (!item.leaf && this.isOpen(item)) walk(item.children);
      }
    };
    walk(this.view());
    return keys;
  });

  /** Keys that have been in a `value` already, so `expanded` only applies to nodes the first time they appear. */
  readonly #seen = new Set<string>();
  #typed = '';
  #typedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // nodes that ask to start expanded; a node the user collapsed stays collapsed when the value is replaced
    effect(() => {
      const nodes = this.value();
      untracked(() => {
        const open = new Set(this.#expanded());
        const walk = (list: readonly HxTreeNode[]) => {
          for (const node of list) {
            if (node.expanded && !this.#seen.has(node.key)) open.add(node.key);
            this.#seen.add(node.key);
            if (node.children) walk(node.children);
          }
        };
        walk(nodes);
        this.#expanded.set(open);
      });
    });
  }

  isOpen(item: ViewNode): boolean {
    return item.forceOpen || this.#expanded().has(item.node.key);
  }

  isSelected(key: string): boolean {
    return this.#selected().has(key);
  }

  /** `'true'`, `'false'` or `'mixed'` (some descendants checked) for `aria-checked`. */
  protected checkState(key: string): 'true' | 'false' | 'mixed' {
    if (this.#selected().has(key)) return 'true';
    const entry = this.#index().get(key);
    const some = (node: HxTreeNode): boolean =>
      !!node.children?.some((child) => this.#selected().has(child.key) || some(child));
    return entry && some(entry.node) ? 'mixed' : 'false';
  }

  expand(key: string): void {
    const entry = this.#index().get(key);
    if (!entry || this.#expanded().has(key)) return;
    this.#expanded.set(new Set([...this.#expanded(), key]));
    this.nodeExpand.emit({ node: entry.node });
  }

  collapse(key: string): void {
    const entry = this.#index().get(key);
    if (!entry || !this.#expanded().has(key)) return;
    const open = new Set(this.#expanded());
    open.delete(key);
    this.#expanded.set(open);
    this.nodeCollapse.emit({ node: entry.node });
  }

  toggle(key: string): void {
    if (this.#expanded().has(key)) this.collapse(key);
    else this.expand(key);
  }

  expandAll(): void {
    for (const [key, { node }] of this.#index()) if (node.children?.length) this.expand(key);
  }

  collapseAll(): void {
    for (const key of [...this.#expanded()]) this.collapse(key);
  }

  protected onToggleClick(item: ViewNode, event: Event): void {
    if (item.leaf || item.node.disabled) return;
    event.stopPropagation();
    this.toggle(item.node.key);
  }

  protected onClick(item: ViewNode, event: MouseEvent): void {
    if (item.node.disabled) return;
    this.#focusItem(item.node.key, false);
    this.select(item.node.key, event.ctrlKey || event.metaKey);
  }

  /** Selects, or toggles, the node according to the selection mode. */
  select(key: string, deselect = false): void {
    const mode = this.mode();
    if (mode === 'none') return;
    const selected = this.#selected();
    if (mode === 'single') {
      this.selection.set(selected.has(key) && deselect ? null : key);
    } else if (mode === 'multiple') {
      const next = new Set(selected);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      this.selection.set([...next]);
    } else {
      this.selection.set([...this.#toggleChecked(key, selected)]);
    }
  }

  #toggleChecked(key: string, selected: ReadonlySet<string>): Set<string> {
    const index = this.#index();
    const next = new Set(selected);
    const subtree = (node: HxTreeNode, out: string[] = []): string[] => {
      out.push(node.key);
      for (const child of node.children ?? []) subtree(child, out);
      return out;
    };
    const entry = index.get(key);
    if (!entry) return next;
    const keys = subtree(entry.node).filter((k) => !index.get(k)?.node.disabled);
    const checking = !next.has(key);
    for (const k of keys) {
      if (checking) next.add(k);
      else next.delete(k);
    }
    // parents are checked exactly when all their children are
    for (let parent = entry.parent; parent !== null; parent = index.get(parent)?.parent ?? null) {
      const node = index.get(parent)?.node;
      if (!node?.children?.length) break;
      if (node.children.every((child) => next.has(child.key))) next.add(parent);
      else next.delete(parent);
    }
    return next;
  }

  protected onFocusIn(event: FocusEvent): void {
    const key = (event.target as HTMLElement)
      .closest<HTMLElement>('[role=treeitem]')
      ?.getAttribute('data-key');
    if (key) this.#focused.set(key);
  }

  #items(): HTMLElement[] {
    return [...this.#host.nativeElement.querySelectorAll<HTMLElement>('[role=treeitem]')];
  }

  #focusItem(key: string, move = true): void {
    this.#focused.set(key);
    if (!move) return;
    const el = this.#items().find((item) => item.getAttribute('data-key') === key);
    el?.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[role=treeitem]');
    if (!target || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = target.getAttribute('data-key') as string;
    const items = this.#items();
    const at = items.indexOf(target);
    const entry = this.#index().get(key);
    const goto = (el: HTMLElement | undefined) => {
      if (!el) return;
      event.preventDefault();
      el.focus();
    };
    const open = target.getAttribute('aria-expanded');
    switch (event.key) {
      case 'ArrowDown':
        goto(items[at + 1]);
        return;
      case 'ArrowUp':
        goto(items[at - 1]);
        return;
      case 'Home':
        goto(items[0]);
        return;
      case 'End':
        goto(items[items.length - 1]);
        return;
      case 'ArrowRight':
        if (open === 'false') {
          event.preventDefault();
          this.expand(key);
        } else if (open === 'true') {
          goto(
            target.querySelector<HTMLElement>(':scope > [role=group] > [role=treeitem]') ??
              undefined,
          );
        }
        return;
      case 'ArrowLeft':
        if (open === 'true') {
          event.preventDefault();
          this.collapse(key);
        } else if (entry?.parent != null) {
          goto(items.find((item) => item.getAttribute('data-key') === entry.parent));
        }
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!entry?.node.disabled) this.select(key, false);
        return;
      default:
        if (event.key.length === 1) this.#typeahead(event.key, items, at, goto);
    }
  }

  #typeahead(
    char: string,
    items: HTMLElement[],
    at: number,
    goto: (el: HTMLElement | undefined) => void,
  ): void {
    clearTimeout(this.#typedTimer);
    this.#typed += char.toLowerCase();
    this.#typedTimer = setTimeout(() => {
      this.#typed = '';
    }, 500);
    const label = (el: HTMLElement) =>
      el
        .querySelector(':scope > .hx-tree-node-content .hx-tree-node-label')
        ?.textContent?.trim()
        .toLowerCase() ?? '';
    const ordered = [...items.slice(at + 1), ...items.slice(0, at + 1)];
    // typing the same letter again cycles through the items that start with it
    const search = /^(.)\1*$/.test(this.#typed) ? this.#typed[0] : this.#typed;
    goto(ordered.find((el) => label(el).startsWith(search)));
  }
}
