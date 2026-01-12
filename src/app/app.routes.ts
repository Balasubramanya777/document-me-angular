import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { DOCUMENTS_ROUTE } from './features/documents/documents.routes';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayout } from './core/layouts/main-layout/main-layout.component';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthRedirectGuard],
        pathMatch: 'full',
        redirectTo: ''
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: AUTH_ROUTES
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [AuthGuard],
        children: DOCUMENTS_ROUTE
    }
];
