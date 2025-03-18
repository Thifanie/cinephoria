import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddFilmComponent } from '../../features/administration/add-film/add-film.component';
import { UpdateFilmComponent } from '../../features/administration/update-film/update-film.component';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs';
import { Film } from '../../features/films/models/film';
import { Type } from '../../features/films/models/type';
import { AddSessionComponent } from '../../features/administration/add-session/add-session.component';
import { Cinema } from '../../features/films/models/cinema';

@Component({
  selector: 'app-administration',
  imports: [AddFilmComponent, UpdateFilmComponent, AddSessionComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  listFilms: Film[] = [];
  listTypes: Type[] = [];
  listCinemas: Cinema[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.subs = [
      this.dataService.getFilms().subscribe((films: Film[]) => {
        if (films && films.length > 0) {
          this.listFilms = films;
          console.log('Films récupérés', this.listFilms);
        }
      }),
      // Récupérer les genres de films
      this.dataService.getType().subscribe((data: Type[]) => {
        console.log('Types récupérés : ', data);
        this.listTypes = data;
      }),
      this.dataService.getCinema().subscribe((data: Cinema[]) => {
        console.log('Cinémas récupérés : ', data);
        this.listCinemas = data;
      }),
    ];
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
