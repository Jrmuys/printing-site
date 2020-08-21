import { CartModule } from './cart/cart.module';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', loadChildren: () => MainModule },

  {
    path: 'cart',
    loadChildren: () => CartModule,
  },
  { path: 'auth', loadChildren: () => AuthModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
