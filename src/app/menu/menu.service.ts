import { MenuItem } from './menu-item/menu-item.model';
import { Observable } from 'rxjs/Observable';
import { DietaryPreference } from './menu-item/dietary-preference.model';

export abstract class MenuService {
    public abstract getMenuItems(restaurantId: number): Observable<Array<MenuItem>>;
    public abstract getAllPreferences(): Observable<Array<DietaryPreference>>;
    public abstract createMenuItem(restaurantId: number, menuItem: MenuItem);
    public abstract editMenuItem(restaurantId: number, menuItem: MenuItem);
}
