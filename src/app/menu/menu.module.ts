import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';

import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule
  ],
  declarations: [MenuComponent, MenuItemComponent]
})
export class MenuModule { }
