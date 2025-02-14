import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardSessionsComponent } from '../card-sessions/card-sessions.component';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Film } from '../../models/film';

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
  listFilms: Film[] = [];
  filmTitle!: string | undefined;
  sessionDate!: string;

  constructor(
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filmId = Number(this.route.snapshot.paramMap.get('id')); // Récupère l'ID du film

    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    // Souscription au BehaviorSubject pour récupérer la liste mise à jour
    this.subscription = this.dataService.films$.subscribe((films) => {
      this.listFilms = films;
      this.filmTitle = this.listFilms.find(
        (film) => film.id === this.filmId
      )?.title;
    });

    // Appel pour récupérer la liste des séances lors de l'initialisation du composant
    this.dataService.getSessions(this.filmId).subscribe((data) => {
      console.log('Séances récupérées : ', data);
      this.listSessions = data;

      // Formatage de la date
      this.listSessions.forEach(
        (session) => (session.date = new Date(session.date))
      );
      this.listSessions.forEach(
        (session) =>
          (session.formatedDate = session.date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }))
      );

      // Formatage de l'heure de début
      this.listSessions.forEach(
        (session) => (session.formatedStartHour = session.startHour.slice(0, 5))
      );

      // Formatage de l'heure de fin
      this.listSessions.forEach(
        (session) => (session.formatedEndHour = session.endHour.slice(0, 5))
      );
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
