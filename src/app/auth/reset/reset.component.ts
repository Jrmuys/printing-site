import { NullTemplateVisitor } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PasswordValidator } from './password-validator.directive';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  isLoading = false;
  error: Error;
  check: Boolean = false;
  reset: Boolean = false;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: ActivatedRoute
  ) {
    this.passwordForm = fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ],
        ],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value ===
      frm.controls['confirmPassword'].value
      ? null
      : { mismatch: true };
  }

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.router.snapshot.paramMap.get('token'));
    this.authService
      .checkToken(this.router.snapshot.paramMap.get('token'))
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.check = true;
          console.log('result: ', result);
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
          this.check = true;

          console.log('error found,', error);
        }
      );
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.passwordForm.get('password'));
    this.authService
      .resetPassword(
        this.router.snapshot.paramMap.get('token'),
        this.passwordForm.controls['password'].value
      )
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.reset = true;
          this.passwordForm.reset();
        },
        (error) => {
          this.reset = true;
          this.error = error.error;
          this.isLoading = false;
          console.log(this.error);
        }
      );
  }

  debug(event) {
    console.log('Password: ', this.passwordForm.get('password'));
    console.log('Confirm Password: ', this.passwordForm.get('confirmPassword'));
    console.log('FormGroup: ', this.passwordForm);
    console.log(
      'reset: ' +
        this.reset +
        '\nerror: ' +
        this.error +
        '\nisLoading: ' +
        this.isLoading +
        '\ncheck: ' +
        this.check
    );
  }

  hide = true;
}
