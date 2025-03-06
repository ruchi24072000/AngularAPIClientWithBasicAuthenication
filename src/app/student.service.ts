import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from './student'; // Assuming you have a Student model

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  apiUrl = 'https://localhost:7199/api/Student'; // The URL to the API

  constructor(private http: HttpClient) {}

  /**
   * Get all students with Basic Authentication
   */
  getStudents(): Observable<Student[]> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Student[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching students:', error);
        throw error;
      })
    );
  }

  /**
   * Get a student by ID with Basic Authentication
   */
  getStudentById(id: number): Observable<Student> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Student>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching student details:', error);
        throw error;
      })
    );
  }

/**
   * upload Image 
   */
  
 /**
   * Upload Image
   */
 uploadImage(formData: FormData): Observable<any> {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('No authentication token found');
    return throwError('No authentication token found');
  }

  const headers = new HttpHeaders({
    'Authorization': `Basic ${authToken}`
  });

  return this.http.post<any>(`${this.apiUrl}/upload`, formData, { headers }).pipe(
    catchError(error => {
      console.error('Image upload failed:', error);
      return throwError('Image upload failed. Please try again.');
    })
  );
}

getStudentImage(imageName: string): Observable<Blob> {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('No authentication token found');
    return throwError('No authentication token found');
  }

  const headers = new HttpHeaders({
    'Authorization': `Basic ${authToken}`
  });
  console.log('Authorization Header:', headers.get('Authorization'));
  const imageUrl = `${this.apiUrl}/download?imageName=${imageName}`;
  
  return this.http.get(imageUrl, { headers, responseType: 'blob' }).pipe(
    catchError(error => {
      console.error('Error fetching image:', error);
      return throwError('Error fetching image.');
    })
  );
}

/**
 * Add a student (POST request) with Basic Authentication
 */
addStudent(student: StudentDTO): Observable<Student> {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

  const headers = new HttpHeaders({
    'Authorization': `Basic ${authToken}`,
    'Content-Type': 'application/json',
  });

  return this.http.post<Student>(this.apiUrl, student, { headers }).pipe(
    catchError(error => {
      console.error('Error adding student:', error);
      return throwError('Failed to add student. Please try again.');
    })
  );
}

getImageUrl(imageName: string): string {
  return `${this.apiUrl}/download?imageName=${imageName}`;
}

  /**
   * Update a student's details (PUT request) with Basic Authentication
   */
  updateStudent(id:number,student: StudentUpdateDto): Observable<Student> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<Student>(`${this.apiUrl}/${id}`, student, { headers }).pipe(
      catchError(error => {
        console.error('Error updating student:', error);
        throw error;
      })
    );
  }

  /**
   * Delete a student (DELETE request) with Basic Authentication
   */
  deleteStudent(id: number): Observable<void> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Basic ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting student:', error);
        throw error;
      })
    );
  }
}


export interface StudentDTO {
    fullName:string;
    mobileNo:string;
    email:string;
    dateOfBirth:Date;
    state:string;
    district:string;
    photoPath:string;

}
export interface StudentUpdateDto {
    fullName:string;
    mobileNo:string;
    email:string;
    dateOfBirth:Date;
    state:string;
    district:string;
    photoPath:string;
}