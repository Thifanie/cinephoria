import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { User } from './features/forms/models/user';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  // getFilms(): void {
  //   fetch('http://localhost:3000/api/films', { mode: 'no-cors' })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Erreur de la requête !');
  //       }
  //       return response.json();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  getFilms() {
    return this.http.get('http://localhost:3000/api/films', {
      responseType: 'json',
    });
  }

  getAdmin(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/admin');
  }
}
