import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { SharedModule } from './../shared/shared.module';
import { ViewerEngineComponent } from './viewer-engine/viewer-engine.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent, ViewerEngineComponent, SignInDialogComponent],
  imports: [CommonModule, MainRoutingModule, SharedModule],
  providers: [
    {
      provide: ViewerEngineComponent,
    },
  ],
})
export class MainModule {}