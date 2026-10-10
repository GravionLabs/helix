import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HxAccordion,
  HxAccordionContent,
  HxAccordionHeader,
  HxAccordionPanel,
  HxButton,
  HxDivider,
  HxFieldset,
  HxIconField,
  HxInput,
  HxInputIcon,
  type HxMenuItem,
  HxPanel,
  HxSplitButton,
  HxTab,
  HxTabList,
  HxTabPanel,
  HxTabPanels,
  HxTabs,
  HxToolbar,
} from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { HxContainersSection } from '../sections/containers/containers-section';

/** Panels on `@gravionlabs/helix-ui` (the splitter is not part of it). */
@Component({
  selector: 'app-panels-demo',
  standalone: true,
  imports: [
    SourceTabsComponent,
    HxContainersSection,

    FormsModule,
    HxToolbar,
    HxButton,
    HxSplitButton,
    HxAccordion,
    HxAccordionPanel,
    HxAccordionHeader,
    HxAccordionContent,
    HxFieldset,
    HxInput,
    HxIconField,
    HxInputIcon,
    HxDivider,
    HxPanel,
    HxTabs,
    HxTabList,
    HxTab,
    HxTabPanels,
    HxTabPanel,
  ],
  templateUrl: './panels-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './panels-demo.scss',
})
export class PanelsDemo {
  readonly items: HxMenuItem[] = [
    { label: 'Save', icon: 'pi pi-check' },
    { label: 'Update', icon: 'pi pi-upload' },
    { label: 'Delete', icon: 'pi pi-trash' },
    { label: 'Home Page', icon: 'pi pi-home' },
  ];

  readonly texts = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  ];
}
