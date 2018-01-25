import { Observable } from 'rxjs/Observable';

export abstract class LoginService {
    public abstract loginUser(username: string, password: string): Observable<string>;
    public abstract registerUser(username: string, password: string): Observable<boolean>;
    public abstract getCurrentToken(): string;
}
