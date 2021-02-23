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

  constructor(
    public authService: AuthService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.router.snapshot.paramMap.get('rdnString'));
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
  }
}
