import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ApiResponse } from "../../auth/models/api.response.model";
import { ContentCreateDto, ContentDto, DocumentUpsertDto, DocumentUserDto } from "../models/document.models";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { SKIP_LOADER } from "../../../core/http-context/loader.context";


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
            .patch<ApiResponse<DocumentUpsertDto>>(`${this.baseUrl}`, documentUpsertDto, {context: new HttpContext().set(SKIP_LOADER, true)});
    }

    createContent(contentDto: ContentCreateDto): Observable<ApiResponse<boolean>> {
        return this.http
            .post<ApiResponse<boolean>>(`${this.baseUrl}/content`, contentDto, {context: new HttpContext().set(SKIP_LOADER, true)})
    }

    getContent(documentId: number):Observable<ApiResponse<ContentDto>>{
        return this.http
            .get<ApiResponse<ContentDto>>(`${this.baseUrl}/content/${documentId}`);
    }
}