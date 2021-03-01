import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss'],
})
export class RequestResetComponent implements OnInit {
  constructor(private authService: AuthService) {}

  error: String = '';
  isLoading: Boolean = false;
  sent: Boolean = false;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.error = '';
    this.isLoading = true;
    this.authService.requestReset(form.value.email).subscribe(
      (result) => {
        this.isLoading = false;
        this.sent = true;
        form.reset();
      },
      (error) => {
        this.sent = true;
        this.error = JSON.stringify(error.error);
        this.isLoading = false;
        console.log(this.error);
      }
    );
  }

  ngOnInit(): void {}
}
