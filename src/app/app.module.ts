import { AuthHeaderInterceptorService } from './core/interceptors/auth-header-interceptor.service';
import { MainModule } from './main/main.module';
import { AppComponent } from './blocks/root/app.component';
import { BlocksModule } from './blocks/blocks.module';
import { SharedModule } from './shared/shared.module';
import { CartComponent } from './components/cart/cart.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@angular/flex-layout';

@NgModule({
  declarations: [CartComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StlModelViewerModule,
    HttpClientModule,
    SharedModule,
    BlocksModule,
    CoreModule,
    MainModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
