import { AuthService } from 'src/app/core/auth/auth.service';
import { User } from '../../core/user.model';
import { MainService } from '../../core/main/main.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  user: User;
  toggleSubscription: Subscription;

  sidenavToggle;
  constructor(
    private mainService: MainService,
    private authService: AuthService
  ) {
    this.toggleSubscription = this.mainService.toggleState$.subscribe(() => {
      this.sidenavToggle = true;
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  updateToggle() {
    // this.mainService.toggleSidnav();
  }

  title = 'printing-site';
}
