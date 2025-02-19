import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../forms/services/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterModule, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  constructor(private readonly authService: AuthServiceService) {}

  isAuthenticated: boolean = false;
  private authSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    // S'abonne à l'état d'authentification
    this.authSubscription = this.authService
      .isAuthenticated$()
      .subscribe((status) => {
        this.isAuthenticated = status; // Met à jour l'état de la connexion
      });
  }

  ngOnDestroy(): void {
    // Se désabonne pour éviter les fuites de mémoire
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Méthode pour se déconnecter
  logout() {
    this.authService.logout(); // Déconnecte l'utilisateur via le service
  }
}
