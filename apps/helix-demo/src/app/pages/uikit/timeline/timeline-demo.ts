import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HxButton,
  HxCard,
  HxTimeline,
  HxTimelineContent,
  HxTimelineMarker,
  HxTimelineOpposite,
} from '@gravionlabs/helix-ui';

interface OrderEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
  image?: string;
}

@Component({
  selector: 'app-timeline-demo',
  standalone: true,
  imports: [HxTimeline, HxTimelineContent, HxTimelineOpposite, HxTimelineMarker, HxButton, HxCard],
  templateUrl: './timeline-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './timeline-demo.scss',
})
export class TimelineDemo {
  readonly events1: OrderEvent[] = [
    {
      status: 'Ordered',
      date: '15/10/2020 10:30',
      icon: 'pi pi-shopping-cart',
      color: '#9C27B0',
      image: 'game-controller.jpg',
    },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-envelope', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' },
  ];

  readonly events2 = ['2020', '2021', '2022', '2023'];
}
