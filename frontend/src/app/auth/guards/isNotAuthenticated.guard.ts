import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first, map } from 'rxjs';

export const isNotAuthenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    first(),
    map((user) => {
      if (user) {
        router.navigateByUrl('/dashboard');
        return false;
      }
      return true;
    })
  );
};
