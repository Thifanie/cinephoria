import { Component } from '@angular/core';
import { AddFilmFormComponent } from '../../forms/add-film-form/add-film-form.component';
import { MenuService } from '../../menus/menu.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-film',
  imports: [AddFilmFormComponent, NgIf],
  templateUrl: './add-film.component.html',
  styleUrl: './add-film.component.css',
})
export class AddFilmComponent {
  isOpen = false; // État local pour savoir si le menu est ouvert
  subscription!: Subscription;
  showForm = true; // Contrôle le rendu du formulaire

  constructor(private readonly menuService: MenuService) {}

  ngOnInit() {
    // Abonnement pour écouter les changements de menu
    this.subscription = this.menuService.activeMenu$.subscribe((activeMenu) => {
      const wasOpen = this.isOpen;
      this.isOpen = activeMenu === 'addFilm';

      // Si le menu se ferme (que ce soit en cliquant ailleurs ou via un autre menu), réinitialiser le formulaire
      if (wasOpen && !this.isOpen) {
        this.resetForm();
      }
    });
  }

  toggleMenu() {
    // Si le menu est ouvert, on le ferme, sinon on informe les autres qu’on l’ouvre
    this.isOpen = !this.isOpen;
    this.menuService.setActiveMenu(this.isOpen ? 'addFilm' : null);

    // Réinitialise le formulaire directement si on ferme sans transition
    if (!this.isOpen) {
      this.resetForm();
    }
  }

  resetForm() {
    this.showForm = false;
    setTimeout(() => (this.showForm = true), 0); // Force le rechargement du composant
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
