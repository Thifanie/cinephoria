import { Component, Input, ViewChild } from '@angular/core';
import { UpdateFilmFormComponent } from '../../forms/update-film-form/update-film-form.component';
import { Subscription } from 'rxjs';
import { MenuService } from '../../menus/menu.service';
import { Type } from '../../films/models/type';
import { Film } from '../../films/models/film';

@Component({
  selector: 'app-update-film',
  imports: [UpdateFilmFormComponent],
  templateUrl: './update-film.component.html',
  styleUrl: './update-film.component.css',
})
export class UpdateFilmComponent {
  isOpen = false; // État local pour savoir si le menu est ouvert
  subscription!: Subscription;
  @Input() listTypes: Type[] = [];
  @Input() listFilms: Film[] = [];
  @ViewChild(UpdateFilmFormComponent)
  updateFilmFormComponent!: UpdateFilmFormComponent;

  constructor(private readonly menuService: MenuService) {}

  ngOnInit() {
    this.subscription = this.menuService.activeMenu$.subscribe((activeMenu) => {
      const wasOpen = this.isOpen;
      this.isOpen = activeMenu === 'updateFilm';

      // Si le menu se ferme (que ce soit en cliquant ailleurs ou via un autre menu), réinitialiser le formulaire
      if (wasOpen && !this.isOpen) {
        this.updateFilmFormComponent.resetForm();
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuService.setActiveMenu(this.isOpen ? 'updateFilm' : null);

    // Réinitialise le formulaire directement si on ferme sans transition
    if (!this.isOpen) {
      this.updateFilmFormComponent.resetForm();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
