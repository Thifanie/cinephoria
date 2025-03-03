import { Component } from '@angular/core';
import { ListOrdersComponent } from '../../features/orders/components/list-orders/list-orders.component';

@Component({
  selector: 'app-compte',
  imports: [ListOrdersComponent],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css',
})
export class CompteComponent {}
