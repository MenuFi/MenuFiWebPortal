import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { MenuService } from './menu.service';

@Injectable()
export class MenuMockService implements MenuService {
    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return Observable.of([
            new MenuItem(0, "Menu Item A", 5.99, [], 100, "Description A", 3.5),
            new MenuItem(1, "Menu Item B", 4.99, [], 150, "Description B", 3.3)
        ]);
    }
}
