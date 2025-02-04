import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListFilmsComponent } from './features/films/components/list-films/list-films.component';
import { NavComponent } from './features/menus/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListFilmsComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cinephoria-web';
}
