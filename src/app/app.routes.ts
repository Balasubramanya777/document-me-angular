import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { DOCUMENTS_ROUTE } from './features/documents/documents.routes';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayout } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'documents',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: AUTH_ROUTES
    },
    {
        path: '',
        component: MainLayout,
        children: DOCUMENTS_ROUTE
    }
];
