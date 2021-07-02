import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    pathMatch: 'full',
    component: MainComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent,
  },

  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
