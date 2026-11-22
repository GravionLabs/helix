import {
  Facet,
  RangeSet,
  StateEffect,
  StateField,
  type Extension,
  type Range,
} from '@codemirror/state';
import {
  Decoration,
  EditorView,
  GutterMarker,
  lineNumberMarkers,
  WidgetType,
  type DecorationSet,
} from '@codemirror/view';

/** A review finding on lines of one side of a diff. Lines are 1-based. */
export interface HxDiffFinding {
  readonly id: string;
  readonly side: 'original' | 'modified';
  readonly startLine: number;
  readonly endLine: number;
  readonly severity: 'blocking' | 'note';
  readonly title: string;
  readonly detail?: string;
}

/** A finding as one editor shows it: `mark` tells whether its lines are marked in the gutter. */
export interface HxPlacedFinding {
  readonly finding: HxDiffFinding;
  readonly start: number;
  readonly end: number;
  readonly mark: boolean;
}

/** What a finding-enabled editor tells its owner. */
export interface HxFindingHandlers {
  /** The action button of a finding box was pressed in `view`. */
  action(view: EditorView, finding: HxDiffFinding): void;
}

const setFindings = StateEffect.define<{
  readonly findings: readonly HxPlacedFinding[];
  readonly actionLabel: string;
}>();
const handlersFacet = Facet.define<HxFindingHandlers, HxFindingHandlers | null>({
  combine: (values) => values[0] ?? null,
});

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Inline icons (no icon font): a filled octagon with a bar for blocking, a circle with an i for a note. */
const icon = (severity: HxDiffFinding['severity']): SVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'cm-finding-icon');
  const shape = document.createElementNS(SVG_NS, 'path');
  shape.setAttribute('fill', 'currentColor');
  const glyph = document.createElementNS(SVG_NS, 'path');
  glyph.setAttribute('fill', 'none');
  glyph.setAttribute('stroke', 'var(--h-content-background)');
  glyph.setAttribute('stroke-width', '1.6');
  glyph.setAttribute('stroke-linecap', 'round');
  if (severity === 'blocking') {
    shape.setAttribute('d', 'M5 1h6l4 4v6l-4 4H5l-4-4V5z');
    glyph.setAttribute('d', 'M8 4.5v4M8 11v.5');
  } else {
    shape.setAttribute('d', 'M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z');
    glyph.setAttribute('d', 'M8 7.2V11.5M8 4.6v.5');
  }
  svg.append(shape, glyph);
  return svg;
};

const rangeLabel = (start: number, end: number): string =>
  start === end ? `line ${start}` : `lines ${start}-${end}`;

const severityText = (severity: HxDiffFinding['severity']): string =>
  severity === 'blocking' ? 'Blocking' : 'Note';

class FindingBox extends WidgetType {
  constructor(
    private readonly placed: HxPlacedFinding,
    private readonly actionLabel: string,
  ) {
    super();
  }
  override eq(other: FindingBox): boolean {
    const a = this.placed.finding;
    const b = other.placed.finding;
    return (
      a.id === b.id &&
      a.severity === b.severity &&
      a.title === b.title &&
      a.detail === b.detail &&
      a.side === b.side &&
      a.startLine === b.startLine &&
      a.endLine === b.endLine &&
      this.placed.end === other.placed.end &&
      this.actionLabel === other.actionLabel
    );
  }
  override toDOM(view: EditorView): HTMLElement {
    const f = this.placed.finding;
    const box = document.createElement('div');
    box.className = `cm-finding-box cm-finding-${f.severity}`;
    box.setAttribute('role', 'group');
    box.setAttribute(
      'aria-label',
      `${severityText(f.severity)} finding on ${rangeLabel(f.startLine, f.endLine)}`,
    );
    const head = document.createElement('div');
    head.className = 'cm-finding-head';
    const severity = document.createElement('span');
    severity.className = 'cm-finding-severity';
    severity.append(icon(f.severity), document.createTextNode(severityText(f.severity)));
    const title = document.createElement('span');
    title.className = 'cm-finding-title';
    title.textContent = f.title;
    const range = document.createElement('span');
    range.className = 'cm-finding-range';
    range.textContent = `${f.side === 'original' ? 'old ' : ''}${rangeLabel(f.startLine, f.endLine)}`;
    head.append(severity, title, range);
    box.append(head);
    if (f.detail) {
      const detail = document.createElement('div');
      detail.className = 'cm-finding-detail';
      detail.textContent = f.detail;
      box.append(detail);
    }
    if (this.actionLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cm-finding-action';
      button.textContent = this.actionLabel;
      button.addEventListener('click', () => view.state.facet(handlersFacet)?.action(view, f));
      const actions = document.createElement('div');
      actions.className = 'cm-finding-actions';
      actions.append(button);
      box.append(actions);
    }
    return box;
  }
  override ignoreEvent(): boolean {
    return true;
  }
}

class FindingGutterMarker extends GutterMarker {
  override elementClass: string;
  constructor(private readonly severity: HxDiffFinding['severity']) {
    super();
    this.elementClass = `cm-finding-gutter cm-finding-gutter-${severity}`;
  }
  override eq(other: GutterMarker): boolean {
    return other instanceof FindingGutterMarker && other.severity === this.severity;
  }
}

interface Shown {
  readonly findings: readonly HxPlacedFinding[];
  readonly actionLabel: string;
  readonly decorations: DecorationSet;
}

const buildDecorations = (
  doc: EditorView['state']['doc'],
  findings: readonly HxPlacedFinding[],
  actionLabel: string,
): DecorationSet => {
  const ranges: Range<Decoration>[] = [];
  for (const placed of findings) {
    const { start, end } = placed;
    if (start < 1 || end < start || end > doc.lines) continue;
    if (placed.mark) {
      for (let n = start; n <= end; n++) {
        ranges.push(
          Decoration.line({
            class: `cm-finding-line cm-finding-line-${placed.finding.severity}`,
          }).range(doc.line(n).from),
        );
      }
    }
    // Side 1: before the comment boxes of the same line, which use a larger side.
    ranges.push(
      Decoration.widget({
        widget: new FindingBox(placed, actionLabel),
        block: true,
        side: 1,
      }).range(doc.line(end).to),
    );
  }
  return Decoration.set(ranges, true);
};

const buildMarkers = (
  doc: EditorView['state']['doc'],
  findings: readonly HxPlacedFinding[],
): RangeSet<GutterMarker> => {
  const lines = new Map<number, HxDiffFinding['severity']>();
  for (const { finding, start, end, mark } of findings) {
    if (!mark || start < 1 || end < start || end > doc.lines) continue;
    for (let n = start; n <= end; n++) {
      // A blocking finding wins over a note on the same line.
      if (lines.get(n) !== 'blocking') lines.set(n, finding.severity);
    }
  }
  const ranges = [...lines].map(([n, severity]) =>
    new FindingGutterMarker(severity).range(doc.line(n).from),
  );
  return RangeSet.of(ranges, true);
};

const field: StateField<Shown> = StateField.define<Shown>({
  create: () => ({ findings: [], actionLabel: '', decorations: Decoration.none }),
  update(value, tr) {
    let { findings, actionLabel } = value;
    let changed = false;
    for (const effect of tr.effects) {
      if (effect.is(setFindings)) {
        findings = effect.value.findings;
        actionLabel = effect.value.actionLabel;
        changed = true;
      }
    }
    if (!changed) return value;
    return {
      findings,
      actionLabel,
      decorations: buildDecorations(tr.state.doc, findings, actionLabel),
    };
  },
  provide: (f) => [
    EditorView.decorations.from(f, (v) => v.decorations),
    lineNumberMarkers.compute([f], (state) => buildMarkers(state.doc, state.field(f).findings)),
  ],
});

/**
 * Shows `findings` (already placed on this editor's lines) as boxes below their last line.
 * A non-empty `actionLabel` adds an action button to each box.
 */
export function showFindings(
  view: EditorView,
  findings: readonly HxPlacedFinding[],
  actionLabel: string,
): void {
  view.dispatch({ effects: setFindings.of({ findings, actionLabel }) });
}

/**
 * Review findings for one editor: a box with severity, title and detail below the last line of
 * each finding, the lines marked in the line-number gutter. The action button calls
 * `handlers.action`. Fed by {@link showFindings}.
 */
export function findingExtension(handlers: HxFindingHandlers): Extension {
  return [
    handlersFacet.of(handlers),
    field,
    EditorView.baseTheme({
      '.cm-finding-gutter-blocking': {
        boxShadow: 'inset 3px 0 0 var(--h-danger-color)',
        fontWeight: 'bold',
      },
      '.cm-finding-gutter-note': {
        boxShadow: 'inset 3px 0 0 var(--h-info-color, var(--h-primary-color))',
        fontStyle: 'italic',
      },
      '.cm-finding-line-blocking': { backgroundColor: 'var(--h-highlight-background)' },
      '.cm-finding-line-note': { backgroundColor: 'var(--h-highlight-background)' },
      '.cm-finding-box': {
        margin: '4px 8px 4px 48px',
        padding: '6px 8px',
        border: '1px solid var(--h-content-border-color)',
        borderLeft: '3px solid var(--h-info-color, var(--h-primary-color))',
        borderRadius: 'var(--h-border-radius, 4px)',
        backgroundColor: 'var(--h-content-background)',
        color: 'var(--h-text-color)',
        fontFamily: 'inherit',
      },
      '.cm-finding-box.cm-finding-blocking': {
        borderLeft: '3px solid var(--h-danger-color)',
      },
      '.cm-finding-head': { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
      '.cm-finding-severity': {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 'bold',
      },
      '.cm-finding-blocking .cm-finding-icon': { color: 'var(--h-danger-color)' },
      '.cm-finding-note .cm-finding-icon': {
        color: 'var(--h-info-color, var(--h-primary-color))',
      },
      '.cm-finding-title': { fontWeight: '600' },
      '.cm-finding-range': {
        color: 'var(--h-text-muted-color)',
        fontSize: '0.75em',
        marginLeft: 'auto',
      },
      '.cm-finding-detail': { whiteSpace: 'pre-wrap', marginTop: '4px' },
      '.cm-finding-actions': { marginTop: '6px' },
      '.cm-finding-action': {
        font: 'inherit',
        color: 'inherit',
        background: 'transparent',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        padding: '2px 10px',
        cursor: 'pointer',
      },
      '.cm-finding-action:focus-visible': {
        outline: '2px solid var(--h-primary-color)',
        outlineOffset: '1px',
      },
    }),
  ];
}
