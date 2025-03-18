import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilmFormComponent } from './add-film-form.component';

describe('AddFilmComponent', () => {
  let component: AddFilmFormComponent;
  let fixture: ComponentFixture<AddFilmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFilmFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFilmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
