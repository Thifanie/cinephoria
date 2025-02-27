import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { DataService } from '../../../data.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly userRole$ = new BehaviorSubject<string>('');
  subs: Subscription[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly dataService: DataService
  ) {}

  // Crée un BehaviorSubject pour stocker l'état de l'authentification
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.checkToken()
  );

  // Vérifie si un token est présent dans le localStorage
  private checkToken(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!window.localStorage.getItem('token');
    }
    return false; // Si ce n'est pas un environnement client, retourne false
  }

  // Création d'un token si utilisateur autorisé
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`http://localhost:3000/api/auth/login`, credentials)
      .pipe(
        // Si la connexion réussie, on met à jour l'état d'authentification
        tap(() => {
          this.isAuthenticatedSubject.next(true); // Met à jour l'état d'authentification à true
        })
      );
  }

  logout() {
    localStorage.removeItem('token'); // Supprime le token
    this.isAuthenticatedSubject.next(false); // Met à jour l'état d'authentification à false
  }

  // Méthode pour récupérer l'état d'authentification sous forme d'Observable
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable(); // Renvoie l'état sous forme d'Observable
  }

  loadUserRole(): void {
    const userId = this.getUserIdFromToken(); // Récupère l'ID du token

    this.subs.push(
      this.dataService.getUser().subscribe((users) => {
        const currentUser = users.find((user) => user.id === userId); // Trouve l'utilisateur connecté
        if (currentUser) {
          this.userRole$.next(currentUser.role);
        }
      })
    );
  }

  // On récupère l'id de l'utilisateur connecté à partir de son token
  getUserIdFromToken(): number | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.userId; // Suppose que le token contient `userId`
      } catch (e) {
        return null;
      }
    }
    return null; // Si ce n'est pas un environnement client, retourne false
  }

  getUserRole$(): Observable<string> {
    return this.userRole$.asObservable();
  }
}
