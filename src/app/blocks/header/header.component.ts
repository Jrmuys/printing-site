import { MainService } from '../../core/main/main.service';
import { User } from '../../core/user.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User;
  userSub: Subscription;
  authSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mainService: MainService
  ) {
    this.userSub = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
    this.authSub = this.authService
      .findMe()
      .subscribe((user) => (this.user = user));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {}

  toggleSidenav() {
    this.mainService.toggleSidnav();
    this.authSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
