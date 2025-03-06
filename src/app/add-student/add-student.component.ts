import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {
  studentForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private http: HttpClient
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      photoPath: ['']
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      this.selectedFile = file;
    }
  }
  

  onSubmit(): void {
    console.log('Form Valid:', this.studentForm.valid);
    console.log(this.studentForm.value);
  
    if (!this.selectedFile) {
      alert('Please select an image to upload.');
      return;
    }
  
    // Check if the form is valid before proceeding
    if (this.studentForm.invalid) {
      console.error('Form is invalid');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
  
    // Upload the image and get the file path
    this.studentService.uploadImage(formData).subscribe((response: any) => {
      if (response && response.filePath) {
        this.studentForm.patchValue({ photoPath: response.filePath });
  
        // Now submit the student data including the photoPath
        const studentData = { ...this.studentForm.value };
        console.log('Student data to be added:', studentData);
  
        // Make sure to call addStudent only after the image has been uploaded successfully
        this.studentService.addStudent(studentData).subscribe(
          (response) => {
            console.log('Student added successfully:', response);
          },
          (error) => {
            console.error('Error adding student:', error);
          }
        );
      } else {
        console.error('Image upload failed');
      }
    });
  }
  
  
  
  
}
