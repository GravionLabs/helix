import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';
import { HxMediaSection } from '../sections/media/media-section';

@Component({
  standalone: true,
  selector: 'app-media-demo',
  imports: [SourceTabsComponent, HxMediaSection],
  templateUrl: './media-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './media-demo.scss',
})
export class MediaDemo {}
