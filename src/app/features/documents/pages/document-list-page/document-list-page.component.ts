import { Component, inject, OnInit } from "@angular/core";
import { DocumentService } from "../../services/document.service";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { DocumentUserDto } from "../../models/document.models";
import { CommonModule } from "@angular/common";
import { catchError, map, of, shareReplay } from 'rxjs';


@Component({
    selector: 'document-list-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './document-list-page.component.html',
    styleUrls: ['./document-list-page.component.scss']
})
export class DocumentListPage {

    private documentService = inject(DocumentService);

    readonly documents$ = this.documentService.getDocuments().pipe(
        map((res: ApiResponse<DocumentUserDto[]>) => {
            if (res.success) {
                return res.data
            }
            console.error('API error:', res.message);
            return [];
        }),
        catchError(err => {
            console.error('HTTP error:', err);
            return of([] as DocumentUserDto[]);
        })
    );
}