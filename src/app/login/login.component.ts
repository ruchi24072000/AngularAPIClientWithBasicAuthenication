import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthenticationService]
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe:boolean=true;
  errorMessage: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  // Method to handle user login
  login() {
    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: (res) => {
        alert(res.message); 
        this.router.navigate(['/students']); 
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }
}