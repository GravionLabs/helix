import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'gv-footer-widget',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer-widget.html',
  styleUrl: './footer-widget.scss',
})
export class GvFooterWidget {
  constructor(public router: Router) {}
}
