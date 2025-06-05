import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      google: [false],
      friend: [false],
      otherSource: [false],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    // Load saved data if exists
    const savedFormData = localStorage.getItem('signupFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        this.signupForm.patchValue(parsedData);

        // Manually mark fields as touched if they have values
        Object.keys(parsedData).forEach((key) => {
          if (parsedData[key]) {
            this.signupForm.get(key)?.markAsTouched();
          }
        });
      } catch (e) {
        console.error('Error parsing saved form data', e);
        localStorage.removeItem('signupFormData');
      }
    }

    // Save data on form changes
    this.signupForm.valueChanges.subscribe((value) => {
      localStorage.setItem('signupFormData', JSON.stringify(value));
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      // Get form values
      const formData = this.signupForm.value;
      console.log('Form submitted:', formData);

      // send data to backend
      // this.authService.signup(formData).subscribe(...);

      // Clear saved form data
      localStorage.removeItem('signupFormData');

      // Reset form to initial state
      this.signupForm.reset({
        google: false,
        friend: false,
        otherSource: false,
        terms: false,
      });

      // Optionally mark form as pristine and untouched
      this.signupForm.markAsPristine();
      this.signupForm.markAsUntouched();
    }
  }

  onReset() {
    this.signupForm.reset();
  }
}
