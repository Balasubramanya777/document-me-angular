import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPage)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./pages/sign-up-page/sign-up-page.component').then(m => m.SignUpPage)
    }
];