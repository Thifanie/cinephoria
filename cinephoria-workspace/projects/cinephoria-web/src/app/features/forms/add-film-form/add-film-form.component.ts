import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../data.service';
import { FilmData } from '../../films/models/film';
import { Type } from '../../films/models/type';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-film-form',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './add-film-form.component.html',
  styleUrl: './add-film-form.component.css',
})
export class AddFilmFormComponent implements OnInit, OnDestroy {
  addFilmForm!: FormGroup;

  showFileName(event: any): void {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const fileNameContainer = document.getElementById('file-name-container')!;
    const fileNameElement = document.getElementById('file-name') as HTMLElement;

    if (file) {
      // Affiche le nom du fichier dans l'élément p
      fileNameElement.textContent = file.name;
      // Affiche la zone contenant le nom du fichier
      fileNameContainer.style.display = 'flex';
    }
  }

  subscription: Subscription | undefined;
  filmData: FilmData = {
    title: '',
    actors: '',
    description: '',
    minAge: 12,
    favorite: false,
    opinion: 0,
    moviePoster: '',
    onView: true,
    type: [],
  };
  types: Type[] = [];
  selectedTypes: Set<number> = new Set(); // Utilisation d'un Set pour éviter les doublons

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire réactif avec un FormArray pour les types
    this.addFilmForm = this.fb.group({
      title: '',
      actors: '',
      description: '',
      minAge: null,
      favorite: false,
      opinion: null,
      moviePoster: '',
      onView: true,
      type: this.fb.group({}),
    });

    // Récupérer les genres de films
    this.dataService.getType().subscribe((data) => {
      console.log('Types récupérés : ', data);
      this.types = data;
      this.setTypes(); // Initialiser les cases à cocher
    });
  }

  // form: FormGroup;
  // items: string[] = ['Banana', 'Apple', 'Beer', 'Water'];

  // this.items.forEach(item => {
  //   this.form.controls['checkboxes'].addControl(item, new FormControl(true));
  // });

  // Créer un FormControl pour chaque type
  setTypes(): void {
    const typeGroup = this.addFilmForm.get('type') as FormGroup;
    if (!typeGroup) return;

    this.types.forEach((type) => {
      if (!typeGroup.contains('type')) {
        typeGroup.addControl('type', new FormControl(false));
      }
    });

    // this.types.forEach((type) => {
    //   this.addFilmForm.controls['type'].addControl(
    //     type,
    //     new FormControl(false)
    //   );
    // });
  }

  addFilm(): void {
    if (this.addFilmForm.invalid) return;
    const filmData = this.addFilmForm.value;
    console.log('Film soumis : ', filmData);
    this.subscription = this.dataService
      .postFilms(filmData)
      .subscribe((data) => {
        console.log('Film ajouté : ', data);
        this.filmData = data;
        // Récupérer à nouveau les films depuis le backend après l'ajout
        this.dataService.getFilms(); // Cela déclenchera la mise à jour dans `FilmsListComponent`
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
