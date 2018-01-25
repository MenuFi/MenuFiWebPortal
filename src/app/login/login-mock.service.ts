import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LoginService } from './login.service';
import { error } from 'util';
import { Router } from '@angular/router';

@Injectable()
export class LoginMockService implements LoginService {

    private userBank = {};
    private currentToken: string = null;
    private redirectUrl: string = "/";
    private loggedIn: boolean = false;

    constructor(private router: Router) {
        this.userBank = {
            "user": "password",
            "user2": "password2"
        };
    }

    public loginUser(username: string, password: string): Observable<string> {
        this.currentToken = null;
        if (username in this.userBank && password === this.userBank[username]) {
            this.currentToken = "somehash";
            this.loggedIn = true;
            this.router.navigate([this.redirectUrl]);
        }
        return Observable.of(this.currentToken);
    }

    public registerUser(username: string, password: string): Observable<boolean> {
        if (username in this.userBank) {
            return Observable.of(false);
        }
        this.userBank[username] = password;
        return Observable.of(true);
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
