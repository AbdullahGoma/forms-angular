import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

let initialEmail = '';
let initialPhone = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmail = loadedForm.email;
  initialPhone = loadedForm.phone;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  reactiveForm = new FormGroup({
    email: new FormControl(initialEmail, {
      validators: [Validators.required, this.emailFormatValidator],
      // asyncValidators: [this.checkEmailExists()],
      // updateOn: 'blur', // To ensure the correctness of what the user leaves the input
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator,
      ],
    }),
    phone: new FormControl(initialPhone, [
      Validators.required,
      this.egyptianPhoneValidator,
    ]),
  });
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // const savedForm = window.localStorage.getItem('saved-login-form');

    // if (savedForm) {
    //   const loadedForm = JSON.parse(savedForm);
    //   this.reactiveForm.patchValue({
    //     email: loadedForm.email,
    //     phone: loadedForm.phone
    //   })
    // }

    // for reseting the form with values that user entered before reload page
    const subscription = this.reactiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) =>
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email, phone: value.phone })
          ),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // constructor(private http: HttpClient) {}

  // checkEmailExists(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     return of(control.value).pipe(
  //       debounceTime(500),
  //       switchMap((value) =>
  //         this.http.get<boolean>(`api/checkEmail?email=${value}`).pipe(
  //           map((exists) => (exists ? { emailExists: true } : null)),
  //           catchError(() => of(null))
  //         )
  //       )
  //     );
  //   };
  // }

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
    return this.email?.invalid && this.email?.touched && this.email?.dirty;
  }
  get passwordIsInvalid() {
    return (
      this.password?.invalid && this.password?.touched && this.password?.dirty
    );
  }
  get phoneIsInvalid() {
    return this.phone?.invalid && this.phone?.touched && this.phone?.dirty;
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

  // Custom password validator
  private passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';

    // Check for at least one uppercase letter
    const hasUpperCase = /[A-Z]/.test(value);
    // Check for at least one lowercase letter
    const hasLowerCase = /[a-z]/.test(value);
    // Check for at least one number
    const hasNumber = /[0-9]/.test(value);
    // Check for at least one special character (question mark, exclamation, etc.)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: ValidationErrors = {};

    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  // Custom email validator
  private emailFormatValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { invalidEmail: true };
  }

  private egyptianPhoneValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const regex = /^01[0125][0-9]{8}$/;
    const value = control.value || '';
    return regex.test(value) ? null : { egyptianPhone: true };
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
      // Handle form submission
    }
  }
}
