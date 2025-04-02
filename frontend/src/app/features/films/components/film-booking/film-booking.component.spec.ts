import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmBookingComponent } from './film-booking.component';
import { Session } from '../../models/session';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../../../../data.service';
import { provideHttpClient } from '@angular/common/http';
import { SeatSelectionComponent } from '../../../booking/seat-selection/seat-selection.component';
import { AuthServiceService } from '../../../forms/services/auth-service.service';
import { DateTimeFormattingService } from '../../services/date-time-formatting.service';

describe('FilmBookingComponent', () => {
  let component: FilmBookingComponent;
  let fixture: ComponentFixture<FilmBookingComponent>;
  let mockDataService: any;
  let mockAuthService: any;
  let mockDateTimeFormatting: any;
  let mockRouter: any;

  // Mock data pour les séances
  const mockSession: Session[] = [
    {
      id: 1,
      title: 'Film 1',
      date: '3 mars 2025',
      filmTitle: 'Film 1',
      formatedDate: '3 mars 2025',
      startHour: '11:09',
      endHour: '12:59',
      idFilm: 1,
      cinemaName: 'Cinéma 1',
      roomName: 'Salle 1',
      quality: '3D',
      price: 12,
      moviePoster: 'assets/moviePoster1.jpg',
      places: 114,
      reservedSeats: '22, 23',
    },
  ];

  beforeEach(async () => {
    // Mock du service
    mockDataService = jasmine.createSpyObj('DataService', [
      'getSessionById',
      'getSeatsBySession',
      'reserveSeats',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getUserIdFromToken',
    ]);
    mockDateTimeFormatting = jasmine.createSpyObj('DateTimeFormattingService', [
      'dateTimeFormatting',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDataService.getSessionById.and.returnValue(of(mockSession));
    mockDataService.getSeatsBySession.and.returnValue(of([{ places: 30 }]));
    mockDataService.reserveSeats.and.returnValue(of({})); // Simuler la réussite de la réservation
    mockAuthService.getUserIdFromToken.and.returnValue(1); // Retourner un ID utilisateur mocké
    mockDateTimeFormatting.dateTimeFormatting.and.returnValue(
      '3 mars 2025 à 13:58'
    ); // Retourner une date formatée

    await TestBed.configureTestingModule({
      imports: [FilmBookingComponent, SeatSelectionComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: DataService, useValue: mockDataService },
        { provide: AuthServiceService, useValue: mockAuthService },
        {
          provide: DateTimeFormattingService,
          useValue: mockDateTimeFormatting,
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmBookingComponent);
    component = fixture.componentInstance;
    component.session = mockSession; // Assurez-vous que le composant a la session mockée
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get sessionId from the route', () => {
    expect(component.sessionId).toBe(1);
  });

  it('should call getSessionById on init', () => {
    component.ngOnInit();
    expect(mockDataService.getSessionById).toHaveBeenCalledWith(1);
    expect(component.session).toEqual(mockSession);
    expect(component.moviePoster).toBe('assets/moviePoster1.jpg');
  });

  it('should call getSeatsBySession in SeatSelectionComponent', () => {
    // Vérifier que la méthode getSeatsBySession est bien appelée dans le composant enfant
    expect(mockDataService.getSeatsBySession).toHaveBeenCalledWith(1);
  });

  it('should display film title', () => {
    const title = fixture.nativeElement.querySelector('#title');
    expect(title.textContent).toContain(mockSession[0].title);
  });

  it('should display moviePoster', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain(mockSession[0].moviePoster);
  });
  it('should display session date', () => {
    const date = fixture.nativeElement.querySelector('#session-date');
    expect(date.textContent).toContain(mockSession[0].date);
  });

  it('should display film start and end hour', () => {
    const startEndHours =
      fixture.nativeElement.querySelector('#start-end-hours');
    expect(startEndHours.textContent).toContain(
      `${mockSession[0].startHour} - ${mockSession[0].endHour}`
    );
  });

  it('should display cinema name', () => {
    const cinemaName = fixture.nativeElement.querySelector('#cinema-name');
    expect(cinemaName.textContent).toContain(mockSession[0].cinemaName);
  });

  it('should display the room name', () => {
    const roomName = fixture.nativeElement.querySelector('#room-name');
    expect(roomName.textContent).toContain(mockSession[0].roomName);
  });

  it('should display the film quality', () => {
    const quality = fixture.nativeElement.querySelector('#quality');
    expect(quality.textContent).toContain(mockSession[0].quality);
  });

  it('should display the session price', () => {
    const price = fixture.nativeElement.querySelector('#price');
    expect(price.textContent).toContain(mockSession[0].price);
  });

  it('should confirm reservation and navigate to "compte"', () => {
    // Données sélectionnées (exemple)
    const selectedSeatsString = '22, 23';

    // Espionner window.alert pour vérifier qu'elle est appelée
    const alertSpy = spyOn(window, 'alert').and.callThrough();

    // Appeler la méthode confirmReservation
    component.confirmReservation(selectedSeatsString);

    // Vérifier que la méthode reserveSeats a bien été appelée avec les bonnes données
    expect(mockDataService.reserveSeats).toHaveBeenCalledWith({
      idUser: 1,
      idFilm: mockSession[0].idFilm,
      cinemaName: mockSession[0].cinemaName,
      idSession: component.sessionId,
      roomName: mockSession[0].roomName,
      date: '3 mars 2025 à 13:58',
      viewed: false,
      placesNumber: selectedSeatsString,
      price: 24, // 12 * 2 places
      moviePoster: '',
      startHour: jasmine.any(Date), // La date doit être un objet Date
      endHour: jasmine.any(Date),
      description: '',
      actors: '',
      title: '',
      sessionDate: '',
      quality: '',
      opinionSent: false,
    });

    // Vérifier que l'alerte a bien été affichée avec le message correct
    expect(alertSpy).toHaveBeenCalledWith('Réservation confirmée');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['compte']);
  });
});
