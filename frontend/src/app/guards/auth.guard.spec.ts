import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  let auth: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthGuard); // Injecter l'instance de AdminGuard
  });

  it('should be created', () => {
    expect(auth).toBeTruthy();
  });
});
