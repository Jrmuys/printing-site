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

  constructor(public authService: AuthService) {}

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

    user.fullname = form.value.fullname;
    user.password = form.value.password;
    user.email = form.value.email;
    this.authService.createUser(user);
  }

  ngOnInit(): void {}
}
