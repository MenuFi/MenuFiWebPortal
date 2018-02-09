import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { MenuService } from './menu.service';

@Injectable()
export class MenuServerService implements MenuService {
    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        // TODO: Actually implement http call once backend is up and serving
        return Observable.of([
            new MenuItem(0, "TODO: Implement HTTP Calls", 10.99, [], [], 10000, "Waiting on the backend API to be released", 0.0),
        ]);
    }
}
