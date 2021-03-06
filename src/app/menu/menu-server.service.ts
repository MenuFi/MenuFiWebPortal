import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Restaurant } from './restaurant.model';
import { MenuItem } from './menu-item/menu-item.model';
import { AddMenuItem } from './menu-item/add-menu-item.model';
import { MenuService } from './menu.service';
import { DietaryPreference } from './menu-item/dietary-preference.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { CustomResponse } from '../shared/CustomResponse';
import { LoginService } from '../login/login.service';

@Injectable()
export class MenuServerService implements MenuService {
    constructor(private http: HttpClient, private loginService: LoginService) {
        
    }

    public getMenuItem(restaurantId: number, menuItemId: number): Observable<MenuItem> {
        return new Observable<MenuItem>((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/' + restaurantId + '/items/' + menuItemId;
            this.http
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    let response: CustomResponse<MenuItem> = CustomResponse.fromResponseMap<MenuItem>(res, this.mapMenuItem, this);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.complete();
                });
        });
    }
    public getMenuItems(restaurantId: number): Observable<Array<MenuItem>> {
        return new Observable<Array<MenuItem>>((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/' + restaurantId + '/items';
            this.http
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    let response: CustomResponse<Array<MenuItem>> = CustomResponse.fromResponseMap<Array<MenuItem>>(res, this.mapMenuItems, this);
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
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    let response: CustomResponse<Array<DietaryPreference>> = CustomResponse.fromResponseMap<Array<DietaryPreference>>(res, this.mapDietaryPreferences, this);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.complete();
                });
        });
    }
    public createMenuItem(addMenuItem: AddMenuItem): Observable<boolean> {
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/' + addMenuItem.restaurantId + '/items';
            this.http
                .post(route, JSON.stringify(addMenuItem), { headers: this.loginService.getAuthHeader() })
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
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/' + restaurantId + '/items/' + menuItem.menuItemId;
            this.http
                .put(route, JSON.stringify(menuItem), { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    observer.next(true);
                    observer.complete();
                }, (error) => {
                    observer.next(false);
                    observer.complete();
                });
        })
    }

    public getRestaurants(): Observable<Array<Restaurant>> {
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + '/restaurants';
            this.http
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    let response: CustomResponse<Array<Restaurant>> = CustomResponse.fromResponseMap<Array<Restaurant>>(res, this.mapRestaurants, this);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.next([]);
                    observer.complete();
                });
        });
    }

    public getRestaurantId(): Observable<number> {
        return new Observable((observer) => {
            let route = environment.serverBaseUrl + '/restaurants/id';
            this.http
                .get(route, { headers: this.loginService.getAuthHeader() })
                .subscribe((res) => {
                    let response: CustomResponse<number> = CustomResponse.fromResponseMap<number>(res, (val, ctx) => parseInt(val), this);
                    observer.next(response.data);
                    observer.complete();
                }, (error) => {
                    observer.next(-1);
                    observer.complete();
                });
        });
    }

    private mapMenuItems(value: any[], context: any): Array<MenuItem> {
        let result: Array<MenuItem> = [];
        for (let i = 0; i < value.length; i += 1) {
            result.push(context.mapMenuItem(value[i]));
        }
        return result;
    }

    private mapMenuItem(value: any, context: any): MenuItem {
        return new MenuItem(
            value["menuItemId"],
            value["restaurantId"],
            value["name"],
            value["price"],
            value["ingredients"],
            value["dietaryPreferences"],
            value["calories"],
            value["description"],
            value["rating"],
            value["pictureUri"]
        );
    }

    private mapDietaryPreferences(value: any[], context: any): Array<DietaryPreference> {
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

    private mapRestaurants(value: any[], context: any): Array<Restaurant> {
        let result: Array<Restaurant> = [];
        for (let i = 0; i < value.length; i += 1) {
            result.push(new Restaurant(
                value[i]["restaurantId"],
                value[i]["name"],
                Number(value[i]["price"]),
                value[i]["pictureUri"]
            ));
        }
        return result;
    }
}
