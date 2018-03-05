import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { MenuItemClick } from './metrics-dash/metric-graph/menu-item-click.model';

@Injectable()
export class MetricsMockService extends MetricsService {
    public getMenuItemClicks(restaurantId: number, menuItemId: number): Observable<Array<MenuItemClick>> {
        let metrics: Array<MenuItemClick> = [];
        let n = 100;
        let currDate = new Date();
        for (let i = 0; i < n; i += 1) {
            metrics.push(new MenuItemClick(n - i - 1, 1, 1, currDate.toISOString()));
            let delta = Math.floor(Math.random() * 55) + 5;
            currDate.setMinutes(currDate.getMinutes() - delta);
        }
        return Observable.of(metrics);
    }
}
