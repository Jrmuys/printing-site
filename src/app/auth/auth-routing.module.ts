import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent,
    // pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'verify/:rdnString',
    component: VerifyComponent,
  },
  {
    path: 'reset/:token',
    component: ResetComponent,
  },
  {
    path: 'requestReset',
    component: RequestResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
