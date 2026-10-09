import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxAccordion,
  HxAccordionContent,
  HxAccordionHeader,
  HxAccordionPanel,
  type HxAccordionValue,
  HxButton,
  HxCard,
  HxFieldset,
  HxInput,
  HxPanel,
  HxToolbar,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` containers: Card, Panel, Fieldset, Accordion, Toolbar. */
@Component({
  selector: 'app-hx-containers-demo',
  standalone: true,
  imports: [
    HxCard,
    HxPanel,
    HxFieldset,
    HxInput,
    HxButton,
    HxAccordion,
    HxAccordionPanel,
    HxAccordionHeader,
    HxAccordionContent,
    HxToolbar,
  ],
  templateUrl: './hx-containers-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-containers-demo.scss',
})
export class HxContainersDemo {
  readonly collapsed = signal(false);
  readonly open = signal<HxAccordionValue>('a');
  readonly openMany = signal<HxAccordionValue>(['x']);
  readonly fieldsetCollapsed = signal(false);
}
