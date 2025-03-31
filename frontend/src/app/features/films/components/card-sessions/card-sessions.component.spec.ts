import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSessionsComponent } from './card-sessions.component';
import { Session } from '../../models/session';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('CardSessionsComponent', () => {
  let component: CardSessionsComponent;
  let fixture: ComponentFixture<CardSessionsComponent>;
  let mockRouter: any;

  // Mock data pour les séances
  const mockSessions: Session[] = [
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
      reservedSeats: '34, 35',
    },
  ];

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CardSessionsComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSessionsComponent);
    component = fixture.componentInstance;

    component.items = mockSessions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items passed as input', () => {
    expect(component.items).toEqual(mockSessions);
  });

  it('should create a card for each Session', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toEqual(mockSessions.length);
  });

  it('should display film title', () => {
    const title = fixture.nativeElement.querySelector('#title');
    expect(title.textContent).toContain(mockSessions[0].title);
  });

  it('should display session date', () => {
    const date = fixture.nativeElement.querySelector('#session-date');
    expect(date.textContent).toContain(mockSessions[0].date);
  });

  it('should display film start and end hour', () => {
    const startEndHours =
      fixture.nativeElement.querySelector('#start-end-hours');
    expect(startEndHours.textContent).toContain(
      `${mockSessions[0].startHour} - ${mockSessions[0].endHour}`
    );
  });

  it('should display cinema name', () => {
    const cinemaName = fixture.nativeElement.querySelector('#cinema-name');
    expect(cinemaName.textContent).toContain(mockSessions[0].cinemaName);
  });

  it('should display the room name', () => {
    const roomName = fixture.nativeElement.querySelector('#room-name');
    expect(roomName.textContent).toContain(mockSessions[0].roomName);
  });

  it('should display the film quality', () => {
    const quality = fixture.nativeElement.querySelector('#quality');
    expect(quality.textContent).toContain(mockSessions[0].quality);
  });

  it('should display the session price', () => {
    const price = fixture.nativeElement.querySelector('#price');
    expect(price.textContent).toContain(mockSessions[0].price);
  });

  it('should have a button to choose the session', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should call goToFilmBooking when button is clicked', () => {
    spyOn(component, 'goToFilmBooking');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.goToFilmBooking).toHaveBeenCalledWith(mockSessions[0].id);
  });

  it('should navigate to reservation when goToFilmBooking is called', () => {
    component.goToFilmBooking(mockSessions[0].id);
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'reservation',
      mockSessions[0].id,
    ]);
  });
});
