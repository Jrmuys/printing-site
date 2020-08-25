import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'confirmation/:id', component: ConfirmationPageComponent },
  { path: 'orders', component: MyOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
