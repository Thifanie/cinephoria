import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { Film } from '../../models/film';
import { CardFilmsComponent } from '../card-films/card-films.component';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { Type } from '../../models/type';

@Component({
  selector: 'app-list-films',
  imports: [CardFilmsComponent],
  templateUrl: './list-films.component.html',
  styleUrl: './list-films.component.css',
})
export class ListFilmsComponent implements OnInit, OnDestroy {
  listFilms: Film[] = [];
  subs: Subscription[] = [];
  selectedType = input<string>();

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    // Appel pour récupérer la liste des films lors de l'initialisation du composant

    this.subs.push(
      this.dataService.getFilms().subscribe((films: Film[]) => {
        this.listFilms = films;
        console.log(this.listFilms);
      })
    );
    console.log('selectedType de ListFilms : ', this.selectedType);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
