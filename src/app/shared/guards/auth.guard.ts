import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../data-access/auth.service";
import { inject } from "@angular/core";


export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
      return true;
    }

    return router.parseUrl('auth/login');
  }
}
