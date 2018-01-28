import { Observable } from 'rxjs/Observable';
import { CustomResponse } from '../shared/CustomResponse';

export abstract class LoginService {
    public abstract loginUser(email: string, password: string, onSuccess: (response: CustomResponse<string>) => void, onError: (response: CustomResponse<string>) => void);
    public abstract registerUser(email: string, password: string, onSuccess: (response: CustomResponse<boolean>) => void, onError: (response: CustomResponse<boolean>) => void);
    public abstract logoutUser();
    public abstract getCurrentToken(): string;
    public abstract getRedirectUrl(): string;
    public abstract setRedirectUrl(redirectUrl: string);
    public abstract isLoggedIn(): boolean;
}
