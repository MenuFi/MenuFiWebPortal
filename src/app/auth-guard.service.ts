import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { LoginService } from './login/login.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('AuthGuard#canActivate called');
        return this.checkLogin(state.url);
    }

    checkLogin(redirectUrl: string): boolean {
        if (this.loginService.isLoggedIn()) {
            return true;
        }
        
        this.loginService.setRedirectUrl(redirectUrl);
        this.router.navigate(['/login']);
        return false;
    }
}