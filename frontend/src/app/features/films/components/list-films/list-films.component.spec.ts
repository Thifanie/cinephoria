import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFilmsComponent } from './list-films.component';
import { Film } from '../../models/film';
import { provideHttpClient } from '@angular/common/http';
import { DataService } from '../../../../data.service';
import { of } from 'rxjs';
import { CardFilmsComponent } from '../card-films/card-films.component';
import { By } from '@angular/platform-browser';

describe('ListFilmsComponent', () => {
  let component: ListFilmsComponent;
  let fixture: ComponentFixture<ListFilmsComponent>;
  let mockDataService: any;

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
  ];

  beforeEach(async () => {
    // Mock du service
    mockDataService = jasmine.createSpyObj('DataService', ['getFilms'], {
      films$: of(mockFilms),
    });

    await TestBed.configureTestingModule({
      imports: [ListFilmsComponent, CardFilmsComponent],
      providers: [
        provideHttpClient(),
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListFilmsComponent);
    component = fixture.componentInstance;
    component.listFilms = mockFilms;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get films on init and update listFilms', () => {
    // Déclenche ngOnInit manuellement
    component.ngOnInit();
    fixture.detectChanges();

    // Vérifie que getFilms a bien été appelé
    expect(mockDataService.getFilms).toHaveBeenCalled();

    // Vérifie que listFilms a bien été mis à jour avec les films mockés
    expect(component.listFilms).toEqual(mockFilms);

    // Vérifie qu'il y a des films dans listFilms
    expect(component.listFilms.length).toBeGreaterThan(0);
  });

  it('should display CardFilmsComponent with listFilms', () => {
    // Récupère le composant enfant dans le DOM
    const cardFilmsComponent =
      fixture.nativeElement.querySelector('app-card-films');

    // Vérifie que le composant enfant est présent
    expect(cardFilmsComponent).toBeTruthy();

    // Vérifie que le composant enfant a bien les données passées par le parent
    const cardFilms = fixture.debugElement.query(
      By.directive(CardFilmsComponent)
    );
    expect(cardFilms.componentInstance.items).toEqual(mockFilms);
  });

  it('should unsubscribe all subscriptions at ngOnDestroy', () => {
    component.subs.forEach((sub) => {
      spyOn(sub, 'unsubscribe');
    });
    component.ngOnDestroy();
    component.subs.forEach((sub) => {
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });
});
