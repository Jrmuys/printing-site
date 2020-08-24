// src/app/auth/role-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    let tokenPayload;
    this.router.navigate(['']);
    if (token) tokenPayload = decode(token);
    else return false;
    if (
      !this.auth.ifAuthenticated() ||
      tokenPayload.roles[0] !== expectedRole
    ) {
      console.log(
        `Authticated? ${this.auth.ifAuthenticated()}, role? ${
          tokenPayload.roles
        }`
      );
      console.log('Not authorized');

      this.router.navigate(['']);
      return false;
    }
    console.log('Accepted');
    return true;
  }
}
