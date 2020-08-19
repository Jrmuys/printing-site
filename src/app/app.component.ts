import { AuthService } from 'src/app/services/auth.service';
import { User } from './models/user.model';
import { MainService } from './services/main.service';
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
