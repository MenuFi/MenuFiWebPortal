import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginServerService implements LoginService {

    private currentToken: string = null;

    constructor(private http: HttpClient) { }

    public loginUser(username: string, password: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
    
    public registerUser(username: string, password: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }

    public getCurrentToken(): string {
        return this.currentToken;
    }
}
