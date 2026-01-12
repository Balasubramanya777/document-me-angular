import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ApiResponse } from "../../auth/models/api.response.model";
import { DocumentUserDto } from "../models/document.models";
import { environment } from "../../../../environments/environment";


@Injectable({ providedIn: 'root' })
export class DocumentService {

    private baseUrl = environment.apiBaseUrl + '/documents';
    private http = inject(HttpClient)

    getDocuments(): Observable<ApiResponse<DocumentUserDto[]>> {
        return this.http
            .get<ApiResponse<DocumentUserDto[]>>(`${this.baseUrl}`);
    }
}