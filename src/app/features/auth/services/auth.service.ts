import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SignInRequest, SignInResponse } from "../models/auth.models";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "../../../../environments/environment";
import { ApiResponse } from "../models/api.response.model";
import { UserDto } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl + '/users';

  private http = inject(HttpClient)

  signIn(credentials: SignInRequest): Observable<ApiResponse<UserDto>> {
    return this.http
      .post<ApiResponse<UserDto>>(`${this.baseUrl}/authenticate`, credentials)
  }

  logout() {
    return this.http
      .post(`${this.baseUrl}/logout`, {})
  }
}