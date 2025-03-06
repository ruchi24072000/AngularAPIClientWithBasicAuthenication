import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

// Interceptor to add Authorization header
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Get the auth token (from localStorage or any other source)
  const authToken = authService.getAuthHeader().get('Authorization') || '';

  // Clone the request and add the Authorization header
  const authReq = req.clone({
    setHeaders: { Authorization: authToken }
  });

  // Proceed with the request and handle errors
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/login']);
      }
      throw error;
    })
  );
};
