import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se token presente: lasciamo passare
  if (authService.getToken()) return true;

  // Se una chiamata precedente ha prodotto 401 segnalo esplicitamente
  if (authService.wasUnauthorized()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url, error: 'unauthorized' } });
    return false;
  }

  // Nessun token e nessun 401 registrato: redirect standard
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
