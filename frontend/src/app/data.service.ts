import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './features/forms/models/user';
import { Film, FilmData } from './features/films/models/film';
import { Type } from './features/films/models/type';
import { Session } from './features/films/models/session';
import { Room } from './features/films/models/room';
import { Quality } from './features/films/models/quality';
import { Cinema } from './features/films/models/cinema';
import { Order } from './features/films/models/order';
import { Opinion } from './features/films/models/opinion';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly filmsSubject = new BehaviorSubject<Film[]>([]);
  public films$ = this.filmsSubject.asObservable();
  constructor(private readonly http: HttpClient) {}
  private readonly apiUrl =
    (window as any)['API_URL'] ||
    'https://cinephoria-backend-production.up.railway.app/api'; // 'http://localhost:3000/api';

  filmData: Film[] = [];

  // getFilms(): Observable<Film[]> {
  //   return this.http.get<Film[]>('http://localhost:3000/api/films', {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });
  // }
  getFilms(): Observable<Film[]> {
    if (this.filmsSubject.value.length === 0) {
      // Si les films ne sont pas encore récupérés, faire la requête
      this.http
        .get<Film[]>(`${this.apiUrl}/films`, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        })
        .subscribe((films: Film[]) => {
          this.filmsSubject.next(films);
        });
    }
    return this.films$; // Renvoie un observable de la liste des films
  }

  getType(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiUrl}/type`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getAdmin(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getSessions(idFilm: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/session/${idFilm}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getSessionById(idSession: number): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/session/booking/${idSession}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  getSessionsByCinema(cinemaId: number): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/session?cinemaId=${cinemaId}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  getSeatsBySession(idSession: number): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/session/seats/${idSession}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  getRoom(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/room`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getRoomByCinema(cinema: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/room/${cinema}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getQuality(): Observable<Quality[]> {
    return this.http.get<Quality[]>(`${this.apiUrl}/quality`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getCinema(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${this.apiUrl}/cinema`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getOrdersByUser(idUser: number | null): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/order/${idUser}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  postFilms(filmData: any) {
    return this.http.post<FilmData>(`${this.apiUrl}/films`, filmData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  postUser(userData: any) {
    return this.http.post<User>(`${this.apiUrl}/users`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  reserveSeats(orderData: any) {
    return this.http.post<Order>(`${this.apiUrl}/order`, orderData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  postOpinion(opinionData: Opinion) {
    return this.http.post<Opinion>(`${this.apiUrl}/opinion`, opinionData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  postSession(sessionData: Session) {
    return this.http.post<Session>(`${this.apiUrl}/session`, sessionData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateFilm(filmTitle: string, filmData: FilmData) {
    return this.http.post<FilmData>(
      `${this.apiUrl}/films/${filmTitle}`,
      filmData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  deleteFilm(filmTitle: string, filmData: FilmData) {
    return this.http.post<FilmData>(
      `${this.apiUrl}/films/delete/${filmTitle}`,
      filmData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
