import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SignInRequest, SignUpRequest } from "../models/auth.models";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../models/api.response.model";
import { UserDto } from "../models/user.model";
import { BehaviorSubject, catchError, map, of, shareReplay, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/users';
  private session$?: Observable<void>;

  private http = inject(HttpClient);
  private userSubject = new BehaviorSubject<UserDto | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(){
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  signIn(credentials: SignInRequest): Observable<ApiResponse<UserDto>> {
    return this.http
      .post<ApiResponse<UserDto>>(`${this.baseUrl}/authenticate`, credentials)
  }

  signUp(credentials: SignUpRequest): Observable<ApiResponse<boolean>> {
    return this.http
      .post<ApiResponse<boolean>>(`${this.baseUrl}`, credentials)
  }

  logout() {
    return this.http
      .post(`${this.baseUrl}/logout`, {})
  }

  resolveSession(): Observable<void> {
    if (!this.session$) {
      this.session$ = this.http.get<void>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
        shareReplay(1),
        catchError(err => {
          this.session$ = undefined;
          return throwError(() => err);
        })
      )
    }
    return this.session$;
  }

  setUser(user: UserDto) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}