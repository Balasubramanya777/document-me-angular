import { Component, inject, OnInit } from "@angular/core";
import { DocumentService } from "../../services/document.service";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { DocumentUserDto } from "../../models/document.models";
import { CommonModule } from "@angular/common";
import { catchError, map, of, shareReplay } from 'rxjs';
import { Router } from "@angular/router";


@Component({
    selector: 'document-list-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './document-list-page.component.html',
    styleUrls: ['./document-list-page.component.scss']
})
export class DocumentListPage {

    private documentService = inject(DocumentService);
    private route = inject(Router);

    readonly documents$ = this.documentService.getDocuments().pipe(
        map((res: ApiResponse<DocumentUserDto[]>) => {
            if (res.success) {
                return res.data
            }
            return [];
        }),
        catchError(err => {
            return of([] as DocumentUserDto[]);
        })
    );

    createDoc(){
        this.route.navigate(['/documents/create']);
    }
}