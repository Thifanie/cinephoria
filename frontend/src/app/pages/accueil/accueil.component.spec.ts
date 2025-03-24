import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilComponent } from './accueil.component';
import { Film } from '../../features/films/models/film';
import { of } from 'rxjs';
import { DataService } from '../../data.service';
import { RouterLink, RouterModule } from '@angular/router';
import { FilmsComponent } from '../films/films.component';
import { NgFor } from '@angular/common';

// Mock du DataService
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
    type: '1',
  },
  {
    id: 2,
    title: 'Film 2',
    description: 'Description 2',
    actors: 'Acteur 2',
    minage: 12,
    favorite: true,
    movieposter: 'assets/moviePoster2.jpg',
    opinion: 4,
    onview: true,
    type: '2',
  },
];
const dataServiceMock = {
  getFilms: jasmine.createSpy('getFilms'),
  films$: of(mockFilms),
};

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccueilComponent,
        FilmsComponent,
        RouterModule.forRoot([{ path: 'films', component: FilmsComponent }]),
        RouterLink,
        NgFor,
      ], // Simule le module de routes avec une liste vide de routes],
      providers: [{ provide: DataService, useValue: dataServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche le cycle de vie Angular
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFilms at ngOnInit', () => {
    expect(dataServiceMock.getFilms).toHaveBeenCalled();
  });

  it('should update listFilms after films recovery', () => {
    expect(component.listFilms).toEqual(mockFilms);
  });

  it('should unsubscribe when destruction of the component', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display title Cinéphoria', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1');
    expect(title.textContent).toContain('Cinéphoria');
  });

  it('should display description of the cinema', () => {
    const compiled = fixture.nativeElement;
    const description = compiled.querySelector('#description-cinema p');
    expect(description.textContent).toContain(
      'Cinéphoria est un joyau du cinéma français'
    );
  });

  it('should display films in the carousel', () => {
    // Vérifier que chaque film est bien affiché dans le carrousel
    const compiled = fixture.nativeElement;
    const carouselItems = compiled.querySelectorAll('.carousel-item');
    expect(carouselItems.length).toBe(mockFilms.length);
    expect(carouselItems[0].querySelector('img').src).toContain(
      'assets/moviePoster1.jpg'
    );
    expect(carouselItems[1].querySelector('img').src).toContain(
      'assets/moviePoster2.jpg'
    );
  });

  it('should display navigation buttons of the carousel', () => {
    const compiled = fixture.nativeElement;

    const prevButton = compiled.querySelector('.carousel-control-prev');
    const nextButton = compiled.querySelector('.carousel-control-next');

    expect(prevButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
  });

  it('should display indicators for each film in the carousel', () => {
    const compiled = fixture.nativeElement;
    const indicators = compiled.querySelectorAll('.carousel-indicators button');

    expect(indicators.length).toBe(mockFilms.length);
    expect(indicators[0].getAttribute('aria-current')).toBe('true');
  });

  it('should navigate to the films page when click on a film of the carousel', () => {
    const compiled = fixture.nativeElement;
    const carouselItems = compiled.querySelectorAll('.carousel-item');

    // Sélectionner l'élément à un index spécifique, ici le premier élément (i = 0)
    const selectedLink = carouselItems[0].querySelector('a');

    // Vérifier que le lien existe
    expect(selectedLink).toBeTruthy();

    // Déclenche un clic sur le lien
    selectedLink.click();

    // Attendre que la navigation se fasse
    fixture.detectChanges();

    expect(RouterLink).toHaveBeenCalled();
  });
});
