import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderInterceptorService implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log(`Bearer ${token}`);
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', token ? `Bearer ${token}` : ''),
    });
    return next.handle(clonedRequest);
  }
}
