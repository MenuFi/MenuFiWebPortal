import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class LoginServerService implements LoginService {

    private currentToken: string = null;
    private redirectUrl: string = "/";
    private loggedIn: boolean = false;

    constructor(private http: HttpClient, private router: Router) { }

    public loginUser(email: string, password: string): Observable<string> {
        return new Observable<string>(observer => {
            let route = environment.serverBaseUrl + "/restaurant/loginToken";
            let body = {
                "email": email,
                "password": password
            }
            let loginHeaders = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http
                .post(route, JSON.stringify(body), { headers: loginHeaders })
                .subscribe(
                    res => {
                        this.loggedIn = true;
                        observer.next(res["data"]);
                        observer.complete();
                        this.router.navigate([this.redirectUrl]);
                    },
                    error => {
                        console.log(error);
                    })
        });
    }
    
    public registerUser(email: string, password: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            let route = environment.serverBaseUrl + "/restaurant/registration";
            let body = {
                "email": email,
                "password": password
            }
            let loginHeaders = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            this.http
                .post(route, JSON.stringify(body), { headers: loginHeaders })
                .subscribe(
                    res => {
                        observer.next(res["data"] == true);
                        observer.complete();
                    },
                    error => {
                        console.log(error);
                        observer.next(false);
                        observer.complete();
                    })
        });
    }

    public logoutUser() {
        this.loggedIn = false;
    }

    public getCurrentToken(): string {
        return this.currentToken;
    }

    public getRedirectUrl(): string {
        return this.redirectUrl;
    }

    public setRedirectUrl(redirectUrl: string) {
        this.redirectUrl = redirectUrl;
    }

    public isLoggedIn(): boolean {
        return this.loggedIn;
    }
}
