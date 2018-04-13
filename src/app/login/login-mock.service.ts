import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LoginService } from './login.service';
import { error } from 'util';
import { Router } from '@angular/router';
import { CustomResponse } from '../shared/CustomResponse';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginMockService implements LoginService {

    private userBank = {};
    private currentToken: string = null;
    private redirectUrl: string = "/";
    private loggedIn: boolean = false;

    constructor(private router: Router) {
        this.userBank = {
            "user": "password",
            "user2": "password2",
            "user@email.com": "password"
        };
    }

    public loginUser(email: string, password: string, onSuccess: (response: CustomResponse<string>) => void, onError: (response: CustomResponse<string>) => void) {
        this.currentToken = null;
        if (email in this.userBank && password === this.userBank[email]) {
            this.currentToken = "somehash";
            this.loggedIn = true;
            this.router.navigate([this.redirectUrl]);
            onSuccess(new CustomResponse<string>("success", this.currentToken, null));
        } else {
            onError(new CustomResponse<string>("error", null, "Wrong username or password."));
        }
    }

    public registerUser(email: string, password: string, onSuccess: (response: CustomResponse<boolean>) => void, onError: (response: CustomResponse<boolean>) => void) {
        if (email in this.userBank) {
            onError(new CustomResponse<boolean>("error", false, "Account already exists!"));
        } else {
            this.userBank[email] = password;
            onSuccess(new CustomResponse<boolean>("success", true, null));
        }
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

    public getAuthHeader(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'MenuFi ' + this.getCurrentToken()
        });
    }
}
