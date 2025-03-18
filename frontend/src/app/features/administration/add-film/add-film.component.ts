import { Component, Input, ViewChild } from '@angular/core';
import { AddFilmFormComponent } from '../../forms/add-film-form/add-film-form.component';
import { MenuService } from '../../menus/menu.service';
import { Subscription } from 'rxjs';
import { Type } from '../../films/models/type';
import { Film } from '../../films/models/film';

@Component({
  selector: 'app-add-film',
  imports: [AddFilmFormComponent],
  templateUrl: './add-film.component.html',
  styleUrl: './add-film.component.css',
})
export class AddFilmComponent {
  isOpen = false; // État local pour savoir si le menu est ouvert
  subscription!: Subscription;
  showForm = true; // Contrôle le rendu du formulaire
  @Input() listTypes: Type[] = [];
  @Input() listFilms: Film[] = [];
  @ViewChild(AddFilmFormComponent)
  addFilmFormComponent!: AddFilmFormComponent;

  constructor(private readonly menuService: MenuService) {}

  ngOnInit() {
    // Abonnement pour écouter les changements de menu
    this.subscription = this.menuService.activeMenu$.subscribe((activeMenu) => {
      const wasOpen = this.isOpen;
      this.isOpen = activeMenu === 'addFilm';

      // Si le menu se ferme (que ce soit en cliquant ailleurs ou via un autre menu), réinitialiser le formulaire
      if (wasOpen && !this.isOpen) {
        this.addFilmFormComponent.resetForm();
      }
    });
  }

  toggleMenu() {
    // Si le menu est ouvert, on le ferme, sinon on informe les autres qu’on l’ouvre
    this.isOpen = !this.isOpen;
    this.menuService.setActiveMenu(this.isOpen ? 'addFilm' : null);

    // Réinitialise le formulaire directement si on ferme sans transition
    if (!this.isOpen) {
      this.addFilmFormComponent.resetForm();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
