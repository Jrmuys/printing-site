import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private unitSubject = new Subject<string>();

  private toggleState = new Subject();
  public toggleState$ = this.toggleState.asObservable();
  private toggleVal = false;

  public unitChange(unit: string) {
    console.log('next unit...', unit);
    this.unitSubject.next(unit);
  }

  public getUnitSubject() {
    return this.unitSubject.asObservable();
  }

  public toggleSidnav() {
    this.toggleVal = !this.toggleVal;
    this.toggleState.next(this.toggleVal);
  }

  constructor() {}
}
