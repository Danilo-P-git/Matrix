import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
// Simplified: no async wait; backend will enforce authorization.
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // If user already in memory, enforce client-side constraints for UX immediato
  const user = authService.currentUser;
  if (user) {
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length && !requiredRoles.some(r => authService.hasRole(r))) {
      router.navigate(['/unauthorized']);
      return false;
    }
    const requiredPermissions = route.data['permissions'] as string[];
    if (requiredPermissions && requiredPermissions.length && !requiredPermissions.some(p => authService.hasPermission(p))) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  // If user not yet loaded we allow; components / API calls will 401/403 if non autorizzato
  return true;
};
