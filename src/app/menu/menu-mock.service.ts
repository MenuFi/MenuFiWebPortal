import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { AddMenuItem } from './menu-item/add-menu-item.model';
import { MenuService } from './menu.service';
import { DietaryPreference } from './menu-item/dietary-preference.model';

@Injectable()
export class MenuMockService implements MenuService {
    private runningId: number = 4;
    private ingredients: Array<string> = ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"];
    private preferences: Array<DietaryPreference> = [
        new DietaryPreference(0, "Peanut", 1),
        new DietaryPreference(1, "Vegetarian", 0),
        new DietaryPreference(2, "Pescetarian", 0),
        new DietaryPreference(3, "Gluten", 1)
    ];
    private preferencesIds: Array<number> = [0, 1, 2, 3];
    private menuItems: Array<MenuItem> = [
        new MenuItem(0, 1, "Menu Item A", 5.99, this.ingredients.slice(0), this.preferencesIds.slice(0), 100, "Description A", 3.5, ""),
        new MenuItem(1, 1, "Menu Item B", 4.99, this.ingredients.slice(0), this.preferencesIds.slice(0), 150, "Description B", 3.3, ""),
        new MenuItem(2, 1, "Menu Item C", 7.99, this.ingredients.slice(0), this.preferencesIds.slice(0), 200, "Description C", 3.6, ""),
        new MenuItem(3, 1, "Menu Item D", 2.99, this.ingredients.slice(0), this.preferencesIds.slice(0), 350, "Description D", 3.1, "")
    ];

    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return Observable.of(this.menuItems.slice(0));
    }
    public getAllPreferences(): Observable<Array<DietaryPreference>> {
        return Observable.of(this.preferences.slice(0));
    }
    public createMenuItem(addMenuItem: AddMenuItem): Observable<boolean> {
        let menuItem: MenuItem = new MenuItem(
            this.runningId,
            addMenuItem.restaurantId,
            addMenuItem.name,
            addMenuItem.price,
            addMenuItem.ingredients,
            addMenuItem.dietaryPreferences,
            addMenuItem.calories,
            addMenuItem.description,
            addMenuItem.rating,
            addMenuItem.pictureUri
        );
        this.runningId += 1;
        this.menuItems.push(menuItem);
        return Observable.of(true);
    }
    public editMenuItem(restaurantId: number, menuItem: MenuItem): Observable<boolean> {
        let i = 0;
        let menuItemIndex = this.menuItems.findIndex((value: MenuItem, index: number, array: Array<MenuItem>) => {
            return value.menuItemId == menuItem.menuItemId;
        });
        if (menuItemIndex != -1) {
            this.menuItems[menuItemIndex] = menuItem;
            return Observable.of(true);
        }
        return Observable.of(false);
    }
}
