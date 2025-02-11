import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-connexion-form',
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './connexion-form.component.html',
  styleUrl: './connexion-form.component.css',
})
export class ConnexionFormComponent implements OnDestroy {
  connexionForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8)),
  });

  constructor(private readonly dataService: DataService) {}

  subscription: Subscription | undefined;
  email!: string;
  password!: string;
  router = inject(Router);

  connexion(): void {
    if (this.connexionForm.invalid) return;
    this.subscription = this.dataService.getAdmin().subscribe((data) => {
      if (data.length === 0) {
        alert('Aucun administrateur trouvé !');
        return;
      }
      this.email = data[0].email;
      this.password = data[0].password;
      if (
        this.connexionForm.value.email == this.email &&
        this.connexionForm.value.password == this.password
      ) {
        this.router.navigateByUrl('admin');
      } else {
        alert("Vous n'avez pas les droits !");
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
