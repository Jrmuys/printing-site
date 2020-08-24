import { CartModule } from './cart/cart.module';
import { AuthHeaderInterceptorService } from './core/interceptors/auth-header-interceptor.service';
import { MainModule } from './main/main.module';
import { AppComponent } from './blocks/root/app.component';
import { BlocksModule } from './blocks/blocks.module';
import { SharedModule } from './shared/shared.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@angular/flex-layout';
import { RoleGuardService } from './core/auth/role.guard';
import { AuthGuardService } from './core/auth/auth.guard';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    // CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StlModelViewerModule,
    HttpClientModule,
    SharedModule,
    BlocksModule,
    CoreModule,
    MainModule,
    CartModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptorService,
      multi: true,
    },
    {
      provide: RoleGuardService,
    },
    {
      provide: AuthGuardService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
