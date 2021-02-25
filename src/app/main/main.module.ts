import { RoleGuardService } from './../core/auth/role.guard';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { SharedModule } from './../shared/shared.module';
import { ViewerEngineComponent } from './viewer-engine/viewer-engine.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { AuthGuardService } from './../core/auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { BlocksModule } from '../blocks/blocks.module';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    MainComponent,
    ViewerEngineComponent,
    SignInDialogComponent,
    AboutComponent,
    CarouselComponent,
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule, BlocksModule],
  providers: [
    {
      provide: ViewerEngineComponent,
      multi: true,
    },
  ],
})
export class MainModule {}
