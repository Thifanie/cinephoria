import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Subscription } from 'rxjs';
import { Film } from '../../features/films/models/film';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [NgFor, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit {
  [x: string]: any;
  constructor(private readonly dataService: DataService) {}

  listFilms: Film[] = [];
  subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription = this.dataService
      .getFilms()
      .subscribe((films: Film[]) => {
        this.listFilms = films;
        console.log(this.listFilms);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
