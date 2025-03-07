import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { Session } from '../../models/session';
import { DateTimeFormattingService } from '../../services/date-time-formatting.service';
import { SeatSelectionComponent } from '../../../booking/seat-selection/seat-selection.component';
import { Order } from '../../models/order';
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

  orderData!: Order;

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
          // Formatage de la date
          // this.dateTimeFormatting.dateFormatting(this.session);
          // Formatage de l'heure de début
          // this.dateTimeFormatting.startHourFormatting(this.session);
          // Formatage de l'heure de fin
          // this.dateTimeFormatting.endHourFormatting(this.session);
          this.moviePoster = this.session[0].moviePoster;
        })
    );
  }

  confirmReservation(selectedSeatsString: string) {
    const userId = this.authService.getUserIdFromToken();
    const formattedDate = this.dateTimeFormatting.dateTimeFormatting(
      new Date()
    );
    this.orderData = {
      idUser: userId,
      idFilm: this.session[0].idFilm,
      cinemaName: this.session[0].cinemaName,
      idSession: this.sessionId,
      roomName: this.session[0].roomName,
      date: formattedDate,
      viewed: false,
      placesNumber: selectedSeatsString,
      price: this.session[0].price,
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
    this.subs.push(
      this.dataService.reserveSeats(this.orderData).subscribe(() => {
        alert('Réservation confirmée');
        this.router.navigate(['compte']);
      })
    );
    console.log(this.orderData);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
