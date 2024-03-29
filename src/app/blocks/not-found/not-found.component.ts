import { ActivatedRoute } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  path: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data: { path: string }) => {
      this.path = data.path;
    });
  }
}
