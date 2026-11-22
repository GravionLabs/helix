import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { type HxMergeChoice, hxMergeParts, hxMergeText } from './line-diff';

let nextId = 0;

const CHOICES: readonly { value: HxMergeChoice; label: 'mine' | 'theirs' | 'both' }[] = [
  { value: 'mine', label: 'mine' },
  { value: 'theirs', label: 'theirs' },
  { value: 'both', label: 'both' },
];

/**
 * Merges two versions of a text: shared lines are shown once, each differing part offers mine, theirs or both,
 * and the result can be edited before it is taken. It renders no dialog; the app places it.
 */
@Component({
  selector: 'hx-conflict-merge',
  templateUrl: './conflict-merge.html',
  styleUrl: './conflict-merge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-conflict-merge' },
})
export class HxConflictMerge {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly id = `hx-conflict-merge-${nextId++}`;

  /** My version of the text. */
  readonly mine = input.required<string>();
  /** Their version of the text. */
  readonly theirs = input.required<string>();
  readonly mineLabel = input('Mine');
  readonly theirsLabel = input('Theirs');

  /** The final text on confirm. */
  readonly merged = output<string>();
  /** Cancel was pressed. */
  readonly cancelled = output<void>();

  protected readonly parts = computed(() => hxMergeParts(this.mine(), this.theirs()));
  protected readonly hunks = computed(() => this.parts().filter((part) => part.kind === 'hunk'));

  /** Choices the user made; a change of `mine` or `theirs` resets them. */
  protected readonly choices = linkedSignal<unknown, Record<number, HxMergeChoice>>({
    source: this.parts,
    computation: () => ({}),
  });
  /** The hand-edited result, or `null` while the result follows the choices. */
  protected readonly edit = linkedSignal<unknown, string | null>({
    source: this.parts,
    computation: () => null,
  });
  /** A choice waiting for the answer to the overwrite prompt. */
  protected readonly pending = linkedSignal<
    unknown,
    { index: number; choice: HxMergeChoice } | null
  >({ source: this.parts, computation: () => null });

  protected readonly choiceOptions = CHOICES;

  /** The merged text for the current choices; a part without a choice takes mine. */
  readonly result = computed(() =>
    hxMergeText(this.parts(), this.choices(), this.mine().endsWith('\n')),
  );
  /** The number of differing parts the user has not chosen yet. */
  readonly unresolved = computed(
    () => this.hunks().filter((part) => this.choices()[part.index] === undefined).length,
  );

  /** The text in the result field: the hand edit, else the merged text. */
  protected readonly text = computed(() => this.edit() ?? this.result());

  protected choiceOf(index: number): HxMergeChoice {
    return this.choices()[index] ?? 'mine';
  }

  protected choose(index: number, choice: HxMergeChoice): void {
    if (this.edit() !== null && this.choiceOf(index) !== choice) {
      // The prompt decides; the radio keeps showing the current choice until then.
      this.pending.set({ index, choice });
      this.restoreRadios(index);
      return;
    }
    this.apply(index, choice);
  }

  protected overwrite(): void {
    const pending = this.pending();
    if (!pending) return;
    this.edit.set(null);
    this.apply(pending.index, pending.choice);
  }

  protected keepEdit(): void {
    const pending = this.pending();
    this.pending.set(null);
    if (pending) this.restoreRadios(pending.index);
  }

  protected onEdit(event: Event): void {
    this.edit.set((event.target as HTMLTextAreaElement).value);
    this.pending.set(null);
  }

  protected confirm(): void {
    this.merged.emit(this.text());
  }

  protected lines(lines: readonly string[]): string {
    return lines.join('\n');
  }

  private apply(index: number, choice: HxMergeChoice): void {
    this.pending.set(null);
    this.choices.update((choices) => ({ ...choices, [index]: choice }));
  }

  /** Native radios check themselves before the click handler runs; put the check back on the current choice. */
  private restoreRadios(index: number): void {
    const current = this.choiceOf(index);
    for (const radio of this.#host.nativeElement.querySelectorAll<HTMLInputElement>(
      `input[name="${this.id}-${index}"]`,
    )) {
      radio.checked = radio.value === current;
    }
  }
}
