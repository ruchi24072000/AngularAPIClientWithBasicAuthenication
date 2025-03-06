import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router for navigation

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'https://localhost:7199/api/User';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method with Basic Authentication
  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    // Encode email and password as Basic Auth credentials
    const credentials = btoa(`${email}:${password}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });

    // Send the POST request with body and headers
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {}, { headers }).pipe(
      map(response => {
        // If login is successful, store the credentials (Base64 string) in localStorage
        if (response.message === 'Login successful') {
          localStorage.setItem('authToken', credentials); // Store credentials for Basic Auth
        }
        return response;
      }),
      catchError((error) => {
        // Handle login failure (e.g., wrong credentials)
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  // Logout Method
  logout(): void {
    // Remove the credentials from local storage when logging out
    localStorage.removeItem('authToken');
    // Optionally navigate to the login page after logout
    this.router.navigate(['/login']);
  }

  // Check if the user is logged in (by checking if the credentials are stored in localStorage)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get Auth Header for API requests (uses credentials from localStorage)
  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Basic ${token}`, // Use the stored credentials for Basic Auth
      'Content-Type': 'application/json'
    });
  }
}

// LoginResponse interface with message
interface LoginResponse {
  message: string;
}
