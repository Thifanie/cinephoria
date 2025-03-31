import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatSelectionComponent } from './seat-selection.component';
import { DataService } from '../../../data.service';
import { of } from 'rxjs';
import { ElementRef, Renderer2 } from '@angular/core';
import { FilmBookingComponent } from '../../films/components/film-booking/film-booking.component';

describe('SeatSelectionComponent', () => {
  let component: SeatSelectionComponent;
  let fixture: ComponentFixture<SeatSelectionComponent>;

  let dataService: DataService;

  const mockDataService = {
    getSeatsBySession: jasmine
      .createSpy('getSeatsBySession')
      .and.returnValue(of([{ places: 30 }])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatSelectionComponent, FilmBookingComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        Renderer2,
        {
          provide: ElementRef,
          useValue: { nativeElement: document.createElement('div') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSeats on init', () => {
    spyOn(component, 'getSeats').and.callThrough();
    component.ngOnInit();
    expect(component.getSeats).toHaveBeenCalled();
  });

  it('should get seats and create seats', () => {
    expect(mockDataService.getSeatsBySession).toHaveBeenCalledWith(1);
    expect(component.seatsNumber).toBe(30);
  });

  it('should create seats correctly', () => {
    const parentElement =
      fixture.nativeElement.querySelector('.seats-container');
    const seats = parentElement.querySelectorAll('img');
    expect(seats.length).toBe(30);
  });

  // it('should marked reserved seats as booked', () => {
  //   component.reservedSeats = '22, 23';
  //   const seatElements: HTMLImageElement[] =
  //     fixture.nativeElement.querySelectorAll('.seats-container img');
  //   const seats = Array.from(seatElements).map((seat) => ({
  //     element: seat,
  //     isBooked: false, // Initialiser isBooked à false pour chaque siège
  //     isSelected: false,
  //   }));

  //   const firstSeat = seatElements.find((seat) => seat.id === 'seat-1');
  //   expect(firstSeat).toBeDefined();
  //   // expect(firstSeat.id).toBe('seat-1');
  // });

  // it('should mark selected seats on click and emit event on confirm', () => {
  //   // Récupérer tous les sièges (images) dans le DOM
  //   const seatElements: HTMLImageElement[] =
  //     fixture.nativeElement.querySelectorAll('.seats-container img');

  //   // Vérifier qu'il y a bien 30 sièges
  //   expect(seatElements.length).toBe(30);

  //   // Sélectionner le premier siège
  //   const firstSeat = seatElements[0]; // Le premier siège devrait avoir l'id 'seat-1'

  //   // Vérifier les propriétés initiales du premier siège
  //   const firstSeatObj = component.seats.find(
  //     (seat) => seat.element.id === 'seat-1'
  //   );
  //   expect(firstSeatObj).toBeDefined(); // Vérifier que l'objet siège existe
  //   // expect(firstSeatObj?.isBooked).toBeFalse(); // Assurez-vous que le siège n'est pas réservé
  //   expect(firstSeatObj?.isSelected).toBeFalse(); // Assurez-vous que le siège n'est pas sélectionné

  //   // Simuler un clic sur le premier siège
  //   firstSeat.click();
  //   fixture.detectChanges(); // Forcer Angular à détecter les changements

  // Vérifier les propriétés après le clic
  // expect(firstSeatObj?.isSelected).toBeTrue(); // Le siège doit être sélectionné
  // expect(component.selectedSeats).toContain('1'); // Le siège 1 doit être dans le tableau selectedSeats
  // expect(firstSeat.src).toContain('booked-chair.png'); // L'image doit avoir changé

  // // Optionnel : Tester le comportement après un second clic (désélectionner le siège)
  // firstSeat.click();
  // fixture.detectChanges();
  // expect(firstSeatObj?.isSelected).toBeFalse(); // Le siège doit être désélectionné
  // expect(component.selectedSeats).not.toContain('1'); // Le siège 1 doit être retiré de selectedSeats
  // expect(firstSeat.src).toContain('chair.png'); // L'image doit être revenue à l'état initial

  // spyOn(component.confirmReservationEvent, 'emit');
  // component.confirm();
  // expect(component.confirmReservationEvent.emit).toHaveBeenCalledWith('1');
  // });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component.subs[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subs[0].unsubscribe).toHaveBeenCalled();
  });
});
