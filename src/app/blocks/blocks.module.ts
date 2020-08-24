import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './../shared/shared.module';
import { AppComponent } from './root/app.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    FooterComponent,
    NotFoundComponent,
  ],
  imports: [CommonModule, BlocksRoutingModule, SharedModule],
  exports: [HeaderComponent, AppComponent, FooterComponent, NotFoundComponent],
})
export class BlocksModule {}
