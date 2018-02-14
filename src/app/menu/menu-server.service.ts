import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MenuItem } from './menu-item/menu-item.model';
import { AddMenuItem } from './menu-item/add-menu-item.model';
import { MenuService } from './menu.service';
import { DietaryPreference } from './menu-item/dietary-preference.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { CustomResponse } from '../shared/CustomResponse';

@Injectable()
export class MenuServerService implements MenuService {
    constructor(private http: HttpClient) {
        
    }

    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return new Observable<Array<MenuItem>>((observer) => {
            let route = environment.serverBaseUrl + "/items?restaurantId=" + restaurantId;
            this.http
                .get(route)
                .subscribe((res) => {
                    let response: CustomResponse<Array<MenuItem>> = CustomResponse.fromResponseMap<Array<MenuItem>>(res, this.mapMenuItems);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.complete();
                });
        });
    }
    public getAllPreferences(): Observable<Array<DietaryPreference>> {
        return new Observable<Array<DietaryPreference>>((observer) => {
            let route = environment.serverBaseUrl + "/preferences";
            this.http
                .get(route)
                .subscribe((res) => {
                    let response: CustomResponse<Array<DietaryPreference>> = CustomResponse.fromResponseMap<Array<DietaryPreference>>(res, this.mapDietaryPreferences);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.complete();
                });
        });
    }
    public createMenuItem(addMenuItem: AddMenuItem): Observable<boolean> {
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + "/items";
            let headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
            this.http
                .post(route, JSON.stringify(addMenuItem), { headers: headers })
                .subscribe((res) => {
                    observer.next(true);
                    observer.complete();
                }, (error) => {
                    observer.next(false);
                    observer.complete();
                })
        });
    }
    public editMenuItem(restaurantId: number, menuItem: MenuItem): Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    private mapMenuItems(value: any[]): Array<MenuItem> {
        let result: Array<MenuItem> = [];
        for (let i = 0; i < value.length; i += 1) {
            result.push(new MenuItem(
                value[i]["menuItemId"],
                value[i]["restaurantId"],
                value[i]["name"],
                value[i]["price"],
                value[i]["ingredients"],
                value[i]["dietaryPreferences"],
                value[i]["calories"],
                value[i]["description"],
                value[i]["rating"],
                value[i]["pictureUri"]
            ));
        }
        return result;
    }

    private mapDietaryPreferences(value: any[]): Array<DietaryPreference> {
        let result: Array<DietaryPreference> = [];
        for (let i = 0; i < value.length; i += 1) {
            result.push(new DietaryPreference(
                value[i]["dietaryPreferenceId"],
                value[i]["name"],
                value[i]["type"]
            ));
        }
        return result;
    }
}
