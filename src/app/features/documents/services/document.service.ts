import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ApiResponse } from "../../auth/models/api.response.model";
import { ContentCreateDto, ContentDto, DocumentUpsertDto, DocumentUserDto } from "../models/document.models";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";


@Injectable({ providedIn: 'root' })
export class DocumentService {

    private baseUrl = environment.apiBaseUrl + '/documents';
    private http = inject(HttpClient)

    private titleSubject = new BehaviorSubject<string | null>(null);
    title$ = this.titleSubject.asObservable();

    getDocuments(title?: string): Observable<ApiResponse<DocumentUserDto[]>> {
        return this.http
            .get<ApiResponse<DocumentUserDto[]>>(`${this.baseUrl}?title=${title}`);
    }

    createDocument(): Observable<ApiResponse<DocumentUpsertDto>> {
        return this.http
            .post<ApiResponse<DocumentUpsertDto>>(`${this.baseUrl}`, null);
    }

    updateDocument(documentUpsertDto: DocumentUpsertDto): Observable<ApiResponse<DocumentUpsertDto>> {
        return this.http
            .patch<ApiResponse<DocumentUpsertDto>>(`${this.baseUrl}`, documentUpsertDto);
    }

    createContent(contentDto: ContentCreateDto): Observable<ApiResponse<boolean>> {
        return this.http
            .post<ApiResponse<boolean>>(`${this.baseUrl}/content`, contentDto)
    }

    getContent(documentId: number):Observable<ApiResponse<ContentDto>>{
        return this.http
            .get<ApiResponse<ContentDto>>(`${this.baseUrl}/content/${documentId}`);
    }
}