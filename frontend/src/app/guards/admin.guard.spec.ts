import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';

describe('adminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminGuard); // Injecter l'instance de AdminGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
