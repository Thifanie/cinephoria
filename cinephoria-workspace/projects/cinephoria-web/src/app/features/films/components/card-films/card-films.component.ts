import { Component, input } from '@angular/core';
import { Film } from '../../models/film';

@Component({
  selector: 'app-card-films',
  templateUrl: './card-films.component.html',
  styleUrl: './card-films.component.css',
})
export class CardFilmsComponent {
  items = input.required<Film[]>();
}
