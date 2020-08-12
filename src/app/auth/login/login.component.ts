import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isLoading = false;
  error: string;

  constructor(public authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.error = '';
    this.isLoading = true;
    this.authService
      .login(form.value.email, form.value.password)
      .subscribe(() => {
        this.router.navigate(['']),
          (expetion) => {
            this.error = expetion;
          };
      });
  }
}
