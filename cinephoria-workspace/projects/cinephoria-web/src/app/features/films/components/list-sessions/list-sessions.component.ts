import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardSessionsComponent } from '../card-sessions/card-sessions.component';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-sessions',
  imports: [CardSessionsComponent],
  templateUrl: './list-sessions.component.html',
  styleUrl: './list-sessions.component.css',
})
export class ListSessionsComponent implements OnInit, OnDestroy {
  listSessions: Session[] = [];
  subscription: Subscription = new Subscription();
  filmId!: number;

  constructor(
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filmId = Number(this.route.snapshot.paramMap.get('id')); // Récupère l'ID du film
    console.log('ID du film sélectionné :', this.filmId);

    // Appel pour récupérer la liste des séances lors de l'initialisation du composant
    this.dataService.getSessions(this.filmId).subscribe((data) => {
      console.log('Séances récupérées : ', data);
      this.listSessions = data;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
