import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion-form',
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './connexion-form.component.html',
  styleUrl: './connexion-form.component.css',
})
export class ConnexionFormComponent {
  connexionForm = new FormGroup({
    mail: new FormControl('', Validators.email),
    mdp: new FormControl('', Validators.minLength(8)),
  });

  router = inject(Router);

  connexion(): void {
    if (this.connexionForm.invalid) return;
    if (
      this.connexionForm.value.mail == 'admin@gmail.com' &&
      this.connexionForm.value.mdp == 'admin123'
    ) {
      this.router.navigateByUrl('admin');
    } else {
      alert("Vous n'avez pas les droits !");
    }
  }
}
