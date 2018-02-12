import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuService } from './menu.service';
import { MenuItem } from './menu-item/menu-item.model';
import { DietaryPreference } from './menu-item/dietary-preference.model';
declare var $:any

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  menuItemsData: Observable<Array<MenuItem>>;
  restaurantId: number = 0;

  newName: string = '';
  newDescription: string = '';
  newCalories: number;
  newPrice: number;
  newImageUrl: string = '';
  newIngredients: Array<string> = [];
  newPreferencesMask: Array<boolean> = [];
  newRestrictionsMask: Array<boolean> = [];

  preferenceOptions: Array<DietaryPreference>;
  allPreferences: Array<DietaryPreference>;
  allRestrictions: Array<DietaryPreference>;

  constructor(private menuService: MenuService) {
    this.preferenceOptions = [];
    this.splitPreferences();
    this.resetAddForm();
  }

  ngOnInit() {
    $(document).foundation();
    this.menuItemsData = this.menuService.getMenuItems(this.restaurantId);
    this.menuService.getAllPreferences().subscribe((value: Array<DietaryPreference>) => {
      this.preferenceOptions = value;
      this.splitPreferences();
    });
  }

  private splitPreferences() {
    this.allPreferences = this.preferenceOptions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return value.type == 0;
    });

    this.allRestrictions = this.preferenceOptions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return value.type == 1;
    });

    this.newPreferencesMask = Array<boolean>(this.allPreferences.length).fill(false);
    this.newRestrictionsMask = Array<boolean>(this.allRestrictions.length).fill(false);
  }

  private resetAddForm() {
    this.newName = '';
    this.newDescription = '';
    this.newCalories = 0;
    this.newPrice = 0;
    this.newImageUrl = '';
    this.newIngredients = [];
    this.newPreferencesMask = Array<boolean>(this.allPreferences.length).fill(false);
    this.newRestrictionsMask = Array<boolean>(this.allRestrictions.length).fill(false);
  }

  private submitCreateMenuItem() {
    console.log(this.newName);
    console.log(this.newDescription);
    console.log(this.newPrice);
    console.log(this.newImageUrl);
    console.log(this.newIngredients);
    console.log(this.newRestrictionsMask);
    console.log(this.newPreferencesMask);

    let newPreferences: Array<DietaryPreference> = this.allPreferences.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newPreferencesMask[index];
    });

    let newRestrictions: Array<DietaryPreference> = this.allRestrictions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newRestrictionsMask[index];
    });

    let newMenuItemPreferences = [].concat(newPreferences).concat(newRestrictions);
    let newMenuItem: MenuItem = new MenuItem(-1, this.newName, this.newPrice, this.newIngredients, newMenuItemPreferences, this.newCalories, this.newDescription, 0, this.newImageUrl);
    this.menuService.createMenuItem(this.restaurantId, newMenuItem);
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

}
