import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter } from '@angular/core';
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
export class MenuComponent implements OnInit, OnDestroy {

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

  private currentMenuItem: MenuItem = null;

  constructor(private menuService: MenuService) {
    this.preferenceOptions = [];
    this.splitPreferences();
    this.resetAddForm();
  }

  ngOnInit() {
    this.refresh();
    $('#addModal').foundation();
    $('#editModal').foundation();
  }

  ngOnDestroy() {
    $('#addModal').parent().remove();
    $('#editModal').parent().remove();
  }

  private refresh() {
    this.menuService.getMenuItems(this.restaurantId).subscribe((next: Array<MenuItem>) => {
          this.menuItemsData = Observable.of(
            next.sort((a: MenuItem, b: MenuItem) => {
              return a.name.localeCompare(b.name);
            })
          );
        });
    this.menuService.getAllPreferences().subscribe((value: Array<DietaryPreference>) => {
      this.preferenceOptions = value;
      this.splitPreferences();
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

  private removeIngredient(ingredientIndex: number) {
    this.newIngredients = this.newIngredients.filter((value: string, index: number, array: Array<string>) => {
      return index != ingredientIndex;
    });
  }

  private submitCreateMenuItem() {
    this.menuService.createMenuItem(this.restaurantId, this.captureFormInfo(null))
      .subscribe((succeeded: boolean) => {
        if (succeeded) {
          this.refresh();
        }
      });
  }

  private submitEditMenuItem() {
    this.menuService.editMenuItem(this.restaurantId, this.captureFormInfo(this.currentMenuItem))
      .subscribe((succeeded: boolean) => {
        if (succeeded) {
          this.refresh();
        }
      });
  }

  private resetEditForm(existingMenuItem: MenuItem) {
    this.newName = existingMenuItem.name;
    this.newDescription = existingMenuItem.description;
    this.newCalories = existingMenuItem.calories;
    this.newPrice = existingMenuItem.price;
    this.newImageUrl = existingMenuItem.pictureUri;
    this.newIngredients = existingMenuItem.ingredients.slice(0);
    this.newPreferencesMask = this.allPreferences.map((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return existingMenuItem.dietaryPreferences.some((menuItemPreference: DietaryPreference, menuItemIndex: number, menuItemArray: Array<DietaryPreference>) => {
        return (value.valueOf() == menuItemPreference.valueOf()) && !value.isRestriction();
      });
    });
    this.newRestrictionsMask = this.allRestrictions.map((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return existingMenuItem.dietaryPreferences.some((menuItemRestriction: DietaryPreference, menuItemIndex: number, menuItemArray: Array<DietaryPreference>) => {
        return (value.valueOf() == menuItemRestriction.valueOf()) && value.isRestriction();
      });
    });
  }

  private openEditForm(existingMenuItem) {
    this.currentMenuItem = existingMenuItem;
    this.resetEditForm(existingMenuItem);
    $('#editModal').foundation('open');
  }

  private closeEditForm() {
    $('#editModal').foundation('close');
  }

  private captureFormInfo(existingMenuItem: MenuItem): MenuItem {
    let newPreferences: Array<DietaryPreference> = this.allPreferences.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newPreferencesMask[index];
    });

    let newRestrictions: Array<DietaryPreference> = this.allRestrictions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newRestrictionsMask[index];
    });

    let newMenuItemPreferences = [].concat(newPreferences).concat(newRestrictions);
    return new MenuItem(
      existingMenuItem ? existingMenuItem.menuItemId : -1,
      this.newName,
      this.newPrice,
      this.newIngredients,
      newMenuItemPreferences,
      this.newCalories,
      this.newDescription,
      existingMenuItem ? existingMenuItem.rating : 0,
      this.newImageUrl
    );
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

}
