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
    private ingredients: Array<string> = ["Angus Beef", "Arugula"];
    private preferences: Array<DietaryPreference> = [
        new DietaryPreference(0, "Peanut", 1),
        new DietaryPreference(1, "Vegetarian", 0),
        new DietaryPreference(2, "Pescetarian", 0),
        new DietaryPreference(3, "Gluten", 1)
    ];
    private preferencesIds: Array<number> = [0, 1, 2, 3];
    private menuItems: Array<MenuItem> = [
        new MenuItem(0, 1, "Arugula Burger", 11.5, ["Angus Beef", "Arugula", "Gruyere"], [0, 3], 2500, "A yummy and healthy? burger", 5, "https://media.istockphoto.com/photos/beef-burger-with-arugula-tomatoes-red-onion-and-mozzarella-cheese-picture-id613899300"),
        new MenuItem(1, 1, "Arugula Salad", 32.5, ["Arugula", "Cherry Tomatoes", "Parmesan", "Lime"], [1], 500, "A fresh salad", 5, "https://thumb1.shutterstock.com/display_pic_with_logo/1059122/284819669/stock-photo-arugula-salad-with-pine-nuts-on-the-plate-in-italian-restaurant-284819669.jpg")
    ]

    public getMenuItem(restaurantId: number, menuItemId: number): Observable<MenuItem> {
        let matches: Array<MenuItem> = this.menuItems.filter(
            (val: MenuItem, index: number, array: Array<MenuItem>) => {
                return val.menuItemId == menuItemId;
            }
        );
        if (matches.length == 1) {
            return Observable.of(matches[0]);
        }
        return Observable.of(null);
    }
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
