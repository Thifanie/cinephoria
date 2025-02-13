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

@Component({
  selector: 'app-connexion-form',
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './connexion-form.component.html',
  styleUrl: './connexion-form.component.css',
})
export class ConnexionFormComponent implements OnInit, OnDestroy {
  connexionForm!: FormGroup;

  constructor(private readonly dataService: DataService) {}

  subscription: Subscription | undefined;
  subscription2: Subscription | undefined;
  emailAdmin!: string;
  passwordAdmin!: string;
  emailUserList!: string[];
  emailUser!: string;
  passwordUser!: string[];
  findUser!: any;
  router = inject(Router);

  ngOnInit(): void {
    // Initialiser le formulaire réactif
    this.connexionForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.minLength(8)),
    });
  }

  connexion(): void {
    if (this.connexionForm.invalid) return;

    // Récupération des données administrateur
    this.subscription = this.dataService.getAdmin().subscribe((data) => {
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
    });

    // Récupération des données utilisateur
    this.subscription2 = this.dataService.getUser().subscribe((data) => {
      if (data.length === 0) {
        alert('Aucun utilisateur trouvé !');
        return;
      }
      console.log(data);

      // Création d'un tableau avec tous les emails enregistrés
      this.emailUserList = data.map((user) => user.email);
      console.log(this.emailUserList);
      // Recherche d'une correspondance entre l'email du formulaire et la base de données
      if (this.emailUserList.includes(this.connexionForm.value.email)) {
        this.emailUser = this.connexionForm.value.email;
      } else {
        alert("Cet utilisateur n'existe pas");
      }

      // Stockage de l'utilisateur trouvé dans la base de donnée avec l'e-mail du formulaire
      this.findUser = data.find((user) => user.email === this.emailUser);
      console.log(this.findUser);

      if (this.connexionForm.value.password == this.findUser.password) {
        this.router.navigateByUrl('compte');
      } else {
        alert('Le mot de passe est incorrect.');
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
