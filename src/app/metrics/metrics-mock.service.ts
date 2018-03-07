import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { MenuItemClick } from './metrics-dash/metric-graph/menu-item-click.model';
import { MenuService } from '../menu/menu.service';
import { MenuItem } from '../menu/menu-item/menu-item.model';

@Injectable()
export class MetricsMockService extends MetricsService {
    menuItemClicks = {};
    menuItemDates = {};
    constructor(private menuService: MenuService) {
        super();
        this.menuService.getMenuItems(1).subscribe((next) => {
            next.forEach((menuItem: MenuItem, index: number, array: MenuItem[]) => {
                this.menuItemDates[menuItem.menuItemId] = new Date();
                this.menuItemClicks[menuItem.menuItemId] = [];
                this.generateRandomClicks(menuItem.menuItemId, 100, false);
            });
        });
    }

    public getMenuItemClicks(restaurantId: number, menuItemId: number): Observable<Array<MenuItemClick>> {
        if (menuItemId in this.menuItemClicks) {
            this.generateRandomClicks(menuItemId, 10, true);
            return Observable.of(this.menuItemClicks[menuItemId]);
        }
        return Observable.of([]);
    }

    generateRandomClicks(menuItemId: number, n: number, replace: boolean) {
        let currDate = this.menuItemDates[menuItemId];
        for (let i = 0; i < n; i += 1) {
            if (this.menuItemClicks[menuItemId].length > 0 && replace) {
                this.menuItemClicks[menuItemId].shift();
            }
            this.menuItemClicks[menuItemId].push(new MenuItemClick(n - i - 1, 1, menuItemId, currDate.toISOString()));
            let delta = Math.floor(Math.random() * 55) + 5;
            currDate.setMinutes(currDate.getMinutes() + delta);
        }
        this.menuItemDates[menuItemId] = currDate;
    }
}
