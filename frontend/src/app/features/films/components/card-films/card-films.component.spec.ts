import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFilmsComponent } from './card-films.component';
import { Film } from '../../models/film';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('CardFilmsComponent', () => {
  let component: CardFilmsComponent;
  let fixture: ComponentFixture<CardFilmsComponent>;
  let mockRouter: any;

  // Mock data pour les films
  const mockFilms: Film[] = [
    {
      id: 1,
      title: 'Film 1',
      description: 'Description 1',
      actors: 'Acteur 1',
      minage: 12,
      favorite: true,
      movieposter: 'assets/moviePoster1.jpg',
      opinion: 4,
      onview: true,
      type: 'Action',
    },
    {
      id: 2,
      title: 'Film 2',
      description: 'Description 2',
      actors: 'Acteur 2',
      minage: null,
      favorite: false,
      movieposter: 'assets/moviePoster2.jpg',
      opinion: 3,
      onview: false,
      type: 'Aventure',
    },
  ];

  beforeEach(async () => {
    // Création d'un mock de Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CardFilmsComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardFilmsComponent);
    component = fixture.componentInstance;

    // Initialisation des items avec les mock films
    component.items = mockFilms;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items passed as input', () => {
    expect(component.items).toEqual(mockFilms);
  });

  it('should create a card for each film', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card');
    expect(cards.length).toEqual(mockFilms.length);
  });

  it('should display film title', () => {
    const title = fixture.nativeElement.querySelector('#title');
    expect(title.textContent).toContain(mockFilms[0].title);
  });

  it('should display film actors', () => {
    const actors = fixture.nativeElement.querySelector('#actors');
    expect(actors.textContent).toContain(mockFilms[0].actors);
  });

  it('should display film description', () => {
    const description = fixture.nativeElement.querySelector('#description');
    expect(description.textContent).toContain(mockFilms[0].description);
  });

  it('should display film types', () => {
    const types = fixture.nativeElement.querySelector('#types');
    expect(types.textContent).toContain(mockFilms[0].type);
  });

  it('should display the film poster', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain(mockFilms[0].movieposter);
  });

  it('should show the minimal age if existing', () => {
    const minAge = fixture.nativeElement.querySelector('#minAge');
    if (mockFilms[0].minage) {
      expect(minAge.textContent).toContain(
        `Age minimum : ${mockFilms[0].minage} ans`
      );
    }
  });

  it('should not show the minimal age if not existing', () => {
    component.items = [mockFilms[1]];
    fixture.detectChanges();
    const minAge = fixture.nativeElement.querySelector('#minAge');
    expect(minAge).toBeNull();
  });

  it('should show "Coup de coeur" if film is a favorite', () => {
    const favoriteText = fixture.nativeElement.querySelector('#favorite');
    if (mockFilms[0].favorite) {
      expect(favoriteText.textContent).toContain('Coup de coeur');
    }
  });

  it('should not show "Coup de coeur" if film is not a favorite', () => {
    component.items = [mockFilms[1]]; // Changer le film pour un non favori
    fixture.detectChanges(); // Forcer la détection des changements après modification des données

    const favoriteText = fixture.nativeElement.querySelector('#favorite');
    expect(favoriteText).toBeNull();
  });

  it('should show rating if existing', () => {
    component.items = [mockFilms[0]];
    fixture.detectChanges();
    const rating = fixture.nativeElement.querySelector('.rating');
    expect(rating).toBeTruthy();
  });

  it('should calculate the correct rating percentage', () => {
    const rating1 = component.calculateRating(mockFilms[0].opinion);
    const rating2 = component.calculateRating(mockFilms[1].opinion);

    expect(rating1).toBe(80); // (4/5) * 100 = 80
    expect(rating2).toBe(60); // (3/5) * 100 = 60
  });

  it('should call goToFilmSessions when button is clicked', () => {
    spyOn(component, 'goToFilmSessions');

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.goToFilmSessions).toHaveBeenCalledWith(mockFilms[0].id);
  });

  it('should navigate to the film sessions page when the button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'sessions',
      mockFilms[0].id,
    ]);
  });
});
