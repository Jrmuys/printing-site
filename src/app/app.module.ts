import { AuthHeaderInterceptorService } from './interceptors/auth-header-interceptor.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ViewerEngineComponent } from './components/viewer-engine/viewer-engine.component';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { CartComponent } from './components/cart/cart.component';

import {
  HttpClient,
  HttpHandler,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    ViewerEngineComponent,
    LoginComponent,
    SignupComponent,
    CartComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    StlModelViewerModule,
    MatRadioModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatProgressBarModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptorService,
      multi: true,
    },
    {
      provide: ViewerEngineComponent,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
