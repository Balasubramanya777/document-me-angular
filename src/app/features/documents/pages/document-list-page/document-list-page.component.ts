import { Component, inject } from "@angular/core";
import { DocumentService } from "../../services/document.service";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { DocumentUserDto } from "../../models/document.models";
import { CommonModule } from "@angular/common";
import { catchError, map, of } from 'rxjs';
import { Router } from "@angular/router";
import { Loader } from "../../../../shared/components/loader/loader.component";


@Component({
    selector: 'document-list-page',
    standalone: true,
    imports: [CommonModule, Loader],
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

    create() {
        this.route.navigate(['/documents/create']);
    }

    
}