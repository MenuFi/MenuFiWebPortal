import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from './menu-item.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuItemComponent implements OnInit {

  @Input() menuItemModel: MenuItem;

  constructor() { }

  ngOnInit() {

  }

}
