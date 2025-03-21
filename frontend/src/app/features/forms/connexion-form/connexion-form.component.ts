import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { Subscription, catchError, first, of, throwError } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-connexion-form',
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './connexion-form.component.html',
  styleUrl: './connexion-form.component.css',
})
export class ConnexionFormComponent implements OnInit, OnDestroy {
  connexionForm!: FormGroup;

  constructor(
    private readonly dataService: DataService,
    private readonly authService: AuthServiceService
  ) {}

  subscription: Subscription | undefined;
  subscription2: Subscription | undefined;
  subs: Subscription[] = [];
  emailAdmin!: string;
  passwordAdmin!: string;
  emailUserList!: string[];
  emailUser!: string;
  passwordUser!: string[];
  findUser!: any;
  router = inject(Router);
  invalidCredentials = false;
  credentials = { email: '', password: '' };

  ngOnInit(): void {
    // Initialiser le formulaire réactif
    this.connexionForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.minLength(8)),
    });
  }

  login(): void {
    if (this.connexionForm.invalid) return;

    // Authentification de l'utilisateur
    this.credentials = {
      email: this.connexionForm.value.email,
      password: this.connexionForm.value.password,
    };

    this.subs.push(
      this.authService
        .login(this.credentials)
        .pipe(
          catchError((error) => {
            // Gérer l'erreur ici, par exemple, en affichant une alerte
            let errorMessage = 'Une erreur inattendue est survenue.';
            if (error.status === 401 && error.error.message) {
              errorMessage = error.error.message;
            }
            alert(errorMessage); // Afficher l'alerte
            // Renvoie l'erreur sous forme d'observable
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe((response) => {
          localStorage.setItem('token', response.token); // Stocke le token
          this.authService.loadUserRole$().subscribe(() => {
            // Attendre la mise à jour du rôle
            this.authService
              .getUserRole$()
              .pipe(first())
              .subscribe((role) => {
                // Prend une seule valeur
                console.log('Rôle détecté après connexion : ', role);
                this.router.navigate([role === 'admin' ? '/admin' : '/compte']);
              });
          });
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
