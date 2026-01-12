import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            return next.handle(req);
        }

        const authRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        return next.handle(authRequest);
    }

}