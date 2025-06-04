import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  onSignup(form: NgForm) {
    if (form.invalid) {
      // Mark all fields as touched to show errors
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
  }
}
