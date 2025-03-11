import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../features/forms/services/auth-service.service';
import { map, Observable, switchMap, first } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthServiceService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.loadUserRole$().pipe(
      // Attente de la mise à jour du rôle
      switchMap(() => this.authService.getUserRole$()), // Récupère le rôle mis à jour
      first(), // Prend la première valeur et complète l'Observable
      map((role) => {
        console.log('Rôle dans AdminGuard :', role);
        if (role !== 'admin') {
          this.router.navigate(['/compte']);
          return false;
        }
        return true;
      })
    );
  }
}
