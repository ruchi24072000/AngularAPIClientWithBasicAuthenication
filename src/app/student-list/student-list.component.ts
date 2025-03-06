import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentDetailsComponent } from '../student-details/student-details.component';
import { Student } from '../student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [FormsModule, CommonModule, StudentDetailsComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  Students: Student[] = [];  // List of students
  currentStudent: Student | null = null;  // Active student
  currentIndex: number = -1;  // Index of active student
  currentImage: string = ''; 

  constructor(private StudentService: StudentService) {}

  ngOnInit(): void {
    this.retrieveStudents();
  }

  retrieveStudents(): void {
    this.StudentService.getStudents().subscribe({
      next: (data) => {
        this.Students = data || []; // Ensure it's always an array
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  setActiveStudent(student: Student, index: number): void {
    // Toggle logic: If the same student is clicked again, clear the selection
    if (this.currentStudent?.id === student.id) {
      this.currentStudent = null;
      this.currentIndex = -1;
    } else {
      this.currentStudent = student;
      this.currentIndex = index;
      console.log(this.currentIndex, this.currentStudent);
      this.loadStudentImage(this.currentStudent.photoPath);
    }
  }

  loadStudentImage(imageName: string): void {
    this.StudentService.getStudentImage(imageName).subscribe((imageBlob: Blob) => {
      const imageUrl = URL.createObjectURL(imageBlob);
      this.currentImage = imageUrl;
    });
  }

  getImageUrl(imageName: string): string {
    const sanitizedImageName = imageName.startsWith('/') ? imageName.slice(1) : imageName;
    return `${this.StudentService.apiUrl}/download?imageName=${sanitizedImageName}`;
  }

  refreshList(): void {
    this.retrieveStudents();
    this.currentStudent = null;
    this.currentIndex = -1;
  }

  trackStudent(index: number, student: Student): number {
    return student.id;
  }

   // Handle student update event from child component
   onStudentUpdated(updatedStudent: Student): void {
    const index = this.Students.findIndex(student => student.id === updatedStudent.id);
    if (index >= 0) {
      this.Students[index] = updatedStudent;
    }
    this.retrieveStudents();
   
    this.currentStudent = null; // Close details view after update
    console.log('update done');
  }

  // Handle student delete event from child component
  onStudentDeleted(deletedStudentId: number): void {
    const index = this.Students.findIndex(student => student.id === deletedStudentId);
    if (index >= 0) {
      this.Students.splice(index, 1);
    } 
      this.retrieveStudents();
   
    this.currentStudent = null; // Close details view
  }

 

  isDetailsVisible(studentId: number|undefined): boolean {

    return this.currentStudent?.id === studentId;
  }

}
