import { Component, input } from '@angular/core';
import { Film } from '../../models/film';

@Component({
  selector: 'app-card-films',
  templateUrl: './card-films.component.html',
  styleUrl: './card-films.component.css',
})
export class CardFilmsComponent {
  items = input.required<Film[]>();

  // Méthode pour calculer le pourcentage de la largeur des étoiles
  calculateRating(note: number): number {
    let rating: number = (note / 5) * 100;
    return rating;
  }
}
