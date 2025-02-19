import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../data.service';
import { Cinema } from '../../features/films/models/cinema';
import { NgFor, NgIf } from '@angular/common';
import { Film } from '../../features/films/models/film';
import { Session } from '../../features/films/models/session';
import { CardSessionsComponent } from '../../features/films/components/card-sessions/card-sessions.component';
import { DateTimeFormattingService } from '../../features/films/services/date-time-formatting.service';
import { Room } from '../../features/films/models/room';
import { Quality } from '../../features/films/models/quality';
import { CinemaNamePipe } from '../../pipes/cinema-name.pipe';

@Component({
  selector: 'app-reservation',
  imports: [NgFor, NgIf, CardSessionsComponent, CinemaNamePipe],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  listCinemas: Cinema[] = [];
  listFilms: Film[] = [];
  listSessions: Session[] = [];
  subscription: Subscription = new Subscription();
  filmId!: number;
  filmTitle!: string | undefined;
  sessionDate!: string;
  listRooms: Room[] = [];
  listQualities: Quality[] = [];
  idQuality!: number | undefined;

  constructor(
    private readonly dataService: DataService,
    private readonly dateTimeFormatting: DateTimeFormattingService
  ) {}

  ngOnInit() {
    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    this.subs = [
      this.dataService.getCinema().subscribe((data) => {
        console.log('Cinémas récupérés : ', data);
        this.listCinemas = data;
      }),
      this.dataService.films$.subscribe((films) => {
        this.listFilms = films;
        console.log('Films récupérés', this.listFilms);
      }),
    ];
  }

  selectedCinema: Cinema | null = null;

  selectCinema(cinema: Cinema): void {
    this.selectedCinema = cinema;

    // Appel pour récupérer les séances du cinéma sélectionné
    this.subs.push(
      this.dataService.getSessionsByCinema(cinema.id).subscribe((sessions) => {
        console.log('Séances récupérées pour le cinéma : ', sessions);
        this.listSessions = sessions;
        // Formatage des dates et heures
        this.dateTimeFormatting.dateFormatting(this.listSessions);
        this.dateTimeFormatting.startHourFormatting(this.listSessions);
        this.dateTimeFormatting.endHourFormatting(this.listSessions);

        this.associateRoomQuality();
      }),
      // Appel pour récupérer la liste des salles de cinéma
      this.dataService.getRoom().subscribe((data) => {
        console.log('Salles récupérées : ', data);
        this.listRooms = data;
        this.associateRoomQuality();
      }),
      // Appel pour récupérer la liste des qualités
      this.dataService.getQuality().subscribe((data) => {
        console.log('Qualités récupérées : ', data);
        this.listQualities = data;
        this.associateRoomQuality();
      })
    );
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
