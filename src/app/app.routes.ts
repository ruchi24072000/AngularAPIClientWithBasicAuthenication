
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { authGaurd } from './auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'Students', pathMatch: 'full' },
    { path: 'Students', component:StudentListComponent },
    { path: 'Students/:id', component:StudentDetailsComponent ,canActivate: [authGaurd]  },
    { path: 'Add', component: AddStudentComponent },
    { path: 'login', component: LoginComponent },
    {path:'**', component:ErrorComponent} 
  ];