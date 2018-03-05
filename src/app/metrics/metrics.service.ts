import { Observable } from 'rxjs/Observable';
import { MenuItemClick } from './metrics-dash/metric-graph/menu-item-click.model';

export abstract class MetricsService {
    public abstract getMenuItemClicks(restaurantId: number, menuItemId: number): Observable<Array<MenuItemClick>>;
}
