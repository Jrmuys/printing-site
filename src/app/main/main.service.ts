import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

let unitSubject = new Subject<string>();

@Injectable({
  providedIn: 'root',
})
export class MainService {
  public unitChange(unit: string) {
    unitSubject.next(unit);
  }

  public getUnitSubject() {
    return unitSubject.asObservable();
  }

  constructor() {}
}
