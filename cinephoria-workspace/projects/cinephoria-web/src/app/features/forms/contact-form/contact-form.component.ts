import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  contactForm = new FormGroup({
    nomUser: new FormControl(''),
    objet: new FormControl(''),
    description: new FormControl(''),
  });

  contact(): void {
    if (this.contactForm.invalid) return;
    console.log(this.contactForm.value);
  }
}
