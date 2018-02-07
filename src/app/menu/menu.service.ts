import { MenuItem } from './menu-item/menu-item.model';
import { Observable } from 'rxjs/Observable';

export abstract class MenuService {
    public abstract getMenuItems(restaurantId: number): Observable<Array<MenuItem>>;
}
