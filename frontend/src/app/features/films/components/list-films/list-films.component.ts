import { Component, OnDestroy, OnInit } from '@angular/core';
import { Film } from '../../models/film';
import { CardFilmsComponent } from '../card-films/card-films.component';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-list-films',
  imports: [CardFilmsComponent],
  templateUrl: './list-films.component.html',
  styleUrl: './list-films.component.css',
})
export class ListFilmsComponent implements OnInit, OnDestroy {
  listFilms: Film[] = [];
  subs: Subscription[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    this.subs.push(
      // Souscription au BehaviorSubject pour récupérer la liste mise à jour
      this.dataService.films$.subscribe((films: Film[]) => {
        this.listFilms = films;
        console.log(this.listFilms);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
