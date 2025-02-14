import { Component, input } from '@angular/core';
import { Film } from '../../models/film';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-films',
  templateUrl: './card-films.component.html',
  styleUrl: './card-films.component.css',
  imports: [CommonModule, NgFor],
})
export class CardFilmsComponent {
  items = input.required<Film[]>();

  // Méthode pour calculer le pourcentage de la largeur des étoiles
  calculateRating(note: number): number {
    let rating: number = (note / 5) * 100;
    return rating;
  }

  constructor(private readonly router: Router) {}

  goToFilmSessions(id: number) {
    this.router.navigate(['sessions', id]);
  }
}
