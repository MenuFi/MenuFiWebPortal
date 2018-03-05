import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { MenuItemClick } from './metrics-dash/metric-graph/menu-item-click.model';

@Injectable()
export class MetricsServerService extends MetricsService {
    public getMenuItemClicks(restaurantId: number, menuItemId: number): Observable<Array<MenuItemClick>> {
        throw new Error("Method not implemented.");
    }
}
