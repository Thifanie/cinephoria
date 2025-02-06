import { Component } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent {
  afficherFilm(): void {
    fetch('http://www.omdbapi.com/?apikey=[cceef769]&?t=captain')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur de récupération');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
