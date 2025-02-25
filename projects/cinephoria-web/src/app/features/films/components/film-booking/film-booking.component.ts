import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { Session } from '../../models/session';
import { DateTimeFormattingService } from '../../services/date-time-formatting.service';

@Component({
  selector: 'app-film-booking',
  imports: [],
  templateUrl: './film-booking.component.html',
  styleUrl: './film-booking.component.css',
})
export class FilmBookingComponent implements OnInit {
  session: Session[] = [];

  subs: Subscription[] = [];

  sessionId: number | null = null;

  moviePoster: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly dateTimeFormatting: DateTimeFormattingService
  ) {}

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID de la séance sélectionnée :', this.sessionId);

    this.subs.push(
      this.dataService.getSessionById(this.sessionId).subscribe((session) => {
        console.log('Séance récupérée : ', session);
        this.session = session;
        // Formatage de la date
        this.dateTimeFormatting.dateFormatting(this.session);
        // Formatage de l'heure de début
        this.dateTimeFormatting.startHourFormatting(this.session);
        // Formatage de l'heure de fin
        this.dateTimeFormatting.endHourFormatting(this.session);
        this.moviePoster = this.session[0].moviePoster;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
