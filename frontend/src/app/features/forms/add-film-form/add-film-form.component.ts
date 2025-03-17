import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../data.service';
import { Film, FilmData } from '../../films/models/film';
import { Type } from '../../films/models/type';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-film-form',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './add-film-form.component.html',
  styleUrl: './add-film-form.component.css',
  standalone: true,
})
export class AddFilmFormComponent implements OnInit, OnDestroy, OnChanges {
  addFilmForm!: FormGroup;
  addFilmMoviePosterPath: string = '';
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
  @Input() listTypes: Type[] = [];
  @Input() listFilms: Film[] = [];
  selectedTypes: Set<number> = new Set(); // Utilisation d'un Set pour éviter les doublons

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService
  ) {}

  showFileName(event: any): void {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const fileNameContainer = document.getElementById('file-name-container')!;
    const fileNameElement = document.getElementById('file-name') as HTMLElement;

    if (file) {
      const fileName = file.name; // Récupère uniquement le nom du fichier
      // Affiche le nom du fichier dans l'élément p
      fileNameElement.textContent = fileName;
      // Affiche la zone contenant le nom du fichier
      fileNameContainer.style.display = 'flex';

      const newPath = 'assets/movie-posters/' + fileName;
      this.addFilmMoviePosterPath = newPath;
    }
  }

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
      typeForm: this.fb.group({}),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listTypes'] && this.listTypes?.length) {
      this.setTypes(); // Initialiser les cases à cocher
    }
  }

  // Créer un FormControl pour chaque type
  setTypes(): void {
    const typeGroup = this.addFilmForm.get('typeForm') as FormGroup;
    if (!typeGroup) return;

    this.listTypes.forEach((type) => {
      if (!typeGroup.contains(type.id.toString())) {
        typeGroup.addControl(type.id.toString(), new FormControl(false));
      }
    });
  }

  addFilm(): void {
    if (this.addFilmForm.invalid) return;
    console.log("Chemin de l'image:", this.addFilmMoviePosterPath);

    const typeGroup = this.addFilmForm.get('typeForm') as FormGroup;
    // Récupérer les types sélectionnés
    const selectedTypes = Object.keys(typeGroup.controls)
      .filter((key) => typeGroup.get(key)?.value) // Filtrer les types sélectionnés
      .map((key) => Number(key)); // Convertir les clés (IDs) en nombres

    console.log('IDs des types sélectionnés : ', selectedTypes);

    // Mise à jour du chemin de l'image téléchargée dans le formulaire
    const filmData = {
      ...this.addFilmForm.value,
      moviePoster: this.addFilmMoviePosterPath,
      types: selectedTypes,
    };

    console.log('Film soumis : ', filmData);
    this.subscription = this.dataService
      .postFilms(filmData)
      .subscribe((data: FilmData) => {
        console.log('Film ajouté : ', data);
        this.filmData = data;
        alert(`Le film ${data.title} a été ajouté.`);
        // Réinitialisation du formulaire
        this.resetForm();
        // Récupérer à nouveau les films depuis le backend après l'ajout
        this.dataService.getFilms(); // Cela déclenchera la mise à jour dans `FilmsListComponent`
      });
  }

  resetForm(): void {
    this.addFilmForm.reset();

    const fileNameElement = document.getElementById('file-name') as HTMLElement;
    fileNameElement.textContent = '';

    // Réinitialiser les autres variables si nécessaire
    this.addFilmMoviePosterPath = '';
    this.selectedTypes.clear();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
