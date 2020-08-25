import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';

@NgModule({
  declarations: [MyOrdersComponent, ConfirmationPageComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
