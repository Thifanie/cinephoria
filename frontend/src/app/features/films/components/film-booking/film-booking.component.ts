import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { Session } from '../../models/session';
import { DateTimeFormattingService } from '../../services/date-time-formatting.service';
import { SeatSelectionComponent } from '../../../booking/seat-selection/seat-selection.component';
import { AuthServiceService } from '../../../forms/services/auth-service.service';

@Component({
  selector: 'app-film-booking',
  imports: [SeatSelectionComponent],
  templateUrl: './film-booking.component.html',
  styleUrl: './film-booking.component.css',
})
export class FilmBookingComponent implements OnInit {
  session: Session[] = [];

  subs: Subscription[] = [];

  sessionId: number | null = null;

  moviePoster: string = '';

  orderData!: {
    idUser: number | null;
    idFilm: number;
    cinemaName: string;
    idSession: number | null;
    roomName: string;
    date: string;
    viewed: false;
    placesNumber: string;
    price: number | undefined;
    moviePoster: string;
    startHour: Date;
    endHour: Date;
    description: string;
    actors: string;
    title: string;
    sessionDate: string;
    quality: string;
    opinionSent: false;
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly dateTimeFormatting: DateTimeFormattingService,
    private readonly authService: AuthServiceService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID de la séance sélectionnée :', this.sessionId);

    this.subs.push(
      this.dataService
        .getSessionById(this.sessionId)
        .subscribe((session: Session[]) => {
          console.log('Séance récupérée : ', session);
          this.session = session;
          this.moviePoster = this.session[0].moviePoster;
        })
    );
  }

  confirmReservation(selectedSeatsString: string) {
    const userId = this.authService.getUserIdFromToken();
    const formattedDate = this.dateTimeFormatting.dateTimeFormatting(
      new Date()
    );
    const totalNumberOfSeats = selectedSeatsString.split(', ').length;
    if (this.session[0].price) {
      const totalPrice = this.session[0].price * totalNumberOfSeats;
      this.orderData = {
        idUser: userId,
        idFilm: this.session[0].idFilm,
        cinemaName: this.session[0].cinemaName,
        idSession: this.sessionId,
        roomName: this.session[0].roomName,
        date: formattedDate,
        viewed: false,
        placesNumber: selectedSeatsString,
        price: totalPrice,
        moviePoster: '',
        startHour: new Date(),
        endHour: new Date(),
        description: '',
        actors: '',
        title: '',
        sessionDate: '',
        quality: '',
        opinionSent: false,
      };
    }

    this.subs.push(
      this.dataService.reserveSeats(this.orderData).subscribe(() => {
        alert('Réservation confirmée');
        this.router.navigate(['compte']);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
