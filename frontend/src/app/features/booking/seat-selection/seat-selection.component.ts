import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DataService } from '../../../data.service';
import { Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../films/models/session';

@Component({
  selector: 'app-seat-selection',
  imports: [NgFor, NgIf],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent implements OnInit {
  seatsNumber: number = 0;
  selectedSeats: string[] = [];
  subs: Subscription[] = [];
  row!: HTMLElement;
  isBooked = false; // Variable pour savoir si le siège est réservé
  seats: {
    element: HTMLImageElement;
    isBooked: boolean;
    isSelected: boolean;
  }[] = []; // Tableau pour suivre l'état de chaque siège
  reservedSeats: string = '';
  sessionId: number | null = null;

  @Output() confirmReservationEvent = new EventEmitter<string>();
  // @Input() reservedSeats!: string;

  constructor(
    private readonly dataService: DataService,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSeats();
  }

  getSeats() {
    // Récupérer les sièges depuis le backend (API)
    this.subs.push(
      this.dataService
        .getSeatsBySession(1)
        .subscribe((seats: { places: number }[]) => {
          console.log('Nombre de sièges total : ', seats);
          this.seatsNumber = seats[0].places;
          console.log(this.seatsNumber);

          this.createSeats(this.seatsNumber);
        })
    );
  }

  createSeats(seatsNumber: number) {
    const parentElement =
      this.el.nativeElement.querySelector('.seats-container');

    for (let i = 1; i <= seatsNumber; i++) {
      // Créer une nouvelle image pour chaque siège
      const seat = new Image(30, 30);
      seat.src = 'assets/chair.png';
      seat.alt = 'siège';
      seat.id = `seat-${i}`;
      const seatsPerRow = 15;

      // Si on commence une nouvelle ligne, créer un conteneur pour la ligne
      if (i % seatsPerRow === 1) {
        this.row = this.renderer.createElement('div');
        this.renderer.addClass(this.row, 'seat-row'); // Classe CSS pour la ligne (facultatif)
        this.renderer.appendChild(parentElement, this.row);
      }
      // Ajouter le siège à la ligne courante
      this.renderer.appendChild(this.row, seat);
      this.renderer.setStyle(seat, 'padding', '2px');
      this.renderer.setStyle(seat, 'cursor', 'pointer');

      this.addSeatClickListener(); // Ajoute un état à chaque siège
    }
  }

  // Vérifie si des sièges sont déjà réservés
  checkSeats(): void {
    this.seats.forEach((seat) => {
      // On récupère le numéro de siège
      const seatNumber = seat.element.id.split('-')[1];
      // Créer une expression régulière dynamique pour vérifier la valeur du numéro de siège dans sa globalité
      const regex = new RegExp(`(^|, )${seatNumber}($|, )`);
      // Si le numéro de siège existe dans la liste de sièges réservés, le siège apparaît réservé
      if (regex.test(this.reservedSeats)) {
        this.renderer.setAttribute(
          seat.element,
          'src',
          'assets/booked-chair.png'
        );
        seat.isBooked = true;
      }
    });
  }

  // Ajouter un siège dynamique avec un état
  addSeatClickListener(): void {
    const seatElements: HTMLImageElement[] =
      this.el.nativeElement.querySelectorAll('.seats-container img'); // Sélectionner toutes les images dans la div avec la classe 'seats-container'

    // Convertir la NodeList en tableau pour pouvoir itérer dessus
    this.seats = Array.from(seatElements).map((seat) => ({
      element: seat,
      isBooked: false, // Initialiser isBooked à false pour chaque siège
      isSelected: false,
    }));

    if (this.seats.length == this.seatsNumber) {
      console.log('Sièges : ', this.seats);
      // Initialiser chaque siège avec un état "non réservé" ou "réservé"
      this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
      this.subs.push(
        this.dataService
          .getReservedSeatsBySession(this.sessionId)
          .subscribe((reservedSeats: string) => {
            this.reservedSeats = reservedSeats;
            console.log('Sièges réservés : ', this.reservedSeats);
            this.checkSeats();
            this.seats.forEach((seat) => {
              // Écouteur pour survol (mouseenter)
              this.renderer.listen(seat.element, 'mouseenter', () => {
                if (!seat.isSelected && !seat.isBooked) {
                  this.renderer.setAttribute(
                    seat.element,
                    'src',
                    'assets/booked-chair.png'
                  );
                }
              });

              // Revenir à l'URL d'origine lors du survol (mouseleave)
              this.renderer.listen(seat.element, 'mouseleave', () => {
                if (!seat.isSelected && !seat.isBooked) {
                  this.renderer.setAttribute(
                    seat.element,
                    'src',
                    'assets/chair.png'
                  );
                }
              });

              // Clic sur un siège
              this.renderer.listen(seat.element, 'click', () => {
                if (!seat.isSelected && !seat.isBooked) {
                  this.renderer.setAttribute(
                    seat.element,
                    'src',
                    'assets/booked-chair.png'
                  );
                  seat.isSelected = true; // Marquer le siège comme sélectionné
                  const seatNumber = seat.element.id.split('-')[1];
                  this.selectedSeats.push(seatNumber);
                } else if (!seat.isBooked && seat.isSelected) {
                  this.renderer.setAttribute(
                    seat.element,
                    'src',
                    'assets/chair.png'
                  );
                  seat.isSelected = false;
                  const seatNumber = seat.element.id.split('-')[1];
                  this.selectedSeats = this.selectedSeats.filter(
                    (seat) => seat !== seatNumber
                  );
                } // Marquer le siège comme non réservé et le supprime du tableau de sièges réservés
                else if (seat.isBooked) {
                  return;
                }
              });
            });
          })
      );
    }
  }

  confirm() {
    const selectedSeatsString = this.selectedSeats.join(', ');
    this.confirmReservationEvent.emit(selectedSeatsString);
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
