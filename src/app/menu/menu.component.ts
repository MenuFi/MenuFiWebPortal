import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuService } from './menu.service';
import { MenuItem } from './menu-item/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  menuItemsData: Observable<Array<MenuItem>>;
  restaurantId: number = 0;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuItemsData = this.menuService.getMenuItems(this.restaurantId);
  }

}
