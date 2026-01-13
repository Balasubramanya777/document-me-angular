import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private router = inject(Router)

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authRequest = req.clone({ withCredentials: true });

        return next.handle(authRequest).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.router.navigate(['/auth/sign-in']);
                }
                return throwError(() => err);
            })
        );
    }
}