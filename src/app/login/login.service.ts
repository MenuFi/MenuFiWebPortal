import { Observable } from 'rxjs/Observable';

export abstract class LoginService {
    public abstract loginUser(email: string, password: string): Observable<string>;
    public abstract registerUser(email: string, password: string): Observable<boolean>;
    public abstract logoutUser();
    public abstract getCurrentToken(): string;
    public abstract getRedirectUrl(): string;
    public abstract setRedirectUrl(redirectUrl: string);
    public abstract isLoggedIn(): boolean;
}
