import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFilmFormComponent } from './update-film-form.component';

describe('UpdateFilmFormComponent', () => {
  let component: UpdateFilmFormComponent;
  let fixture: ComponentFixture<UpdateFilmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFilmFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFilmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
