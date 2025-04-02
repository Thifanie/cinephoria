import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './inscription-form.component.html',
  styleUrl: './inscription-form.component.css',
})
export class InscriptionFormComponent {
  constructor(
    private readonly dataService: DataService,
    private readonly router: Router
  ) {}

  inscriptionForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8)),
  });

  userData!: User;

  subscription: Subscription | undefined;

  inscription(): void {
    if (this.inscriptionForm.invalid) return;

    // Transforme le nom en majuscule
    const nameControl = this.inscriptionForm.get('name');
    const nameUppercase = nameControl?.value
      ? nameControl.value.toUpperCase()
      : '';

    this.userData = {
      ...(this.inscriptionForm.value as User),
      name: nameUppercase,
      role: 'user',
    };

    console.log('Nouvel utilisateur : ', this.userData);

    this.subscription = this.dataService
      .postUser(this.userData)
      .subscribe((data: User) => {
        console.log('Utilisateur ajouté : ', data);
        this.userData = data;
        // Redirection vers la page de connexion
        this.router.navigate(['/connexion']);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
