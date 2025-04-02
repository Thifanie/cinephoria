import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Order } from '../../../films/models/order';
import { CinemaNamePipe } from '../../../../pipes/cinema-name.pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Opinion } from '../../../films/models/opinion';
import { DataService } from '../../../../data.service';
import { DateTimeFormattingService } from '../../../films/services/date-time-formatting.service';

@Component({
  selector: 'app-card-orders',
  imports: [NgFor, NgIf, CinemaNamePipe, FormsModule],
  templateUrl: './card-orders.component.html',
  styleUrl: './card-orders.component.css',
})
export class CardOrdersComponent implements OnInit {
  @Input() listOrders: Order[] = [];
  rating: number = 0;
  stars: {
    element: HTMLImageElement;
    isFilled: boolean;
  }[] = []; // Tableau pour suivre l'état de chaque étoile
  opinionDescription: string = '';
  subs: Subscription[] = [];

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private readonly dataService: DataService,
    private readonly dateTimeFormattingService: DateTimeFormattingService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const allStars: HTMLImageElement[] =
        this.el.nativeElement.querySelectorAll('#stars-outer img');
      this.stars = Array.from(allStars).map((star) => ({
        element: star,
        isFilled: false, // Initialiser isFilled à false pour chaque étoile
      }));

      // Maj de la variable viewed en fonction de la date d'aujourd'hui
      this.listOrders.forEach((order) => {
        const today = new Date();
        const orderDate = this.dateTimeFormattingService.stringDateFormatting(
          order.sessionDate
        );
        console.log('Date séance :', order.sessionDate);
        console.log('Date du jour :', orderDate);
        if (orderDate < today) {
          order.viewed = true;
        }
      });
    }, 500);
  }

  fillStars(event: MouseEvent): void {
    const star = event.target as HTMLImageElement;
    const allStars = document
      .getElementById('stars-outer')
      ?.getElementsByTagName('img');
    const isAnyStarFilled = this.stars.some((star) => star.isFilled === true);

    if (allStars && !isAnyStarFilled) {
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        if (index <= Array.from(allStars).indexOf(star)) {
          this.renderer.setAttribute(img, 'src', 'assets/filledStar.png');
          // Les étoiles situées avant l'étoile survolée sont également remplies
        }
      });
    }
  }

  resetStars(event: MouseEvent): void {
    const allStars = document
      .getElementById('stars-outer')
      ?.getElementsByTagName('img');
    const isAnyStarFilled = this.stars.some((star) => star.isFilled === true);

    if (allStars && !isAnyStarFilled) {
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        this.renderer.setAttribute(img, 'src', 'assets/emptyStar.png');
      });
    }
  }

  setRating(event: MouseEvent, rating: number): number {
    const star = event.target as HTMLImageElement;
    const allStars: HTMLImageElement[] =
      this.el.nativeElement.querySelectorAll('#stars-outer img');
    const starSelected = this.stars.find(
      (star) => star.element === (event.target as HTMLImageElement)
    );
    const isAnyStarFilled = this.stars.some((star) => star.isFilled === true);

    if (
      allStars &&
      starSelected &&
      !starSelected?.isFilled &&
      !isAnyStarFilled
    ) {
      // Clic sur une étoile vide et aucune autre étoile remplie
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        if (index <= Array.from(allStars).indexOf(star)) {
          this.renderer.setAttribute(img, 'src', 'assets/filledStar.png');
          // Les étoiles situées avant l'étoile survolée sont également remplies
        }
      });
      starSelected.isFilled = true;
      this.rating = rating;
    } else if (allStars && starSelected?.isFilled) {
      // Clic sur une étoile remplie
      starSelected.isFilled = false;
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        this.renderer.setAttribute(img, 'src', 'assets/emptyStar.png');
      });
      this.rating = 0;
    } else if (
      allStars &&
      starSelected &&
      !starSelected?.isFilled &&
      isAnyStarFilled
    ) {
      const filledStar = this.stars.find((star) => star.isFilled === true);
      if (filledStar) {
        filledStar.isFilled = false;
      }
      starSelected.isFilled = true;
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        if (index <= Array.from(allStars).indexOf(star)) {
          this.renderer.setAttribute(img, 'src', 'assets/filledStar.png');
          // Les étoiles situées avant l'étoile survolée sont également remplies
        } else {
          this.renderer.setAttribute(img, 'src', 'assets/emptyStar.png');
        }
      });
      this.rating = rating;
    }
    // Clic sur une étoile vide et autre étoile remplie
    return this.rating;
  }

  @Output() opinionSubmitted = new EventEmitter<void>(); // Événement pour informer le parent

  submitOpinion(orderId: number, userId: number | null, filmId: number): void {
    const opinionData: Opinion = {
      idOrder: orderId,
      idUser: userId,
      idFilm: filmId,
      note: this.rating,
      description: this.opinionDescription,
    };

    this.subs.push(
      this.dataService.postOpinion(opinionData).subscribe((data: Opinion) => {
        alert('Votre avis a bien été envoyée.');
        this.opinionSubmitted.emit(); // Émet l'événement vers le parent après l'ajout de l'avis
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
