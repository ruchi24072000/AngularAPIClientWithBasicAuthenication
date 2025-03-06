import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../student';
import { StudentService, StudentUpdateDto } from '../student.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit, OnChanges {
  @Input() viewMode = false;
  @Input() currentStudent: Student | null = null;  
  @Output() studentUpdated = new EventEmitter<Student>();
  @Output() studentDeleted = new EventEmitter<number>(); 

  studentForm: FormGroup;
  selectedFile: File | null = null;
  message = '';
  studentImageUrl: SafeUrl | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private sanitizer: DomSanitizer
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

  ngOnInit(): void {
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStudent']) {
      this.populateForm();
    }
  }

  populateForm(): void {
    if (this.currentStudent) {
      this.studentForm.patchValue(this.currentStudent);
      if (this.currentStudent.photoPath) {
        this.loadStudentImage(this.currentStudent.photoPath);
      }
    }
  }

  loadStudentImage(imageName: string): void {
    if (!imageName) return;

    this.studentService.getStudentImage(imageName).subscribe({
      next: (imageBlob) => {
        if (imageBlob.size === 0) return;

        const imageUrl = URL.createObjectURL(imageBlob);
        this.studentImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      },
      error: (e) => console.error('Error fetching image:', e)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.studentImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateStudent(): void {
    if (this.studentForm.invalid || !this.currentStudent) return;

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      // Upload the image first
      this.studentService.uploadImage(formData).subscribe((response: any) => {
        console.log(response+' '+response.filePath)
        if (response && response.filePath) {
          this.studentForm.patchValue({ photoPath: response.filePath });
        }

        // Now update student data
        this.submitStudentUpdate();
      });
    } else {
      this.submitStudentUpdate();
    }
  }

  submitStudentUpdate(): void {
    if (!this.currentStudent) return;

    const updateData: StudentUpdateDto = this.studentForm.value;
    this.studentService.updateStudent(this.currentStudent.id, updateData).subscribe({
      next: (updatedStudent) => {
        this.message = 'Student updated successfully!';
        this.studentUpdated.emit(updatedStudent);
      },
      error: (e) => {
        console.error(e);
        this.message = 'Error updating Student';
      }
    });
  }

  deleteStudent(): void {
    if (!this.currentStudent || !this.currentStudent.id) return;

    this.studentService.deleteStudent(this.currentStudent.id).subscribe({
      next: () => {
        this.message = 'Student deleted successfully!';
        this.studentUpdated.emit(this.currentStudent!);
      },
      error: (e) => {
        console.error('Error deleting student:', e);
        this.message = 'Error deleting student';
      }
    });
  }
  toggleEditMode() {
    this.viewMode = !this.viewMode;
    if (!this.viewMode && this.currentStudent) {
      this.studentForm.patchValue(this.currentStudent);
    }
  }
  
}




/*import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Student } from '../student';
import { StudentService, StudentUpdateDto } from '../student.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit, OnChanges {
  @Input() viewMode = false;
  @Input() currentStudent: Student | null = null;  
  @Output() StudentUpdated = new EventEmitter<Student>();

  message = '';
  studentImageUrl: SafeUrl | null = null;

  constructor(
    private StudentService: StudentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.currentStudent?.photoPath) {
      this.loadStudentImage(this.currentStudent.photoPath);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStudent'] && this.currentStudent?.photoPath) {
      this.loadStudentImage(this.currentStudent.photoPath);
    }
  }

  loadStudentImage(imageName: string): void {
    if (!imageName) return;

    this.StudentService.getStudentImage(imageName).subscribe({
      next: (imageBlob) => {
        if (imageBlob.size === 0) return;

        const imageUrl = URL.createObjectURL(imageBlob);
        this.studentImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      },
      error: (e) => console.error('Error fetching image:', e)
    });
  }

  updateStudent(): void {
    if (!this.currentStudent) return;

    const updateData: StudentUpdateDto = {
      fullName: this.currentStudent.fullName,
      mobileNo: this.currentStudent.mobileNo,
      email: this.currentStudent.email,
      dateOfBirth: this.currentStudent.dateOfBirth,
      state: this.currentStudent.state,
      district: this.currentStudent.district,
      photoPath: this.currentStudent.photoPath
    };

    this.StudentService.updateStudent(this.currentStudent.id, updateData).subscribe({
      next: (updatedStudent) => {
        this.message = 'Student updated successfully!';
        this.StudentUpdated.emit(updatedStudent);
      },
      error: (e) => {
        console.error(e);
        this.message = 'Error updating Student';
      }
    });
  }

  deleteStudent(): void {
    if (!this.currentStudent || !this.currentStudent.id) {
      console.warn('No student selected for deletion');
      return;
    }

    this.StudentService.deleteStudent(this.currentStudent.id).subscribe({
      next: () => {
        console.log('Student deleted successfully');
        this.message = 'Student deleted successfully!';
        this.StudentUpdated.emit(this.currentStudent!);  // Notify parent component
      },
      error: (e) => {
        console.error('Error deleting student:', e);
        this.message = 'Error deleting student';
      }
    });
  }

  toggleEditMode(): void {
    this.viewMode = !this.viewMode;
  }

  getImageUrl(): SafeUrl | null {
    return this.studentImageUrl;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        this.studentImageUrl = reader.result as string;
      };
  
      reader.readAsDataURL(file);
  
      // Store the selected file (to upload later)
      this.currentStudent!.photoPath = file.name;
    }
  }
}
*/