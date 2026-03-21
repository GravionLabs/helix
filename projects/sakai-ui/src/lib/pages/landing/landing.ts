import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { GvFeaturesWidget } from './components/features-widget/features-widget';
import { GvFooterWidget } from './components/footer-widget/footer-widget';
import { GvHeroWidget } from './components/hero-widget/hero-widget';
import { GvHighlightsWidget } from './components/highlights-widget/highlights-widget';
import { GvPricingWidget } from './components/pricing-widget/pricing-widget';
import { GvTopbarWidget } from './components/topbar-widget/topbar-widget';

@Component({
  selector: 'gv-landing',
  standalone: true,
  imports: [
    RouterModule,
    GvTopbarWidget,
    GvHeroWidget,
    GvFeaturesWidget,
    GvHighlightsWidget,
    GvPricingWidget,
    GvFooterWidget,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class GvLanding {}
