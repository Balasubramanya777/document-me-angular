import { inject, Injectable } from "@angular/core";
import { CanMatch, Router, UrlTree } from "@angular/router";
import { AuthService } from "../../features/auth/services/auth.service";
import { catchError, map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch  {

    private auth = inject(AuthService);
    private router = inject(Router);

    canMatch(): Observable<boolean | UrlTree> {
        return this.auth.resolveSession().pipe(
            map(() => true),
            catchError(() => of(this.router.createUrlTree(['/auth/sign-in'])))
        );
    }
}