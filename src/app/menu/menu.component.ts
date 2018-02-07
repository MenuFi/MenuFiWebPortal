import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuItem } from './menu-item/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  menuItemsData: Observable<Array<MenuItem>>;

  constructor() { }

  ngOnInit() {
    this.menuItemsData = Observable.of([
      new MenuItem(0, "Menu Item A", 5.99, [], 100, "Description A", 3.5)
    ]);
  }

}
