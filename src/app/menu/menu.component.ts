import { Component, OnInit, OnDestroy, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuService } from './menu.service';
import { MenuItem } from './menu-item/menu-item.model';
import { AddMenuItem } from './menu-item/add-menu-item.model';
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
  restaurantId: number = -1;

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
    this.menuService.getRestaurantId().subscribe((next: number) => {
      this.restaurantId = next;
      this.refresh();
      $('#addModal').foundation();
      $('#editModal').foundation();
    });
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
    this.menuService.createMenuItem(this.captureFormInfoAdd())
      .subscribe((succeeded: boolean) => {
        if (succeeded) {
          this.refresh();
        }
      });
  }

  private submitEditMenuItem() {
    this.menuService.editMenuItem(this.restaurantId, this.captureFormInfoEdit(this.currentMenuItem))
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
      return existingMenuItem.dietaryPreferences.some((id: number, menuItemIndex: number, menuItemArray: Array<number>) => {
        return (value.dietaryPreferenceId == id) && !value.isRestriction();
      });
    });
    this.newRestrictionsMask = this.allRestrictions.map((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return existingMenuItem.dietaryPreferences.some((id: number, menuItemIndex: number, menuItemArray: Array<number>) => {
        return (value.dietaryPreferenceId == id) && value.isRestriction();
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

  private captureFormInfoAdd(): AddMenuItem {
    let newMenuItemPreferences: Array<number> = this.captureFormInfoPreferences();
    return new AddMenuItem(
      this.restaurantId,
      this.newName,
      this.newPrice,
      this.newIngredients,
      newMenuItemPreferences,
      this.newCalories,
      this.newDescription,
      0,
      this.newImageUrl
    );
  }

  private captureFormInfoEdit(existingMenuItem: MenuItem): MenuItem {
    let newMenuItemPreferences: Array<number> = this.captureFormInfoPreferences();
    return new MenuItem(
      existingMenuItem.menuItemId,
      this.restaurantId,
      this.newName,
      this.newPrice,
      this.newIngredients.slice(0),
      newMenuItemPreferences.slice(0),
      this.newCalories,
      this.newDescription,
      existingMenuItem.rating,
      this.newImageUrl
    );
  }

  private captureFormInfoPreferences(): Array<number> {
    let newPreferences: Array<number> = this.allPreferences.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newPreferencesMask[index];
    }).map((value2: DietaryPreference) => {
      return value2.dietaryPreferenceId;
    });

    let newRestrictions: Array<number> = this.allRestrictions.filter((value: DietaryPreference, index: number, array: Array<DietaryPreference>) => {
      return this.newRestrictionsMask[index];
    }).map((value2: DietaryPreference) => {
      return value2.dietaryPreferenceId;
    });

    return [].concat(newPreferences).concat(newRestrictions);
  }

  trackByIndex(index: number, value: any) {
    return index;
  }

}
