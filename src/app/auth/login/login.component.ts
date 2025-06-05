import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('form') formDataByViewChild!: NgForm; // Second way to access NgForm Object
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Save the value entered by user even after page reloaded
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('save-login-form');

      if (savedForm) {
        const loadedForm = JSON.parse(savedForm);
        const savedEmail = loadedForm.email;

        setTimeout(() => {
          this.form().setValue({
            email: savedEmail,
            password: '',
          }); // this.form().controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'save-login-form',
              JSON.stringify({
                email: value.email,
              })
            ),
        });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(
    formData: NgForm // first way to access NgForm Object (event)
  ) {
    Object.keys(formData.controls).forEach((field) => {
      const control = formData.controls[field];
      console.log(control);

      control.markAsTouched();
    });

    if (formData.invalid) return;

    const enteredEmail = formData.form.value.enail;
    const enteredPassword = formData.form.value.password;

    const enteredEmailByViewChild = this.formDataByViewChild.value.enail;
    const enteredPasswordByViewChild = this.formDataByViewChild.value.password;

    console.log(enteredEmail === enteredEmailByViewChild); // true
    console.log(enteredPassword === enteredPasswordByViewChild); // true
    console.log(formData.form);

    formData.form.reset();
  }
}
