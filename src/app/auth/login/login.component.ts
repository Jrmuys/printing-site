import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';

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
    this.authService.login(form.value.email, form.value.password).subscribe(
      (result) => {
        this.router.navigate(['']);
      },
      (error) => {
        console.log(error);
        this.error = 'User not found';
        this.isLoading = false;
        console.log(this.error);
      }
    );
  }
}
