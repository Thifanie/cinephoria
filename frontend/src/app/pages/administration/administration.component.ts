import { Component, OnInit } from '@angular/core';
import { AddFilmComponent } from '../../features/administration/add-film/add-film.component';
import { UpdateFilmComponent } from '../../features/administration/update-film/update-film.component';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs';
import { Film } from '../../features/films/models/film';
import { Type } from '../../features/films/models/type';

@Component({
  selector: 'app-administration',
  imports: [AddFilmComponent, UpdateFilmComponent],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent implements OnInit {
  subs: Subscription[] = [];
  listFilms: Film[] = [];
  listTypes: Type[] = [];

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
    ];
  }
}
