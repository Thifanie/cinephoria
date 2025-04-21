import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap, map } from 'rxjs';
import { DataService } from '../../../data.service';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user';

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
      const token = window.localStorage.getItem('token');
      if (!token) {
        return false;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le token
        const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes

        if (payload.exp <= now) {
          window.localStorage.removeItem('token'); // Supprime le token expiré
          return false;
        }

        return true;
      } catch (error) {
        console.log('Erreur de vérification du token : ', error);
        window.localStorage.removeItem('token'); // Supprime si le token est corrompu
        return false;
      }
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

  loadUserRole$(): Observable<void> {
    const userId = this.getUserIdFromToken(); // Récupère l'ID du token
    return this.dataService.getUser().pipe(
      tap((users: User[]) => {
        const currentUser = users.find((user: User) => user._id === userId);
        if (currentUser) {
          this.userRole$.next(currentUser.role);
          console.log("Rôle de l'utilisateur actif :", currentUser.role);
        }
      }),
      map(() => undefined) // Retourne "undefined" pour respecter le type Observable<void>
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
        console.log("Erreur de récupération de l'ID de l'utilisateur : ", e);
        return null;
      }
    }
    return null; // Si ce n'est pas un environnement client, retourne false
  }

  getUserRole$(): Observable<string> {
    return this.userRole$.asObservable();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
