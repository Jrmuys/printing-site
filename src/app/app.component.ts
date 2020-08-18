import { MainService } from './services/main.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidenavToggle;
  constructor(private mainService: MainService) {
    mainService.toggleState$.subscribe((toggle) => {
      this.sidenavToggle = true;
    });
  }

  updateToggle() {
    // this.mainService.toggleSidnav();
  }

  title = 'printing-site';
}
