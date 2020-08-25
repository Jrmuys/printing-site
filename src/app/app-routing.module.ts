import { UserModule } from './user/user.module';
import { BlocksModule } from './blocks/blocks.module';
import { ForbiddenComponent } from './blocks/forbidden/forbidden.component';
import { NotFoundComponent } from './blocks/not-found/not-found.component';
import { PathResolveService } from './core/path-resolve.service';

import { AuthGuardService } from './core/auth/auth.guard';
import { AdminComponent } from './admin/admin/admin.component';
import { RoleGuardService } from './core/auth/role.guard';
import { AdminModule } from './admin/admin.module';
import { CartModule } from './cart/cart.module';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';

import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: '', loadChildren: () => MainModule },
  { path: 'order', redirectTo: '', pathMatch: 'full' },
  {
    path: 'cart',
    loadChildren: () => CartModule,
    canActivate: [AuthGuardService],
  },
  { path: 'auth', loadChildren: () => AuthModule },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'auth/signup', pathMatch: 'full' },

  {
    path: 'admin',
    loadChildren: () => AdminModule,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'forbidden',
    loadChildren: () => BlocksModule,
  },
  {
    path: 'user',
    loadChildren: () => UserModule,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService,
    },
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
