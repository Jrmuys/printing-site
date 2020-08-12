import { Router } from '@angular/router';
import { User } from './../user.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  validForm = false;

  constructor(public authService: AuthService, private router: Router) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.validForm = false;
      return;
    }
    this.isLoading = true;
    var user: User = {
      fullname: form.value.fullname,
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.createUser(user).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {}
}
