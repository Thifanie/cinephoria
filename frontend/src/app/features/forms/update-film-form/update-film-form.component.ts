import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
export class UpdateFilmFormComponent implements OnInit {
  updateFilmForm!: FormGroup;
  subs: Subscription[] = [];
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
  listFilms: Film[] = [];
  selectedFilm: Film | null = null;
  moviePosterPath: string = '';
  fileName: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    // Appel pour récupérer la liste des films lors de l'initialisation du composant
    this.dataService.getFilms();

    this.subs = [
      this.dataService.films$.subscribe((films: Film[]) => {
        this.listFilms = films;
        console.log('Films récupérés', this.listFilms);
      }),
      // Récupérer les genres de films
      this.dataService.getType().subscribe((data: Type[]) => {
        console.log('Types récupérés : ', data);
        this.types = data;
        this.setTypes(); // Initialiser les cases à cocher
      }),
    ];

    this.updateFilmForm = this.fb.group({
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

  showFileName(event: any): void {
    console.log('Événement déclenché !', event);

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

  // Créer un FormControl pour chaque type
  setTypes(): void {
    const typeGroup = this.updateFilmForm.get('typeForm') as FormGroup;
    if (!typeGroup) return;

    this.types.forEach((type) => {
      if (!typeGroup.contains(type.id.toString())) {
        typeGroup.addControl(type.id.toString(), new FormControl(false));
      }
    });
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
      const matchedType = this.types.find((t) => t.type === type);
      if (matchedType) {
        this.selectedTypes.add(matchedType.id); // Ajoute l'ID du type au Set
      }
    });

    // Mettre à jour les cases à cocher en fonction des types du film sélectionné
    this.types.forEach((type) => {
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
    if (this.updateFilmForm.invalid) return;

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
      this.updateFilmForm.reset();
      this.moviePosterPath = '';
      this.selectedTypes.clear();
      const fileNameElement = document.getElementById(
        'update-file-name'
      ) as HTMLElement;
      fileNameElement.textContent = '';

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

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
