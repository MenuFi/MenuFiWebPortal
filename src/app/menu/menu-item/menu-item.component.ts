import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
  dietaryPreferences: Array<DietaryPreference> = [];
  dietaryRestrictions: Array<DietaryPreference> = [];

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
  }

  ngOnInit() {
    $(document).foundation();
    this.resetEditForm();
    this.menuService.getAllPreferences().subscribe((value: Array<DietaryPreference>) => {
      this.preferenceOptions = value;
      this.splitPreferences();
      this.resetEditForm();
    });
  }

  private splitPreferences() {
    this.allPreferences = this.preferenceOptions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return !value.isRestriction();
    });

    this.allRestrictions = this.preferenceOptions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return value.isRestriction();
    });

    this.newPreferencesMask = Array<boolean>(this.allPreferences.length).fill(false);
    this.newRestrictionsMask = Array<boolean>(this.allRestrictions.length).fill(false);
  }

  private resetEditForm() {
    this.newName = this.menuItemModel.name;
    this.newDescription = this.menuItemModel.description;
    this.newCalories = this.menuItemModel.calories;
    this.newPrice = this.menuItemModel.price;
    this.newImageUrl = this.menuItemModel.pictureUri;
    this.newIngredients = this.menuItemModel.ingredients.slice(0);
    this.newPreferencesMask = this.allPreferences.map((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.dietaryPreferences.some((menuItemPreference: DietaryPreference, menuItemIndex: number, menuItemArray: Array<DietaryPreference>) => {
        return value.valueOf() == menuItemPreference.valueOf();
      });
    });
    this.newPreferencesMask = this.allRestrictions.map((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.dietaryRestrictions.some((menuItemRestriction: DietaryPreference, menuItemIndex: number, menuItemArray: Array<DietaryPreference>) => {
        return value.valueOf() == menuItemRestriction.valueOf();
      });
    });
  }

  private removeIngredient(ingredientIndex: number) {
    this.newIngredients = this.newIngredients.filter((value: string, index: number, array: Array<string>) => {
      return index != ingredientIndex;
    });
  }

  private submitEditMenuItem() {
    let newPreferences: Array<DietaryPreference> = this.allPreferences.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newPreferencesMask[index];
    });

    let newRestrictions: Array<DietaryPreference> = this.allRestrictions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newRestrictionsMask[index];
    });

    let newMenuItemPreferences = [].concat(newPreferences).concat(newRestrictions);
    let menuItem: MenuItem = new MenuItem(
      this.menuItemModel.menuItemId,
      this.newName,
      this.newPrice,
      this.newIngredients,
      newMenuItemPreferences,
      this.newCalories,
      this.newDescription,
      this.menuItemModel.rating,
      this.newImageUrl
    );
    this.menuService.editMenuItem(0, menuItem);
  }

  trackByIndex(index: number, value: any) {
    return index;
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
