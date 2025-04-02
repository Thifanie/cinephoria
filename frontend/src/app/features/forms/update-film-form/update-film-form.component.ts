import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Film, FilmData } from '../../films/models/film';
import { Type } from '../../films/models/type';
import { DataService } from '../../../data.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-update-film-form',
  imports: [NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './update-film-form.component.html',
  styleUrl: './update-film-form.component.css',
  standalone: true,
})
export class UpdateFilmFormComponent implements OnInit, OnChanges {
  updateFilmForm!: FormGroup;
  subs: Subscription[] = [];
  @Input() listTypes!: Type[];
  @Input() listFilms: Film[] = [];

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
  selectedTypes: Set<number> = new Set(); // Utilisation d'un Set pour éviter les doublons
  selectedFilm: Film | null = null;
  moviePosterPath: string = '';
  fileName: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    this.updateFilmForm = this.fb.group({
      title: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(100)],
      ],
      actors: ['', [Validators.required, Validators.maxLength(300)]],
      description: ['', [Validators.required, Validators.maxLength(999)]],
      minAge: [null, [Validators.min(12), Validators.max(18)]],
      favorite: false,
      opinion: [null, [Validators.min(0), Validators.max(5)]],
      moviePoster: ['', [Validators.required, Validators.maxLength(100)]],
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
    if (!this.updateFilmForm) return; // Vérifie que le formulaire est initialisé

    const typeGroup = this.updateFilmForm.get('typeForm') as FormGroup;
    if (!typeGroup) return;

    this.listTypes.forEach((type) => {
      if (!typeGroup.contains(type.id.toString())) {
        typeGroup.addControl(type.id.toString(), new FormControl(false));
      }
    });
  }

  showFileName(event: any): void {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    const fileNameContainer = document.getElementById(
      'update-file-name-container'
    )!;
    const fileNameElement = document.getElementById(
      'update-file-name'
    ) as HTMLElement;

    if (file) {
      const fileName = file.name; // Récupère uniquement le nom du fichier
      console.log('Fichier sélectionné : ', fileName);

      // Affiche le nom du fichier dans l'élément p
      fileNameElement.textContent = fileName;
      // Affiche la zone contenant le nom du fichier
      fileNameContainer.style.display = 'flex';

      const newPath = 'assets/movie-posters/' + fileName;
      this.moviePosterPath = newPath;
    }
  }

  selectFilm(film: Film): void {
    this.selectedFilm = film;

    // Initialiser le groupe de types dans le formulaire
    const typeGroup = this.updateFilmForm.get('typeForm') as FormGroup;

    // Réinitialiser les types sélectionnés
    this.selectedTypes.clear();

    // Diviser la chaîne de types (par exemple "Aventure, Action") en un tableau de types
    const filmTypes = film.type.split(',').map((type) => type.trim()); // On sépare par ", " et on nettoie les espaces

    // Ajouter les types associés au film sélectionné dans 'selectedTypes'
    filmTypes.forEach((type) => {
      // Chercher le type dans la liste des types récupérés
      const matchedType = this.listTypes.find((t) => t.type === type);
      if (matchedType) {
        this.selectedTypes.add(matchedType.id); // Ajoute l'ID du type au Set
      }
    });

    // Mettre à jour les cases à cocher en fonction des types du film sélectionné
    this.listTypes.forEach((type) => {
      const control = typeGroup.get(type.id.toString()) as FormControl;
      if (control) {
        control.setValue(this.selectedTypes.has(type.id)); // Coche la case si le type est associé au film
      }
    });

    // Met à jour l'affiche du film si elle existe
    this.moviePosterPath = film.movieposter;

    this.updateFilmForm.patchValue({
      title: film.title,
      actors: film.actors,
      description: film.description,
      minAge: film.minage,
      favorite: film.favorite,
      opinion: film.opinion,
      moviePoster: this.moviePosterPath,
      onView: film.onview,
      typeForm: this.updateFilmForm.get('typeForm'),
    });
  }

  updateFilm(): void {
    if (this.updateFilmForm.invalid)
      return alert('Un ou plusieurs champs du formulaire sont invalides.');

    const typeGroup = this.updateFilmForm.get('typeForm') as FormGroup;
    // Récupérer les types sélectionnés
    const selectedTypes = Object.keys(typeGroup.controls)
      .filter((key) => typeGroup.get(key)?.value) // Filtrer les types sélectionnés
      .map((key) => Number(key)); // Convertir les clés (IDs) en nombres

    //Mise à jour des données du film à modifier
    console.log('IDs des types sélectionnés : ', selectedTypes);
    const updateFilmData = {
      ...this.updateFilmForm.value,
      moviePoster: this.moviePosterPath,
      types: selectedTypes,
    };
    console.log('Données du film à modifier : ', updateFilmData);

    this.subs.push(
      this.dataService
        .updateFilm(updateFilmData.title, updateFilmData)
        .subscribe((data) => {
          console.log('Film modifié : ', data);
          this.filmData = data;
          alert(`Le film ${updateFilmData.title} a été modifié.`);
          // Réinitialisation du formulaire
          this.updateFilmForm.reset();
          this.moviePosterPath = '';
          this.selectedTypes.clear();
          const fileNameElement = document.getElementById(
            'update-file-name'
          ) as HTMLElement;
          fileNameElement.textContent = '';
          // Récupérer à nouveau les films depuis le backend après l'ajout
          this.dataService.getFilms(); // Cela déclenchera la mise à jour dans `FilmsListComponent`
        })
    );
  }

  deleteFilm(): void {
    const deleteFilmData = {
      ...this.updateFilmForm.value,
      moviePoster: this.moviePosterPath,
    };
    const confirmation = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce film ? Cet action est irréversible.'
    );
    if (confirmation) {
      console.log('Titre du film à supprimer : ', deleteFilmData.title);

      // Suppression du film de la liste des films pour le dropdown
      this.listFilms = this.listFilms.filter(
        (film) => film.title !== deleteFilmData.title
      );

      // Réinitialisation du formulaire
      this.resetForm();

      this.subs.push(
        this.dataService
          .deleteFilm(deleteFilmData.title, deleteFilmData)
          .subscribe((data) => {
            console.log('Données du film à supprimer : ', data);
            alert(`Le film ${deleteFilmData.title} a été supprimé.`);

            // Récupérer à nouveau les films depuis le backend après la suppression
            this.dataService.getFilms(); // Cela déclenchera la mise à jour dans `FilmsListComponent`
          })
      );
    } else {
      alert('La suppression a été annulée.');
      console.log('Suppression annulée !');
    }
  }

  resetForm(): void {
    this.updateFilmForm.reset();

    const fileNameElement = document.getElementById(
      'update-file-name'
    ) as HTMLElement;
    fileNameElement.textContent = '';

    // Réinitialiser les autres variables si nécessaire
    this.moviePosterPath = '';
    this.selectedTypes.clear();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
