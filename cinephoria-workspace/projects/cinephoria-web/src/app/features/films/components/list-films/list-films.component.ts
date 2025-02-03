import { Component } from '@angular/core';
import { Film } from '../../models/film';
import { CardFilmsComponent } from '../card-films/card-films.component';

@Component({
  selector: 'app-list-films',
  imports: [CardFilmsComponent],
  templateUrl: './list-films.component.html',
  styleUrl: './list-films.component.css',
})
export class ListFilmsComponent {
  listFilms: Film[] = [
    {
      titre: 'Avengers',
      genre: ['Science-fiction', 'Super-héros'],
      acteurs: [
        'Robert Downey Jr.',
        'Chris Evans',
        'Mark Ruffalo',
        'Chris Hemsworth',
        'Scarlett Johansson',
        'Jeremy Renner',
        'Samuel L. Jackson',
      ],
      description:
        "Lorsque Nick Fury, le directeur du S.H.I.E.L.D., l'organisation qui préserve la paix au plan mondial, cherche à former une équipe de choc pour empêcher la destruction du monde, Iron Man, Hulk, Thor, Captain America, Hawkeye et Black Widow répondent présents. Les Avengers ont beau constituer la plus fantastique des équipes, il leur reste encore à apprendre à travailler ensemble, et non les uns contre les autres, d'autant que le redoutable Loki a réussi à accéder au Cube Cosmique et à son pouvoir illimité...",
      ageMinimum: 12,
      coupDeCoeur: true,
      note: 4.1,
    },
    {
      titre: 'Harry Potter',
      genre: ['Science-fiction', 'Super-héros'],
      acteurs: [
        'Robert Downey Jr.',
        'Chris Evans',
        'Mark Ruffalo',
        'Chris Hemsworth',
        'Scarlett Johansson',
        'Jeremy Renner',
        'Samuel L. Jackson',
      ],
      description:
        "Lorsque Nick Fury, le directeur du S.H.I.E.L.D., l'organisation qui préserve la paix au plan mondial, cherche à former une équipe de choc pour empêcher la destruction du monde, Iron Man, Hulk, Thor, Captain America, Hawkeye et Black Widow répondent présents. Les Avengers ont beau constituer la plus fantastique des équipes, il leur reste encore à apprendre à travailler ensemble, et non les uns contre les autres, d'autant que le redoutable Loki a réussi à accéder au Cube Cosmique et à son pouvoir illimité...",
      ageMinimum: 12,
      coupDeCoeur: true,
      note: 4.1,
    },
  ];
}
