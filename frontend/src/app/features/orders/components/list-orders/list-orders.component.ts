import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardOrdersComponent } from '../card-orders/card-orders.component';
import { Order } from '../../../films/models/order';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../../../../backend/data.service';
import { AuthServiceService } from '../../../forms/services/auth-service.service';

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
    private readonly authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserIdFromToken();
    console.log(this.userId);
    // Appel pour récupérer la liste des réservations de l'utilisateur actif lors de l'initialisation du composant
    this.subs.push(
      this.dataService
        .getOrdersByUser(this.userId)
        .subscribe((orders: Order[]) => {
          this.listOrders = orders.toSorted(
            (
              a: { date: string | number | Date },
              b: { date: string | number | Date }
            ) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ); // Tri des réservations de la plus récente à la plus ancienne
          console.log('Liste des réservations : ', this.listOrders);
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
