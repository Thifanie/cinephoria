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
import { AuthServiceService } from '../../features/forms/services/auth-service.service';

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
    private readonly dateTimeFormatting: DateTimeFormattingService,
    private readonly authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.subs = [
      this.dataService.getCinema().subscribe((data: Cinema[]) => {
        console.log('Cinémas récupérés : ', data);
        this.listCinemas = data;
      }),
      this.dataService.getFilms().subscribe((films: Film[]) => {
        this.listFilms = films;
        console.log('Films récupérés', this.listFilms);
      }),
    ];
  }

  selectedCinema: Cinema | null = null;

  selectCinema(cinema: Cinema): void {
    this.selectedCinema = cinema;
    this.selectedFilm = null; // Réinitialise le film sélectionné

    // Appel pour récupérer les séances du cinéma sélectionné
    this.subs.push(
      this.dataService
        .getSessionsByCinema(cinema.id)
        .subscribe((sessions: Session[]) => {
          console.log('Séances récupérées pour le cinéma : ', sessions);
          this.listSessions = sessions;
        })
    );
  }

  selectedFilm: Film | null = null;

  selectFilm(film: Film): void {
    this.selectedFilm = film;
    this.selectedCinema = null; // Réinitialise le cinéma sélectionné

    // Appel pour récupérer les séances du film sélectionné
    this.subs.push(
      this.dataService
        .getSessions(this.selectedFilm.id)
        .subscribe((sessions: Session[]) => {
          console.log('Séances récupérées pour le film : ', sessions);
          this.listSessions = sessions;
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
