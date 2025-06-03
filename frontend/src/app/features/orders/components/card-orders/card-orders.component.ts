import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { Order } from '../../../films/models/order';
import { CinemaNamePipe } from '../../../../pipes/cinema-name.pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Opinion } from '../../../films/models/opinion';
import { DataService } from '../../../../data.service';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';

@Component({
  selector: 'app-card-orders',
  imports: [NgFor, NgIf, CinemaNamePipe, FormsModule, StarsRatingComponent],
  templateUrl: './card-orders.component.html',
  styleUrl: './card-orders.component.css',
})
export class CardOrdersComponent implements OnInit {
  @Input() listOrders: Order[] = [];
  rating: number = 0;

  opinionDescription: string = '';
  subs: Subscription[] = [];
  allStars: HTMLImageElement[] = [];

  constructor(
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      // Maj de la variable viewed en fonction de la date d'aujourd'hui
      this.listOrders.forEach((order) => {
        const today = new Date();
        const orderDate = new Date(`${order.sessionDate} 00:00:00`);
        if (orderDate < today) {
          order.viewed = true;
        }
      });
    }, 500);
  }

  onRatingReceived(rating: number) {
    console.log('Note reçue du composant enfant :', rating);
    this.rating = rating;
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
    console.log(opinionData);

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
