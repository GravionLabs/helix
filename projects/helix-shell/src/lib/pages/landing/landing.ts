import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { HelixFeaturesWidget } from './components/features-widget/features-widget';
import { HelixFooterWidget } from './components/footer-widget/footer-widget';
import { HelixHeroWidget } from './components/hero-widget/hero-widget';
import { HelixHighlightsWidget } from './components/highlights-widget/highlights-widget';
import { HelixPricingWidget } from './components/pricing-widget/pricing-widget';
import { HelixTopbarWidget } from './components/topbar-widget/topbar-widget';

@Component({
  selector: 'helix-landing',
  standalone: true,
  imports: [
    RouterModule,
    HelixTopbarWidget,
    HelixHeroWidget,
    HelixFeaturesWidget,
    HelixHighlightsWidget,
    HelixPricingWidget,
    HelixFooterWidget,
    RippleModule,
    StyleClassModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class HelixLanding {}
