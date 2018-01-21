import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { LoginService } from './login.service';

@Injectable()
export class LoginMockService implements LoginService {
    public loginUser(username: string, password: string): Observable<string> {
        return Observable.of("somehash");
    }
    public registerUser(username: string, password: string): Observable<boolean> {
        return Observable.of(true);
    }
}
