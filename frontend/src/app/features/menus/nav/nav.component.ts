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
  isAdmin: boolean = false;
  subs: Subscription[] = [];

  ngOnInit(): void {
    // S'abonne à l'état d'authentification et récupère le rôle de l'utilisateur
    this.subs.push(
      this.authService.isAuthenticated$().subscribe((status) => {
        this.isAuthenticated = status; // Met à jour l'état de la connexion
      }),

      this.authService.loadUserRole$().subscribe(() => {
        // Charger le rôle utilisateur avant d'écouter `getUserRole$()`
        // Ensuite, écouter le rôle de l'utilisateur
        this.authService.getUserRole$().subscribe((role) => {
          console.log("Rôle de l'utilisateur (nav) :", role);
          this.isAdmin = role === 'admin';
        });
      })
    );
  }

  ngOnDestroy(): void {
    // Se désabonne pour éviter les fuites de mémoire
    this.subs.forEach((s) => s.unsubscribe());
  }

  // Méthode pour se déconnecter
  logout() {
    this.authService.logout(); // Déconnecte l'utilisateur via le service
  }
}
