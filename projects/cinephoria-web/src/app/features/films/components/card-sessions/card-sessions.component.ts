import { Component, Input, input } from '@angular/core';
import { Session } from '../../models/session';
import { NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-sessions',
  imports: [NgFor, NgClass],
  templateUrl: './card-sessions.component.html',
  styleUrl: './card-sessions.component.css',
})
export class CardSessionsComponent {
  constructor(private readonly router: Router) {}

  items = input.required<Session[]>();

  @Input() showButton: boolean = true;
  @Input() isRow: boolean = true;

  goToFilmBooking(id: number) {
    this.router.navigate(['reservation', id]);
  }
}
