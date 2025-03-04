import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const roleGuard: CanActivateFn = (route): true | false => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUserRole = authService.user?.role;

  if (!currentUserRole) {
    console.error('No current user role found.');
    router.navigate(['/home']).then(r => r);
    return false;
  }

  const allowedRoles = route.data?.['roles'];
  if (!allowedRoles) {
    console.error('No roles specified in route data.');
    router.navigate(['/home']).then(r => r);
    return false;
  }

  if (!allowedRoles.includes(currentUserRole)) {
    console.warn(`Access denied. Current role: ${currentUserRole}, Allowed roles: ${allowedRoles}`);
    router.navigate(['/home']).then(r => r);
    return false;
  }

  return true;
};
