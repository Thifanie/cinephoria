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
import { Subscription } from 'rxjs';
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

    // Récupération des données administrateur
    this.subs.push(
      this.dataService.getAdmin().subscribe((data) => {
        if (data.length === 0) {
          alert('Aucun administrateur trouvé !');
          return;
        }
        this.emailAdmin = data[0].email;
        this.passwordAdmin = data[0].password;
        if (
          this.connexionForm.value.email == this.emailAdmin &&
          this.connexionForm.value.password == this.passwordAdmin
        ) {
          this.router.navigateByUrl('admin');
        }
      })
    );

    // Authentification de l'utilisateur
    this.credentials = {
      email: this.connexionForm.value.email,
      password: this.connexionForm.value.password,
    };

    try {
      this.subs.push(
        this.authService.login(this.credentials).subscribe((response) => {
          localStorage.setItem('token', response.token); // Stocke le token
          this.router.navigate(['/compte']); // Redirection après connexion
        })
      );
    } catch (err) {
      alert('Le mot de passe est incorrect.');
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
