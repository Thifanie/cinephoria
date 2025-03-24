import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationComponent } from './administration.component';
import { of } from 'rxjs';
import { Film } from '../../features/films/models/film';
import { DataService } from '../../data.service';
import { Type } from '../../features/films/models/type';
import { Cinema } from '../../features/films/models/cinema';
import { AddFilmComponent } from '../../features/administration/add-film/add-film.component';
import { UpdateFilmComponent } from '../../features/administration/update-film/update-film.component';
import { AddSessionComponent } from '../../features/administration/add-session/add-session.component';

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

const mockTypes: Type[] = [
  {
    id: 1,
    type: 'Action',
  },
  {
    id: 2,
    type: 'Aventure',
  },
];

const mockCinemas: Cinema[] = [
  {
    id: 1,
    name: 'Cinéma 1',
  },
  {
    id: 2,
    name: 'Cinéma 1',
  },
];

const dataServiceMock = {
  getFilms: jasmine.createSpy('getFilms').and.returnValue(of(mockFilms)),
  getType: jasmine.createSpy('getType').and.returnValue(of(mockTypes)),
  getCinema: jasmine.createSpy('getCinema').and.returnValue(of(mockCinemas)),
};

describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdministrationComponent,
        AddFilmComponent,
        UpdateFilmComponent,
        AddSessionComponent,
      ],
      providers: [{ provide: DataService, useValue: dataServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title Espace administration', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Espace administration');
  });

  it('should load films, types, and cinemas on init', () => {
    expect(dataServiceMock.getFilms).toHaveBeenCalled();
    expect(dataServiceMock.getType).toHaveBeenCalled();
    expect(dataServiceMock.getCinema).toHaveBeenCalled();

    expect(component.listFilms).toEqual(mockFilms);
    expect(component.listTypes).toEqual(mockTypes);
    expect(component.listCinemas).toEqual(mockCinemas);
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
