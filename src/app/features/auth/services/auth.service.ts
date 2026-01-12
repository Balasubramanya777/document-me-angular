import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SignInRequest, SignInResponse } from "../models/auth.models";
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs/internal/operators/tap";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../models/api.response.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/users';

  constructor(private http: HttpClient) { }

  private saveAccessToken(token: string): void {
    localStorage.setItem('access_token', token)
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  signIn(credentials: SignInRequest): Observable<ApiResponse<SignInResponse>> {
    return this.http
      .post<ApiResponse<SignInResponse>>(`${this.baseUrl}/authenticate`, credentials)
      .pipe(
        tap(response => {
          this.saveAccessToken(response.data.accessToken)
        })
      )
  }

  logout(): void {
    localStorage.removeItem('access_token')
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken()
  }
}