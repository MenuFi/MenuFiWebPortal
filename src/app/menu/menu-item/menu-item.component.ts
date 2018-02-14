import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MenuItem } from './menu-item.model';
import { DietaryPreference } from './dietary-preference.model';
import { MenuService } from '../menu.service';
declare var $:any

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuItemComponent implements OnInit, OnChanges {

  @Input() menuItemModel: MenuItem;
  @Output() openEditEvent: EventEmitter<MenuItem> = new EventEmitter<MenuItem>();

  preferenceOptions: Array<DietaryPreference>;
  dietaryPreferences: Array<DietaryPreference> = [];
  dietaryRestrictions: Array<DietaryPreference> = [];
 
  constructor(private menuService: MenuService) {
    this.preferenceOptions = [];
  }

  ngOnInit() {
    this.menuService.getAllPreferences().subscribe((value: Array<DietaryPreference>) => {
      this.preferenceOptions = value;
      this.updatePreferences(this.menuItemModel);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const menuItemChange: SimpleChange = changes.menuItemModel;
    if (menuItemChange && menuItemChange.currentValue) {
      this.updatePreferences(menuItemChange.currentValue);
    }
  }

  updatePreferences(menuItem: MenuItem) {
    let allPreferences: Array<DietaryPreference> = this.preferenceOptions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return menuItem.dietaryPreferences.some((id: number, menuItemIndex: number, idArray: Array<number>) => {
        return id == value.dietaryPreferenceId;
      });
    });
    this.dietaryPreferences = allPreferences.filter((value, index, array) => {
      return !value.isRestriction();
    });
    this.dietaryRestrictions = allPreferences.filter((value, index, array) => {
      return value.isRestriction();
    });
  }

  openEditForm() {
    this.openEditEvent.emit(this.menuItemModel);
  }

}
