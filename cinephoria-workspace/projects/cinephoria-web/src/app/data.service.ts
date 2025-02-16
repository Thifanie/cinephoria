import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './features/forms/models/user';
import { Film, FilmData } from './features/films/models/film';
import { Type } from './features/films/models/type';
import { Session } from './features/films/models/session';
import { Room } from './features/films/models/room';
import { Quality } from './features/films/models/quality';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly filmsSubject = new BehaviorSubject<Film[]>([]);
  public films$ = this.filmsSubject.asObservable();
  constructor(private readonly http: HttpClient) {}

  filmData: Film[] = [];

  // getFilms(): Observable<Film[]> {
  //   return this.http.get<Film[]>('http://localhost:3000/api/films', {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });
  // }
  getFilms(): void {
    this.http
      .get<Film[]>('http://localhost:3000/api/films', {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe({
        next: (films) => {
          this.filmsSubject.next(films); // Mise à jour du BehaviorSubject avec les films récupérés
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des films', err);
        },
      });
  }

  getType(): Observable<Type[]> {
    return this.http.get<Type[]>('http://localhost:3000/api/type', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getAdmin(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/admin', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/user', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getSessions(idFilm: number): Observable<Session[]> {
    return this.http.get<Session[]>(
      `http://localhost:3000/api/session/${idFilm}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  getRoom(): Observable<Room[]> {
    return this.http.get<Room[]>('http://localhost:3000/api/room', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getQuality(): Observable<Quality[]> {
    return this.http.get<Quality[]>('http://localhost:3000/api/quality', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  postFilms(filmData: any) {
    return this.http.post<FilmData>(
      'http://localhost:3000/api/films',
      filmData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  postUser(userData: any) {
    return this.http.post<User>('http://localhost:3000/api/user', userData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
