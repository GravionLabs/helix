import { Component } from '@angular/core';
import { BestSellingWidget } from './components/bestsellingwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { StatsWidget } from './components/statswidget';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsWidget,
    RecentSalesWidget,
    BestSellingWidget,
    RevenueStreamWidget,
    NotificationsWidget,
  ],
  template: `
    <div class="grid grid-cols-12 gap-8">
      <app-stats-widget class="contents" />
      <div class="col-span-12 xl:col-span-6">
        <app-recent-sales-widget />
        <app-best-selling-widget />
      </div>
      <div class="col-span-12 xl:col-span-6">
        <app-revenue-stream-widget />
        <app-notifications-widget />
      </div>
    </div>
  `,
})
export class Dashboard {}
