import { Routes } from "@angular/router";

export const DOCUMENTS_ROUTE: Routes = [
    {
        path: 'documents',
        loadComponent: () => import('./pages/document-list-page/document-list-page.component').then(m => m.DocumentListPage)
    },
    {
        path: 'documents/create',
        loadComponent: () => import('./pages/document-page/document-page.component').then(m => m.DocumentPage)
    },
    {
        path: 'documents/:id/edit',
        loadComponent: () => import('./pages/document-page/document-page.component').then(m => m.DocumentPage)
    }
]