import { User } from '../../core/user.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  isLoading = false;
  error: Error;
  validForm: Boolean = false;
  sent: Boolean = false;
  resend: Boolean = false;

  constructor(
    public authService: AuthService,
    private router: ActivatedRoute
  ) {}

  /**
   * Submits the email to authservice to resent the verification email
   * @param {NgForm} form
   */
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.validForm = false;
      return;
    }
    console.log('Submitting,', form.value.email);
    this.authService.resendVerification(form.value.email).subscribe(
      (result) => {
        this.isLoading = false;
        console.log('Result: ', result);
        this.sent = true;
        this.error = null;
        form.reset();
      },
      (error) => {
        this.isLoading = false;
        this.error = error;
        console.log('error found,', error);
      }
    );
  }

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.router.snapshot.paramMap.get('rdnString'));
    console.log(this.router.snapshot.paramMap.get('rdnString') == 'resend');

    if (this.router.snapshot.paramMap.get('rdnString') !== 'resend') {
      this.resend = false;

      this.authService
        .verify(this.router.snapshot.paramMap.get('rdnString'))
        .subscribe(
          (result) => {
            this.isLoading = false;
            console.log('result: ', result);
          },
          (error) => {
            this.isLoading = false;
            this.error = error;
            console.log('error found,', error);
          }
        );
    } else {
      this.isLoading = false;
      this.resend = true;
      this.error = null;
    }
  }
}
