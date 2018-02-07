import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { MenuService } from './menu.service';

@Injectable()
export class MenuMockService implements MenuService {
    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return Observable.of([
            new MenuItem(0, "Menu Item A", 5.99,
                ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
                100, "Description A", 3.5),
            new MenuItem(1, "Menu Item B", 4.99,
                ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
                150, "Description B", 3.3),
            new MenuItem(0, "Menu Item C", 7.99, 
                ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
                200, "Description C", 3.6),
            new MenuItem(1, "Menu Item D", 2.99,
                ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4", "Ingredient 5", "Ingredient 6"],
                350, "Description D", 3.1)
        ]);
    }
}