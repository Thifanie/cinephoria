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
  listFilms: any;
  subscription: Subscription | undefined;

  constructor(private readonly dataService: DataService) {}

  ngOnInit() {
    this.subscription = this.dataService.getFilms().subscribe((data) => {
      this.listFilms = data;
    });
    // this.subscription.add(filmSub);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
