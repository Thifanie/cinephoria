import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './features/forms/models/user';
import { Film } from './features/films/models/film';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  getFilms(): Observable<Film[]> {
    return this.http.get<Film[]>('http://localhost:3000/api/films', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getAdmin(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/admin', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
