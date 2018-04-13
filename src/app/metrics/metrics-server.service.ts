import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { MetricsService } from './metrics.service';
import { MenuItemClick } from './metrics-dash/metric-graph/menu-item-click.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomResponse } from '../shared/CustomResponse';
import { environment } from '../../environments/environment';
import { LoginService } from '../login/login.service';

@Injectable()
export class MetricsServerService extends MetricsService {
    
    private lastRestaurantId = -1;

    constructor(private http: HttpClient, private loginService: LoginService) {
        super();
    }

    public getLastRestaurantId() {
        return this.lastRestaurantId;
    }

    public getMenuItemClicks(restaurantId: number, menuItemId: number): Observable<Array<MenuItemClick>> {
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/' + restaurantId + '/items/' + menuItemId + '/clicks';
            this.http
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    this.lastRestaurantId = restaurantId;
                    let response = CustomResponse.fromResponseMap<Array<MenuItemClick>>(res, this.mapMenuItemClicks, this);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.next([]);
                    observer.complete();
                });
        });
    }

    private mapMenuItemClicks(value: any[], context: any): Array<MenuItemClick> {
        let clicks: Array<MenuItemClick> = [];
        for (let i = 0; i < value.length; i += 1) {
            clicks.push(new MenuItemClick(
                Number(value[i]['menuItemClickId']),
                context.getLastRestaurantId(),
                Number(value[i]['menuItemId']),
                value[i]['timestamp']
            ));
        }
        return clicks;
    }
}
