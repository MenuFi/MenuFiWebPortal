import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MenuItem } from './menu-item.model';
import { DietaryPreference } from './dietary-preference.model';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuItemComponent implements OnInit, OnChanges {

  @Input() menuItemModel: MenuItem;
  dietaryPreferences: Array<DietaryPreference> = [];
  dietaryRestrictions: Array<DietaryPreference> = [];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const menuItemChange: SimpleChange = changes.menuItemModel;
    if (menuItemChange && menuItemChange.currentValue) {
      let allPreferences: Array<DietaryPreference> = menuItemChange.currentValue.dietaryPreferences;
      this.dietaryPreferences = allPreferences.filter((value, index, array) => {
        return !value.isRestriction();
      });
      this.dietaryRestrictions = allPreferences.filter((value, index, array) => {
        return value.isRestriction();
      });
    }
  }

}
