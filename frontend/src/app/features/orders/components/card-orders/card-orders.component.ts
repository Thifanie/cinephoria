import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, input, OnInit, Renderer2 } from '@angular/core';
import { Order } from '../../../films/models/order';
import { CinemaNamePipe } from '../../../../pipes/cinema-name.pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Opinion } from '../../../films/models/opinion';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-card-orders',
  imports: [NgFor, NgIf, CinemaNamePipe, FormsModule],
  templateUrl: './card-orders.component.html',
  styleUrl: './card-orders.component.css',
})
export class CardOrdersComponent implements OnInit {
  items = input.required<Order[]>();
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
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const allStars: HTMLImageElement[] =
        this.el.nativeElement.querySelectorAll('#stars-outer img');
      this.stars = Array.from(allStars).map((star) => ({
        element: star,
        isFilled: false, // Initialiser isFilled à false pour chaque étoile
      }));
      console.log("Tableau d'étoiles initial : ", this.stars);
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
    console.log('Etoile sélectionnée : ', starSelected);
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
      console.log("Tableau d'étoiles après sélection : ", this.stars);
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
    console.log('Note : ', this.rating);
    return this.rating;
  }

  submitOpinion(userId: number | null, filmId: number): void {
    const opinionData: Opinion = {
      idUser: userId,
      idFilm: filmId,
      note: this.rating,
      description: this.opinionDescription,
    };
    console.log("Données de l'avis : ", opinionData);

    this.subs.push(
      this.dataService.postOpinion(opinionData).subscribe((data: Opinion) => {
        console.log('Avis ajouté : ', data);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
