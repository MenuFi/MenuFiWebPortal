import { MenuItem } from './menu-item/menu-item.model';
import { AddMenuItem } from './menu-item/add-menu-item.model';
import { Observable } from 'rxjs/Observable';
import { DietaryPreference } from './menu-item/dietary-preference.model';
import { Restaurant } from './restaurant.model';

export abstract class MenuService {
    public abstract getMenuItem(restaurantId: number, menuItemId: number): Observable<MenuItem>;
    public abstract getMenuItems(restaurantId: number): Observable<Array<MenuItem>>;
    public abstract getAllPreferences(): Observable<Array<DietaryPreference>>;
    public abstract createMenuItem(addMenuItem: AddMenuItem): Observable<boolean>;
    public abstract editMenuItem(restaurantId: number, menuItem: MenuItem): Observable<boolean>;
    public abstract getRestaurants(): Observable<Array<Restaurant>>;
    public abstract getRestaurantId(): Observable<number>;
}
