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
  newPrice: number;
  newImageUrl: string = '';
  newIngredients: Array<string> = [];
  newPreferencesMask: Array<boolean> = [];
  newRestrictionsMask: Array<boolean> = [];

  allPreferences: Array<DietaryPreference>;
  allRestrictions: Array<DietaryPreference>;

  constructor(private menuService: MenuService) {
    this.allPreferences = [
      new DietaryPreference(0, "Vegetarian", 0),
      new DietaryPreference(1, "Pescetarian", 0)
    ];

    this.allRestrictions = [
      new DietaryPreference(2, "Peanut", 1),
      new DietaryPreference(3, "Gluten", 1)
    ]

    this.newPreferencesMask = Array<boolean>(this.allPreferences.length).fill(false);
    this.newRestrictionsMask = Array<boolean>(this.allRestrictions.length).fill(false);
  }

  ngOnInit() {
    this.menuItemsData = this.menuService.getMenuItems(this.restaurantId);
    $(document).foundation();
  }

  private submitCreateMenuItem() {
    console.log(this.newName);
    console.log(this.newDescription);
    console.log(this.newPrice);
    console.log(this.newImageUrl);
    console.log(this.newIngredients);
    console.log(this.newRestrictionsMask);
    console.log(this.newPreferencesMask);
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

}
