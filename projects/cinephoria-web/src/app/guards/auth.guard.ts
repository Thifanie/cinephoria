import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../features/forms/services/auth-service.service';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthServiceService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          this.router.navigate(['/connexion']); // Redirige si l'utilisateur n'est pas connecté
          return false;
        }
        return true;
      })
    );
  }
}
