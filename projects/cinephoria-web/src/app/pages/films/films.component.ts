import { Component } from '@angular/core';
import { ListFilmsComponent } from '../../features/films/components/list-films/list-films.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-films',
  imports: [ListFilmsComponent, CommonModule, RouterOutlet],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent {}
