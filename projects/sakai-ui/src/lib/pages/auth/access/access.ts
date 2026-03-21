import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { GvFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'gv-access',
  standalone: true,
  imports: [ButtonModule, RouterModule, RippleModule, GvFloatingConfigurator],
  templateUrl: './access.html',
  styleUrl: './access.scss',
})
export class GvAccess {}
