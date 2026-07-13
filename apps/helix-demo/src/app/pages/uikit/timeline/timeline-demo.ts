import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { CardModule } from '@gravionlabs/helix/card';
import { TimelineModule } from '@gravionlabs/helix/timeline';

@Component({
  selector: 'app-timeline-demo',
  standalone: true,
  imports: [CommonModule, TimelineModule, ButtonModule, CardModule],
  templateUrl: './timeline-demo.html',
  styleUrl: './timeline-demo.scss',
})
export class TimelineDemo implements OnInit {
  events1: any[] = [];

  events2: any[] = [];

  ngOnInit() {
    this.events1 = [
      {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: 'pi pi-shopping-cart',
        color: '#9C27B0',
        image: 'game-controller.jpg',
      },
      {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: 'pi pi-cog',
        color: '#673AB7',
      },
      {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: 'pi pi-envelope',
        color: '#FF9800',
      },
      {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: 'pi pi-check',
        color: '#607D8B',
      },
    ];

    this.events2 = ['2020', '2021', '2022', '2023'];
  }
}
