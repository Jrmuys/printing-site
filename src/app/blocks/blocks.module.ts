import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './../shared/shared.module';
import { AppComponent } from './root/app.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    FooterComponent,
    NotFoundComponent,
    ForbiddenComponent,
  ],
  imports: [CommonModule, BlocksRoutingModule, SharedModule],
  exports: [
    HeaderComponent,
    AppComponent,
    FooterComponent,
    NotFoundComponent,
    ForbiddenComponent,
  ],
})
export class BlocksModule {}
