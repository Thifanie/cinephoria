import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-inscription-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './inscription-form.component.html',
  styleUrl: './inscription-form.component.css',
})
export class InscriptionFormComponent {
  inscriptionForm = new FormGroup({
    prenom: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    nomUser: new FormControl('', Validators.required),
    mail: new FormControl('', Validators.email),
    mdp: new FormControl('', Validators.minLength(8)),
  });

  inscription(): void {
    if (this.inscriptionForm.invalid) return;
    console.log(this.inscriptionForm.value);
  }
}
