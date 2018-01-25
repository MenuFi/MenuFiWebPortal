import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent }    from './menu.component';

const menuRoutes: Routes = [
  { path: 'menu',  component: MenuComponent }
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