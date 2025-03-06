import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule,Router } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';
import { Student } from './student';
import { StudentService } from './student.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './authentication.service';
import { authInterceptor } from './auth.interceptor';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[StudentService,AuthenticationService]
})
export class AppComponent {
  title = 'APIClientWithBasicAuthentication';

  constructor(protected authService:AuthenticationService, protected router :Router){}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
