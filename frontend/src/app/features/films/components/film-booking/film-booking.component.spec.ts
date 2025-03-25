import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmBookingComponent } from './film-booking.component';
import { Session } from '../../models/session';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../../../../data.service';
import { provideHttpClient } from '@angular/common/http';

describe('FilmBookingComponent', () => {
  let component: FilmBookingComponent;
  let fixture: ComponentFixture<FilmBookingComponent>;
  let mockDataService: any;

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
    mockDataService = jasmine.createSpyObj('DataService', ['getSessionById']);
    mockDataService.getSessionById.and.returnValue(of(mockSession));

    await TestBed.configureTestingModule({
      imports: [FilmBookingComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get sessionId from the route', () => {
    expect(component.sessionId).toBe(1);
  });

  it('should get datas of the session from DataService', () => {
    expect(mockDataService.getSessionById).toHaveBeenCalledWith(1);
    expect(component.session).toEqual(mockSession);
    expect(component.moviePoster).toBe('assets/moviePoster1.jpg');
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

  // it('should call getSessionById on init', () => {

  // });
});
