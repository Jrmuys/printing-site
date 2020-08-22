import { AdminComponent } from './admin/admin/admin.component';
import { RoleGuard } from './core/auth/role.guard';
import { AdminModule } from './admin/admin.module';
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
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
