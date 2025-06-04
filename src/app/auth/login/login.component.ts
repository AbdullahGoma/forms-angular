import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('form') formDataByViewChild!: NgForm; // Second way to access NgForm Object

  onSubmit(
    formData: NgForm // first way to access NgForm Object (event)
  ) {
    if (formData.form.invalid) return; 

    const enteredEmail = formData.form.value.enail;
    const enteredPassword = formData.form.value.password;

    const enteredEmailByViewChild = this.formDataByViewChild.value.enail;
    const enteredPasswordByViewChild = this.formDataByViewChild.value.password;

    console.log(enteredEmail === enteredEmailByViewChild); // true
    console.log(enteredPassword === enteredPasswordByViewChild); // true
    console.log(formData.form);
    
  }
}
