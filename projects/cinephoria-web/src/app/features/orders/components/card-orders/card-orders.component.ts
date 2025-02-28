import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { Order } from '../../../films/models/order';

@Component({
  selector: 'app-card-orders',
  imports: [NgFor],
  templateUrl: './card-orders.component.html',
  styleUrl: './card-orders.component.css',
})
export class CardOrdersComponent {
  items = input.required<Order[]>();
}
