import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardOrdersComponent } from '../card-orders/card-orders.component';
import { Order } from '../../../films/models/order';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../data.service';
import { AuthServiceService } from '../../../forms/services/auth-service.service';
import { DateTimeFormattingService } from '../../../films/services/date-time-formatting.service';

@Component({
  selector: 'app-list-orders',
  imports: [CardOrdersComponent],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css',
})
export class ListOrdersComponent implements OnInit, OnDestroy {
  listOrders: Order[] = [];
  subs: Subscription[] = [];
  userId!: number | null;

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthServiceService,
    private readonly dateFormatting: DateTimeFormattingService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    console.log(this.userId);
    this.getOrders();
  }

  getOrders(): void {
    // Appel pour récupérer la liste des réservations de l'utilisateur actif lors de l'initialisation du composant
    this.subs.push(
      this.dataService
        .getOrdersByUser(this.userId)
        .subscribe((orders: Order[]) => {
          this.listOrders = orders;
          console.log('Liste des réservations : ', this.listOrders);
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
