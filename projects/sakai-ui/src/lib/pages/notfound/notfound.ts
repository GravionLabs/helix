import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GvFloatingConfigurator } from '../../layout/components/floating-configurator/floating-configurator';

@Component({
  selector: 'gv-notfound',
  standalone: true,
  imports: [RouterModule, GvFloatingConfigurator, ButtonModule],
  templateUrl: './notfound.html',
  styleUrl: './notfound.scss',
})
export class GvNotfound {}
