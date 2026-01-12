import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../../features/auth/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree {
        const token = this.authService.getAccessToken();

        if (token) {
            return this.router.parseUrl('/documents');
        } else {
            return this.router.parseUrl('/auth/sign-in');
        }
    }
}