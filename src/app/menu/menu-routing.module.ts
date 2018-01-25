import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent }    from './menu.component';
import { AuthGuard } from '../auth-guard.service';

const menuRoutes: Routes = [
    { 
      path: 'menu',
      component: MenuComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(menuRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MenuRoutingModule { }