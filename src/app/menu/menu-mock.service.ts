import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { MenuService } from './menu.service';
import { DietaryPreference } from './menu-item/dietary-preference.model';

@Injectable()
export class MenuMockService implements MenuService {
    private ingredients: Array<string> = ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"];
    private preferences: Array<DietaryPreference> = [
        new DietaryPreference(0, "Peanut", 1),
        new DietaryPreference(1, "Vegetarian", 0),
        new DietaryPreference(2, "Pescetarian", 0),
        new DietaryPreference(3, "Gluten", 1)
    ];
    private menuItems: Array<MenuItem> = [
        new MenuItem(0, "Menu Item A", 5.99, this.ingredients, this.preferences, 100, "Description A", 3.5, ""),
        new MenuItem(1, "Menu Item B", 4.99, this.ingredients, this.preferences, 150, "Description B", 3.3, ""),
        new MenuItem(0, "Menu Item C", 7.99, this.ingredients, this.preferences, 200, "Description C", 3.6, ""),
        new MenuItem(1, "Menu Item D", 2.99, this.ingredients, this.preferences, 350, "Description D", 3.1, "")
    ];

    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return Observable.of(this.menuItems);
    }
    public getAllPreferences(): Observable<Array<DietaryPreference>> {
        return Observable.of(this.preferences);
    }
    public createMenuItem(restaurantId: number, menuItem: MenuItem) {
        this.menuItems.push(menuItem);
    }
    public editMenuItem(restaurantId: number, menuItem: MenuItem) {
        let i = 0;
        let menuItemIndex = this.menuItems.findIndex((value: MenuItem, index: number, array: Array<MenuItem>) => {
            return value.menuItemId == menuItem.menuItemId;
        });
        if (menuItemIndex != -1) {
            this.menuItems[menuItemIndex] = menuItem;
        }
    }
}
