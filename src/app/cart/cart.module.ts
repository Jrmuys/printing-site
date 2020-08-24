import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';

@NgModule({
  declarations: [CartComponent, ConfirmationPageComponent],
  imports: [CommonModule, CartRoutingModule, SharedModule],
})
export class CartModule {}
