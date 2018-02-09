import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { MenuService } from './menu.service';
import { DietaryPreference } from './menu-item/dietary-preference.model';

@Injectable()
export class MenuMockService implements MenuService {
    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        let ingredients: Array<string> = ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"];
        let preferences: Array<DietaryPreference> = [
            new DietaryPreference(0, "Peanut", 1),
            new DietaryPreference(1, "Vegetarian", 0),
            new DietaryPreference(2, "Pescetarian", 0),
            new DietaryPreference(3, "Gluten", 1)
        ];
        return Observable.of([
            new MenuItem(0, "Menu Item A", 5.99, ingredients, preferences, 100, "Description A", 3.5),
            new MenuItem(1, "Menu Item B", 4.99, ingredients, preferences, 150, "Description B", 3.3),
            new MenuItem(0, "Menu Item C", 7.99, ingredients, preferences, 200, "Description C", 3.6),
            new MenuItem(1, "Menu Item D", 2.99, ingredients, preferences, 350, "Description D", 3.1)
        ]);
    }
}
