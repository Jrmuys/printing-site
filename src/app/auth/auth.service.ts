import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userListener$ = new Subject<User>();
  private apiUrl = '/api/auth/';

  constructor(private router: Router, private httpClient: HttpClient) {}
  // private http: HttpClient,
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserListener() {
    return this.userListener$.asObservable();
  }

  private setUser(user: User) {
    this.userListener$.next(user);
  }

  createUser(user: User) {
    // const password = user.password;
    // const email = user.email;
    // const fullname = user.fullname;
    // const authData: AuthData = { email: email, password: password };
    // // this.http
    // //   .post('http://localhost:3000/api/user/signup', authData)
    // //   .subscribe((response) => {
    // //     console.log(response);
    // //   });
    // this.setUser(user);

    return this.httpClient.post<User>(`${this.apiUrl}register`, user).pipe(
      switchMap((savedUser) => {
        this.setUser(savedUser as User);
        console.log(`user registered successfully`, savedUser);
        return of(savedUser);
      }),
      catchError((err) => {
        console.log(`server error occoured`, err);
        return throwError(`Registration failed, please contact admin`);
      })
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.router.navigate(['/']);
    // this.http
    //   .post<{ token: string; expiresIn: number }>(
    //     'http://localhost:3000/api/user/login',
    //     authData
    //   )
    //   .subscribe((response) => {
    //     const token = response.token;
    //     this.token = token;
    //     if (token) {
    //       const expiresInDuration = response.expiresIn;
    //       this.setAuthTimer(expiresInDuration);
    //       this.isAuthenticated = true;
    //       this.userListener.next(true);
    //       const now = new Date();
    //       const expirationDate = new Date(
    //         now.getTime() + expiresInDuration * 1000
    //       );
    //       console.log(expirationDate);
    //       this.saveAuthData(token, expirationDate);
    //       this.router.navigate(['/']);
    //     }
    //   });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.setUser(null);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.setUser(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
