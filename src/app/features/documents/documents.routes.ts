import { Routes } from "@angular/router";

export const DOCUMENTS_ROUTE: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/document-list-page/document-list-page.component').then(m => m.DocumentListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./pages/document-page/document-page.component').then(m => m.DocumentPage)
    },
    {
        path: ':id/edit',
        loadComponent: () => import('./pages/document-page/document-page.component').then(m => m.DocumentPage)
    }
]