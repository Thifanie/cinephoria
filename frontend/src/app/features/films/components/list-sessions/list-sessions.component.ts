import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardSessionsComponent } from '../card-sessions/card-sessions.component';
import { Session } from '../../models/session';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Film } from '../../models/film';
import { Room } from '../../models/room';
import { Quality } from '../../models/quality';
import { DateTimeFormattingService } from '../../services/date-time-formatting.service';

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
    private readonly route: ActivatedRoute,
    private readonly dateTimeFormatting: DateTimeFormattingService
  ) {}

  ngOnInit() {
    this.filmId = Number(this.route.snapshot.paramMap.get('id')); // Récupère l'ID du film

    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    this.subs = [
      // Souscription au BehaviorSubject pour récupérer la liste des films mise à jour
      this.dataService.films$.subscribe((films: Film[]) => {
        this.listFilms = films;
        this.filmTitle = this.listFilms.find(
          (film) => film.id === this.filmId
        )?.title;
      }),
      // Appel pour récupérer la liste des séances
      this.dataService.getSessions(this.filmId).subscribe((data: Session[]) => {
        console.log('Séances récupérées : ', data);
        this.listSessions = data;
        // Formatage de la date
        // this.dateTimeFormatting.dateFormatting(this.listSessions);
        // Formatage de l'heure de début
        // this.dateTimeFormatting.startHourFormatting(this.listSessions);
        // Formatage de l'heure de fin
        // this.dateTimeFormatting.endHourFormatting(this.listSessions);

        this.associateRoomQuality();
      }),

      // Appel pour récupérer la liste des salles de cinéma
      this.dataService.getRoom().subscribe((data: Room[]) => {
        console.log('Salles récupérées : ', data);
        this.listRooms = data;
        this.associateRoomQuality();
      }),
      // Appel pour récupérer la liste des qualités
      this.dataService.getQuality().subscribe((data: Quality[]) => {
        console.log('Qualités récupérées : ', data);
        this.listQualities = data;
        this.associateRoomQuality();
      }),
    ];
  }

  associateRoomQuality() {
    if (
      !this.listSessions.length ||
      !this.listRooms.length ||
      !this.listQualities.length
    ) {
      return; // Attendre que toutes les données soient chargées
    }

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
