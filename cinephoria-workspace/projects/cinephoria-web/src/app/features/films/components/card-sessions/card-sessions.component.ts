import { Component, Input, input } from '@angular/core';
import { Session } from '../../models/session';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-card-sessions',
  imports: [NgFor],
  templateUrl: './card-sessions.component.html',
  styleUrl: './card-sessions.component.css',
})
export class CardSessionsComponent {
  items = input.required<Session[]>();
}
