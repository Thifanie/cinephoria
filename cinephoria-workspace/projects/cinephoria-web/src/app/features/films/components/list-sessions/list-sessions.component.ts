import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CardSessionsComponent } from '../card-sessions/card-sessions.component';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Film } from '../../models/film';
import { Room } from '../../models/room';
import { Quality } from '../../models/quality';

@Component({
  selector: 'app-list-sessions',
  imports: [CardSessionsComponent],
  templateUrl: './list-sessions.component.html',
  styleUrl: './list-sessions.component.css',
})
export class ListSessionsComponent implements OnInit, OnDestroy {
  listSessions: Session[] = [];
  subscription: Subscription = new Subscription();
  subs: Subscription[] = [];
  filmId!: number;
  listFilms: Film[] = [];
  filmTitle!: string | undefined;
  sessionDate!: string;
  listRooms: Room[] = [];
  listQualities: Quality[] = [];
  idQuality!: number | undefined;

  constructor(
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filmId = Number(this.route.snapshot.paramMap.get('id')); // Récupère l'ID du film

    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    this.subs = [
      // Souscription au BehaviorSubject pour récupérer la liste des films mise à jour
      this.dataService.films$.subscribe((films) => {
        this.listFilms = films;
        this.filmTitle = this.listFilms.find(
          (film) => film.id === this.filmId
        )?.title;
      }),
      // Appel pour récupérer la liste des séances
      this.dataService.getSessions(this.filmId).subscribe((data) => {
        console.log('Séances récupérées : ', data);
        this.listSessions = data;
      }),
      // Appel pour récupérer la liste des salles de cinéma
      this.dataService.getRoom().subscribe((data) => {
        console.log('Salles récupérées : ', data);
        this.listRooms = data;
      }),
      // Appel pour récupérer la liste des qualités
      this.dataService.getQuality().subscribe((data) => {
        console.log('Qualités récupérées : ', data);
        this.listQualities = data;
      }),
    ];

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

    // Pour chaque session, on récupère l'id de la qualité de la salle correspondante
    this.listSessions.forEach((session) => {
      this.idQuality = this.listRooms.find(
        (room) => room.name === session.roomName
      )?.idQuality;
      console.log(this.idQuality);

      // On stocke la qualité de la séance dans listSessions
      session.quality = this.listQualities.find(
        (quality) => quality.id == this.idQuality
      )?.quality;
      console.log(session.quality);

      // On stocke le prix de la séance dans listSessions
      session.price = this.listQualities.find(
        (quality) => quality.id == this.idQuality
      )?.price;
      console.log(session.price);
    });
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
