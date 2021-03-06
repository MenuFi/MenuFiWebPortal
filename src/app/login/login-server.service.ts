import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CustomResponse } from '../shared/CustomResponse';
import { HttpErrorResponse } from '@angular/common/http/src/response';

@Injectable()
export class LoginServerService implements LoginService {

    private currentToken: string = null;
    private redirectUrl: string = "/";
    private loggedIn: boolean = false;

    constructor(private http: HttpClient, private router: Router) { }

    public loginUser(email: string, password: string, onSuccess: (response: CustomResponse<string>) => void, onError: (response: CustomResponse<string>) => void) {
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
                    let response: CustomResponse<string> = CustomResponse.fromResponse<string>(res);
                    this.loggedIn = true;
                    this.currentToken = response.data;
                    onSuccess(response);
                    this.router.navigate([this.redirectUrl]);
                },
                (httpError: HttpErrorResponse) => {
                    let errorResponse: CustomResponse<string> = CustomResponse.fromResponse<string>(httpError.error);
                    if (errorResponse.message === null) {
                        errorResponse.status = "error";
                        errorResponse.message = httpError.status + ": " + httpError.statusText;
                    }
                    onError(errorResponse);
                    console.log(httpError);
                });
    }
    
    public registerUser(email: string, password: string, onSuccess: (response: CustomResponse<boolean>) => void, onError: (response: CustomResponse<boolean>) => void) {
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
                    let response: CustomResponse<boolean> = CustomResponse.fromResponse<boolean>(res);
                    onSuccess(response);
                },
                (httpError: HttpErrorResponse) => {
                    console.log(httpError);
                    let errorResponse: CustomResponse<boolean> = CustomResponse.fromResponse<boolean>(httpError.error);
                    onError(errorResponse);
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

    public getAuthHeader(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'MenuFi ' + this.getCurrentToken()
        });
    }
}
