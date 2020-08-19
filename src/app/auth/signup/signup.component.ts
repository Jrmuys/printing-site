import { Router } from '@angular/router';
import { User } from '../../core/user.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';

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
    console.log(user);
    this.authService.createUser(user).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {}
}
