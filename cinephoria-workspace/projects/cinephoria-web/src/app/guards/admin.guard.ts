import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../features/forms/services/auth-service.service';
import { map, Observable } from 'rxjs';
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
    return this.authService.getUserRole$().pipe(
      map((role) => {
        if (role !== 'admin') {
          this.router.navigate(['/compte']);
          return false;
        }
        return true;
      })
    );
  }
}
