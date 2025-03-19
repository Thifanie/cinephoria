import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Film } from '../../films/models/film';
import { Cinema } from '../../films/models/cinema';
import { Room } from '../../films/models/room';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { DataService } from '../../../data.service';
import { Subscription } from 'rxjs';
import { DateTimeFormattingService } from '../../films/services/date-time-formatting.service';

@Component({
  selector: 'app-add-session-form',
  imports: [ReactiveFormsModule, NgFor, NgClass],
  templateUrl: './add-session-form.component.html',
  styleUrl: './add-session-form.component.css',
})
export class AddSessionFormComponent implements OnInit, OnDestroy {
  @Input() listFilms: Film[] = [];
  @Input() listCinemas: Cinema[] = [];

  addSessionForm!: FormGroup;
  selectedFilm!: Film;
  selectedCinema!: Cinema;
  selectedRoom!: Room;
  subs: Subscription[] = [];
  listRooms: Room[] = [];
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService,
    private readonly dateFormattingService: DateTimeFormattingService
  ) {}

  ngOnInit(): void {
    // Initialiser le formulaire réactif
    this.addSessionForm = this.fb.group({
      filmTitle: '',
      cinema: '',
      room: '',
      date: Date,
      startHour: Date,
      endHour: Date,
    });
  }

  selectFilm(film: Film): void {
    this.selectedFilm = film;

    this.addSessionForm.patchValue({
      filmTitle: film.title,
    });

    console.log(
      'Formulaire après sélection du film :',
      this.addSessionForm.value
    );
  }

  selectCinema(cinema: Cinema): void {
    this.selectedCinema = cinema;

    this.addSessionForm.patchValue({
      cinema: cinema.name,
      room: '',
    });

    console.log(
      'Formulaire après sélection du cinéma :',
      this.addSessionForm.value
    );

    this.subs.push(
      this.dataService.getRoomByCinema(cinema.name).subscribe((data) => {
        this.listRooms = data;
        console.log(
          `Salles récupérées du cinéma ${cinema.name} : `,
          this.listRooms
        );
      })
    );

    this.selectedRoom = {
      id: 0,
      name: '',
      places: 0,
      idCinema: 0,
      idQuality: 0,
    };
  }

  selectRoom(room: Room): void {
    this.selectedRoom = room;

    this.addSessionForm.patchValue({
      room: room.name,
    });

    console.log(
      'Formulaire après sélection de la salle :',
      this.addSessionForm.value
    );
  }

  addSession(): void {
    console.log('Formulaire rempli : ', this.addSessionForm.value);
    const sessionDate = new Date(this.addSessionForm.get('date')?.value);
    const formatedDate = this.dateFormattingService.dateFormatting(sessionDate);
    console.log('Date formatée : ', formatedDate);

    const sessionData = {
      ...this.addSessionForm.value,
      date: formatedDate,
    };

    console.log('Session soumise : ', sessionData);

    this.subs.push(
      this.dataService.postSession(sessionData).subscribe((data) => {
        console.log('blabla');
        console.log('Session ajoutée : ', data);
        alert(
          `La séance pour ${sessionData.filmTitle} le ${data.date} a été ajoutée.`
        );
        // Réinitialisation du formulaire
        this.resetForm();
      })
    );
  }

  resetForm(): void {
    this.addSessionForm.reset();

    // Réinitialiser les autres variables si nécessaire
    this.selectedFilm = {
      id: 0,
      title: '',
      actors: '',
      description: '',
      minage: 0,
      favorite: false,
      opinion: 0,
      movieposter: '',
      onview: true,
      type: '',
    };

    this.selectedCinema = { id: 0, name: '' };

    this.selectedRoom = {
      id: 0,
      name: '',
      places: 0,
      idCinema: 0,
      idQuality: 0,
    };
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
