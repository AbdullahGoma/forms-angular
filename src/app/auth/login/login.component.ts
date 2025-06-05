import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
    }
  }

  // control = new FormControl('', [Validators.required, egyptianPhoneValidator]);
  // angular do egyptianPhoneValidator(control);
  // phoneForm = new FormGroup({ phone: control });
  egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^01[0125][0-9]{8}$/;
    const value = control.value || '';
    return regex.test(value) ? null : { egyptianPhone: true };
  }
}
