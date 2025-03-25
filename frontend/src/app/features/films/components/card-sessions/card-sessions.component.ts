import { Component, Input } from '@angular/core';
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

  @Input() items: Session[] = [];
  @Input() showButton: boolean = true;
  @Input() isRow: boolean = true;

  goToFilmBooking(id: number) {
    console.log('goToFilmBooking called with id:', id);

    this.router.navigate(['reservation', id]);
  }
}
