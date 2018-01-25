import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LoginService } from './login.service';
import { error } from 'util';

@Injectable()
export class LoginMockService implements LoginService {

    private userBank = {};
    private currentToken: string = null;

    constructor() {
        this.userBank = {
            "user": "password",
            "user2": "password2"
        };
    }

    public loginUser(username: string, password: string): Observable<string> {
        if (username in this.userBank && password === this.userBank[username]) {
            this.currentToken = "somehash";
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

    public getCurrentToken(): string {
        return this.currentToken;
    }
}
