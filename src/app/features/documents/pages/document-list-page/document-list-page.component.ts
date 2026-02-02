import { Component, inject } from "@angular/core";
import { DocumentService } from "../../services/document.service";
import { ApiResponse } from "../../../auth/models/api.response.model";
import { DocumentUpsertDto, DocumentUserDto } from "../../models/document.models";
import { CommonModule } from "@angular/common";
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { Router } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RelativeTimePipe } from "../../../../shared/pipes/relative-time.pipe";
import { LoaderService } from "../../../../shared/components/loader/loader.service";


@Component({
    selector: 'document-list-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RelativeTimePipe],
    templateUrl: './document-list-page.component.html',
    styleUrls: ['./document-list-page.component.scss']
})
export class DocumentListPage {

    private loader = inject(LoaderService);
    private documentService = inject(DocumentService);
    private route = inject(Router);
    private searchClick$ = new Subject<void>();
    searchControl = new FormControl<string>('');

    readonly documents$ = this.searchClick$.pipe(
        startWith(void 0),
        switchMap(() => this.documentService.getDocuments(this.searchControl.value ?? undefined)),
        map((res: ApiResponse<DocumentUserDto[]>) => {
            if (res.success) {
                return res.data
            }
            return [];
        }),
        catchError(err => {
            return of([] as DocumentUserDto[]);
        })
    )


    create() {
        this.documentService.createDocument().subscribe({
            next: (res: ApiResponse<DocumentUpsertDto>) => {
                if (res.success) {
                    this.route.navigate(['/documents', res.data.documentId]);
                }
            }
        });
        
    }

    edit(documentId: number) {
        this.route.navigate(['/documents', documentId]);
    }

    search(): void {
        this.searchClick$.next();
    }
}