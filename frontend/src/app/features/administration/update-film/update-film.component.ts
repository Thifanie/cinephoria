import { Component } from '@angular/core';
import { UpdateFilmFormComponent } from '../../forms/update-film-form/update-film-form.component';
import { Subscription } from 'rxjs';
import { MenuService } from '../../menus/menu.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-update-film',
  imports: [UpdateFilmFormComponent, NgIf],
  templateUrl: './update-film.component.html',
  styleUrl: './update-film.component.css',
})
export class UpdateFilmComponent {
  isOpen = false; // État local pour savoir si le menu est ouvert
  subscription!: Subscription;
  showForm = true; // Contrôle le rendu du formulaire

  constructor(private readonly menuService: MenuService) {}

  ngOnInit() {
    this.menuService.activeMenu$.subscribe((activeMenu) => {
      const wasOpen = this.isOpen;
      this.isOpen = activeMenu === 'updateFilm';

      // Si le menu se ferme (que ce soit en cliquant ailleurs ou via un autre menu), réinitialiser le formulaire
      if (wasOpen && !this.isOpen) {
        this.resetForm();
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuService.setActiveMenu(this.isOpen ? 'updateFilm' : null);

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
