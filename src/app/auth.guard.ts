import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

export const authGaurd: CanActivateFn = (route, state) => {
  console.log('canACtivate gaurd executed')
 const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};