import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';
import { CartComponent } from './components/cart/cart.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', loadChildren: () => MainModule },

  {
    path: 'cart',
    component: CartComponent,
  },
  { path: 'auth', loadChildren: () => AuthModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
