import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';

import { environment } from '../../environments/environment';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuService } from './menu.service';
import { MenuMockService } from './menu-mock.service';
import { MenuServerService } from './menu-server.service';

let menuServiceImpl = environment.production ? MenuServerService : MenuMockService;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuRoutingModule
  ],
  declarations: [MenuComponent, MenuItemComponent],
  providers: [{ provide: MenuService, useClass: menuServiceImpl }]
})
export class MenuModule { }
