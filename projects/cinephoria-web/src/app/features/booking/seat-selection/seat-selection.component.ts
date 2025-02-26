import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seat-selection',
  imports: [NgFor],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent implements OnInit {
  seatsNumber: number = 0;
  rows: any[] = []; // Chaque ligne aura des sièges
  selectedSeats: any[] = [];
  subs: Subscription[] = [];
  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.getSeats();
  }

  getSeats() {
    // Récupérer les sièges depuis le backend (API)
    this.subs.push(
      this.dataService.getSeatsBySession(1).subscribe((seats) => {
        console.log('Nombre de sièges total : ', seats);
        this.seatsNumber = seats[0].places;
        console.log(this.seatsNumber);
      })
    );
  }

  createSeatLayout(seats: any[]) {}

  toggleSeatSelection(rowIndex: number, seatIndex: number) {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.reserved && !this.selectedSeats.includes(seat)) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
    }
  }

  confirmReservation() {
    // const selectedSeatIds = this.selectedSeats.map(seat => seat.id);
    // this.dataService.reserveSeats(selectedSeatIds).subscribe(response => {
    //   alert('Réservation confirmée');
    //   this.getSeats(); // Actualiser l'état des sièges après réservation
    // });
  }
}
