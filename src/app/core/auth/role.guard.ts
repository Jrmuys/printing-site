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

    console.log('ROLE GUARD:');

    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    let tokenPayload;
    console.log('Expected role: ', expectedRole);
    // this.router.navigate(['']);

    if (!token) return false;

    tokenPayload = decode(token);
    console.log('Token payload: ', tokenPayload);
    if (
      !this.auth.ifAuthenticated() ||
      tokenPayload.roles[0] !== expectedRole
    ) {
      console.log('Not authorized');

      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
