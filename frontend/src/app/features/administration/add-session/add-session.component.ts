import { Component, Input, ViewChild } from '@angular/core';
import { AddSessionFormComponent } from '../../forms/add-session-form/add-session-form.component';
import { Subscription } from 'rxjs';
import { Film } from '../../films/models/film';
import { MenuService } from '../../menus/menu.service';
import { Cinema } from '../../films/models/cinema';

@Component({
  selector: 'app-add-session',
  imports: [AddSessionFormComponent],
  templateUrl: './add-session.component.html',
  styleUrl: './add-session.component.css',
})
export class AddSessionComponent {
  isOpen = false; // État local pour savoir si le menu est ouvert
  subscription!: Subscription;
  showForm = true; // Contrôle le rendu du formulaire
  @Input() listFilms: Film[] = [];
  @Input() listCinemas: Cinema[] = [];
  @ViewChild(AddSessionFormComponent)
  addSessionFormComponent!: AddSessionFormComponent;

  constructor(private readonly menuService: MenuService) {}

  ngOnInit() {
    // Abonnement pour écouter les changements de menu
    this.subscription = this.menuService.activeMenu$.subscribe((activeMenu) => {
      const wasOpen = this.isOpen;
      this.isOpen = activeMenu === 'addSession';

      // Si le menu se ferme (que ce soit en cliquant ailleurs ou via un autre menu), réinitialiser le formulaire
      if (wasOpen && !this.isOpen) {
        // this.addSessionFormComponent.resetForm();
      }
    });
  }

  toggleMenu() {
    // Si le menu est ouvert, on le ferme, sinon on informe les autres qu’on l’ouvre
    this.isOpen = !this.isOpen;
    this.menuService.setActiveMenu(this.isOpen ? 'addSession' : null);

    // Réinitialise le formulaire directement si on ferme sans transition
    if (!this.isOpen) {
      // this.addSessionFormComponent.resetForm();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
