import { Component, inject } from "@angular/core";
import { AuthService } from "../../../features/auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'nav-bar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBar {

    fullName = "N Balasubramanya";
    initials = "";

    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.initials = this.getInitials(this.fullName);
    }

    getInitials(name: string): string {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/auth/sign-in']);
            }
        });
    }

}