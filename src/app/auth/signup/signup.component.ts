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
  FormArray,
} from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

// Load initial values from localStorage
let initialFormData: any = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  street: '',
  number: '',
  postalCode: '',
  city: '',
  role: '',
  source: [false, false, false],
  // google: false,
  // friend: false,
  // otherSource: false,
  terms: false,
};

const savedForm = window.localStorage.getItem('saved-signup-form');
if (savedForm) {
  initialFormData = { ...initialFormData, ...JSON.parse(savedForm) };
}

enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Employee = 'employee',
  Founder = 'founder',
  Other = 'other',
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  UserRole = UserRole;
  reactiveForm = new FormGroup({
    email: new FormControl(initialFormData.email, {
      validators: [Validators.required, this.emailFormatValidator],
      // asyncValidators: [this.checkEmailExists()],
      // updateOn: 'blur',
    }),
    passwords: new FormGroup(
      {
        password: new FormControl(initialFormData.password, {
          validators: [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        }),
        confirmPassword: new FormControl(initialFormData.confirmPassword, {
          validators: [Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator }
    ),
    name: new FormGroup({
      firstName: new FormControl(initialFormData.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(initialFormData.lastName, {
        validators: [Validators.required],
      }),
    }),
    address: new FormGroup({
      street: new FormControl(initialFormData.street, {
        validators: [Validators.required],
      }),
      number: new FormControl(initialFormData.number, {
        validators: [Validators.required],
      }),
      postalCode: new FormControl(initialFormData.postalCode, {
        validators: [Validators.required],
      }),
      city: new FormControl(initialFormData.city, {
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<UserRole>(initialFormData.role, {
      validators: [Validators.required],
    }),
    source: new FormArray([
      new FormControl(initialFormData.source?.[0] || false), // Google
      new FormControl(initialFormData.source?.[1] || false), // Friend
      new FormControl(initialFormData.source?.[2] || false), // Other
    ]),
    // google: new FormControl(initialFormData.google),
    // friend: new FormControl(initialFormData.friend),
    // otherSource: new FormControl(initialFormData.otherSource),
    terms: new FormControl(initialFormData.terms, {
      validators: [Validators.requiredTrue],
    }),
  });

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.reactiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          // Don't save password and confirmPassword for security reasons
          const { passwords, ...valuesToSave } = value;
          window.localStorage.setItem(
            'saved-signup-form',
            JSON.stringify(valuesToSave)
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // Form control getters
  get email() {
    return this.reactiveForm.get('email');
  }
  get passwords() {
    return this.reactiveForm.get('passwords');
  }
  get password() {
    return this.reactiveForm.get('passwords.password');
  }
  get confirmPassword() {
    return this.reactiveForm.get('passwords.confirmPassword');
  }
  get name() {
    return this.reactiveForm.get('name');
  }
  get firstName() {
    return this.reactiveForm.get('name.firstName');
  }
  get lastName() {
    return this.reactiveForm.get('name.lastName');
  }
  get address() {
    return this.reactiveForm.get('address');
  }
  get street() {
    return this.reactiveForm.get('address.street');
  }
  get number() {
    return this.reactiveForm.get('address.number');
  }
  get postalCode() {
    return this.reactiveForm.get('address.postalCode');
  }
  get city() {
    return this.reactiveForm.get('address.city');
  }
  get role() {
    return this.reactiveForm.get('role');
  }
  get terms() {
    return this.reactiveForm.get('terms');
  }
  get sourceArray(): FormArray {
    return this.reactiveForm.get('source') as FormArray;
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
  get confirmPasswordIsInvalid() {
    return (
      this.confirmPassword?.invalid &&
      this.confirmPassword?.touched &&
      this.confirmPassword?.dirty
    );
  }
  get firstNameIsInvalid() {
    return (
      this.firstName?.invalid &&
      this.firstName?.touched &&
      this.firstName?.dirty
    );
  }
  get lastNameIsInvalid() {
    return (
      this.lastName?.invalid && this.lastName?.touched && this.lastName?.dirty
    );
  }
  get streetIsInvalid() {
    return this.street?.invalid && this.street?.touched && this.street?.dirty;
  }
  get numberIsInvalid() {
    return this.number?.invalid && this.number?.touched && this.number?.dirty;
  }
  get postalCodeIsInvalid() {
    return (
      this.postalCode?.invalid &&
      this.postalCode?.touched &&
      this.postalCode?.dirty
    );
  }
  get cityIsInvalid() {
    return this.city?.invalid && this.city?.touched && this.city?.dirty;
  }
  get roleIsInvalid() {
    return this.role?.invalid && this.role?.touched && this.role?.dirty;
  }
  get termsIsInvalid() {
    return this.terms?.invalid && this.terms?.touched;
  }

  // Combined form state
  get showFormError() {
    return (
      this.email?.touched &&
      this.password?.touched &&
      this.confirmPassword?.touched &&
      this.firstName?.touched &&
      this.lastName?.touched &&
      this.street?.touched &&
      this.number?.touched &&
      this.postalCode?.touched &&
      this.city?.touched &&
      this.role?.touched &&
      this.terms?.touched &&
      this.reactiveForm.invalid
    );
  }

  // Using Enum to Roles
  getRoleOptions(): { value: string; display: string }[] {
    return Object.keys(UserRole).map((key) => ({
      value: UserRole[key as keyof typeof UserRole],
      display: this.formatRoleDisplay(UserRole[key as keyof typeof UserRole]),
    }));
  }

  private formatRoleDisplay(roleValue: string): string {
    // Convert enum value to display text
    switch (roleValue) {
      case UserRole.Student:
        return 'Student';
      case UserRole.Teacher:
        return 'Teacher';
      case UserRole.Employee:
        return 'Employee';
      case UserRole.Founder:
        return 'Founder';
      case UserRole.Other:
        return 'Other';
      default:
        return roleValue;
    }
  }

  // Custom validators
  private passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: ValidationErrors = {};

    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumber) errors['missingNumber'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  private emailFormatValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { invalidEmail: true };
  }

  private passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
      // Handle form submission
      localStorage.removeItem('saved-signup-form');
      this.reactiveForm.reset();
    }
  }

  onReset() {
    this.reactiveForm.reset({
      passwords: {
        password: '',
        confirmPassword: '',
      },
      name: {
        firstName: '',
        lastName: '',
      },
      address: {
        street: '',
        number: '',
        postalCode: '',
        city: '',
      },
      source: [false, false, false],
      terms: true,
    });
  }
}
