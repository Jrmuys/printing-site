import { SharedModule } from './../shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResetComponent } from './reset/reset.component';
import { VerifyPromptComponent } from './verify-prompt/verify-prompt.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, VerifyComponent, RequestResetComponent, ResetComponent, VerifyPromptComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
