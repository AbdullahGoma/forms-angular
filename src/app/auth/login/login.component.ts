import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  reactiveForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    phone: new FormControl('', [
      Validators.required,
      this.egyptianPhoneValidator,
    ]),
  });

  // Cleaner Approach
  // Form control getters
  get email() {
    return this.reactiveForm.get('email');
  }
  get password() {
    return this.reactiveForm.get('password');
  }
  get phone() {
    return this.reactiveForm.get('phone');
  }

  // Validation state getters
  get emailIsInvalid() {
    return this.email?.invalid && this.email?.touched;
  }
  get passwordIsInvalid() {
    return this.password?.invalid && this.password?.touched;
  }
  get phoneIsInvalid() {
    return this.phone?.invalid && this.phone?.touched;
  }

  // Combined form state
  get showFormError() {
    return (
      this.email?.touched &&
      this.email?.dirty &&
      this.email?.invalid &&
      this.password?.touched &&
      this.password?.dirty &&
      this.phone?.touched &&
      this.phone?.dirty &&
      this.reactiveForm.invalid
    );
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
      // Handle form submission
    }
  }

  private egyptianPhoneValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const regex = /^01[0125][0-9]{8}$/;
    const value = control.value || '';
    return regex.test(value) ? null : { egyptianPhone: true };
  }
}
