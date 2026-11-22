import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HELIX_CODE_VERSION } from '@gravionlabs/helix-code';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

interface Peer {
  readonly name: string;
  readonly range: string;
  readonly note: string;
}

/** Same lists as the peer section of `docs/HELIX-CODE.md`. */
const REQUIRED_PEERS: readonly Peer[] = [
  { name: '@angular/core', range: '>=22', note: 'Angular' },
  { name: '@angular/common', range: '>=22', note: 'Angular' },
  { name: '@angular/forms', range: '>=22', note: 'form binding of the editor' },
  { name: '@angular/cdk', range: '>=22', note: 'virtual scrolling of the commit graph' },
];

const CODEMIRROR_PEERS: readonly Peer[] = [
  { name: '@codemirror/state', range: '^6', note: 'main entry' },
  { name: '@codemirror/view', range: '^6', note: 'main entry' },
  { name: '@codemirror/language', range: '^6', note: 'main entry' },
  { name: '@codemirror/language-data', range: '^6', note: 'main entry' },
  { name: '@codemirror/merge', range: '^6', note: 'main entry' },
  { name: '@codemirror/commands', range: '^6', note: 'main entry' },
  { name: '@codemirror/search', range: '^6', note: 'main entry' },
  { name: '@lezer/highlight', range: '^1', note: 'main entry' },
];

/** The Code area: what `@gravionlabs/helix-code` is, how to install it, its entries and peers. */
@Component({
  selector: 'app-code-overview-demo',
  imports: [SourceTabsComponent],
  templateUrl: './code-overview-demo.html',
  styleUrl: './code-overview-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeOverviewDemo {
  protected readonly version = HELIX_CODE_VERSION;
  protected readonly installLine = 'pnpm add @gravionlabs/helix-code';
  protected readonly requiredPeers = REQUIRED_PEERS;
  protected readonly codemirrorPeers = CODEMIRROR_PEERS;
}
