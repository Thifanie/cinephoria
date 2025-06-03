import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-stars-rating',
  imports: [],
  templateUrl: './stars-rating.component.html',
  styleUrl: './stars-rating.component.css',
})
export class StarsRatingComponent implements OnInit {
  @ViewChildren('starRef') starElements!: QueryList<
    ElementRef<HTMLImageElement>
  >;
  stars: {
    element: HTMLImageElement;
    isFilled: boolean;
  }[] = []; // Tableau pour suivre l'état de chaque étoile
  rating: number = 0;

  @Output() ratingSelected = new EventEmitter<number>();

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.stars = this.starElements.toArray().map((el) => ({
        element: el.nativeElement,
        isFilled: false, // Initialiser isFilled à false pour chaque étoile
      }));
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
      this.stars.length > 0 &&
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
    } else if (this.stars.length > 0 && starSelected?.isFilled) {
      // Clic sur une étoile remplie
      starSelected.isFilled = false;
      Array.from(allStars).forEach((img: HTMLImageElement, index: number) => {
        this.renderer.setAttribute(img, 'src', 'assets/emptyStar.png');
      });
      this.rating = 0;
    } else if (
      this.stars.length > 0 &&
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
    this.ratingSelected.emit(this.rating); // <-- Envoie au parent

    return this.rating;
  }
}
