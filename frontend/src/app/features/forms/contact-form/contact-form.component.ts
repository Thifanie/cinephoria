import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  contactForm = new FormGroup({
    nomUser: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    objet: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
  });

  contact(): void {
    if (this.contactForm.invalid)
      return alert('Un ou plusieurs champs du formulaire sont invalides.');
  }
}
