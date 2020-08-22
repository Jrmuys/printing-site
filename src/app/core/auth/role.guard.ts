// src/app/auth/role-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);

    console.log('Analyzing role:', tokenPayload);
    if (
      !this.auth.ifAuthenticated() ||
      tokenPayload.roles[0] !== expectedRole
    ) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
