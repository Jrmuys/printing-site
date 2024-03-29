import { CartService } from './../cart/cart.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';

import { User } from '../user.model';
import { AuthData } from './auth-data.model';

interface UserDto {
  user: User;
  token: string;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userListener$ = new BehaviorSubject<User>(null);
  private apiUrl = '/api/auth/';
  private;
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private cartService: CartService
  ) {}

  updateUser() {
    this.userListener$.next(this.getUser());
  }
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

  getUser() {
    console.log('getting user: ', this.userListener$.getValue());
    return this.userListener$.getValue();
  }

  resendVerification(email: String) {
    return this.httpClient.put(`${this.apiUrl}resendActivation`, {
      email: email,
    });
  }

  requestReset(email: String) {
    return this.httpClient.put(`${this.apiUrl}reset-request`, { email: email });
  }

  checkToken(token: String) {
    return this.httpClient.put(`${this.apiUrl}reset-token`, { token: token });
  }

  resetPassword(token, password) {
    return this.httpClient.put(`${this.apiUrl}reset-password`, {
      token: token,
      password: password,
    });
  }

  private setUser(user: User) {
    this.userListener$.next(user);
  }

  public ifAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  createUser(userToSave: User) {
    return this.httpClient
      .post<UserDto>(`${this.apiUrl}register`, userToSave)
      .pipe(
        switchMap(({ user, token }) => {
          this.setUser(user as User);
          localStorage.setItem('token', token);
          console.log(`user registered successfully`, user);
          return of(user);
        }),
        catchError((err) => {
          console.log(`server error occurred`, err);
          return throwError(
            err.error.message || `Registration failed, please contact admin`
          );
        })
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    return this.httpClient.post<UserDto>(`${this.apiUrl}login`, authData).pipe(
      switchMap(({ user, token, expiresIn }) => {
        this.setUser(user);
        console.log('expires in from json: ', expiresIn);
        const expiresInDuration = +expiresIn;
        console.log('Expires duration: ', expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expiresInDuration * 1000
        );
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate);
        console.log(`user found`);
        this.router.navigate(['/']);
        this.cartService.getCart();

        return of(user);
      }),
      catchError((err) => {
        console.log(' User not found! ');
        return throwError(`User not found! Please try again`);
      })
    );
  }

  findMe() {
    const token = localStorage.getItem('token');
    if (!token) {
      return EMPTY;
    }
    return this.httpClient.get<any>(`${this.apiUrl}findme`).pipe(
      switchMap(({ user }) => {
        this.setUser(user);
        console.log(`User found`, user);
        this.autoAuthUser();
        this.userListener$.next(user);
        this.cartService.getCart();

        return of(user);
      }),
      catchError((err) => {
        console.log(`Your login details could not be verified.`, err);
        return throwError(`Your login details could not be verified.`);
      })
    );
  }

  verify(rndString: string) {
    return this.httpClient.get(`${this.apiUrl}activate/${rndString}`);
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
