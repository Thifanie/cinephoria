import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  connexion(): void {
    if (this.connexionForm.invalid) return;
    console.log(this.connexionForm.value);
  }
}
