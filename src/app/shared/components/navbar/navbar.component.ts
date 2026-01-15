import { Component, inject } from "@angular/core";
import { AuthService } from "../../../features/auth/services/auth.service";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { UserDto } from "../../../features/auth/models/user.model";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'nav-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBar {

    private authService = inject(AuthService);
    private router = inject(Router);

    user$: Observable<UserDto | null> = this.authService.user$;
    initials$ = this.user$.pipe(map(user => user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'UK'));
    fullName$ = this.user$.pipe(map(user => user ? `${user.firstName} ${user.lastName}` : 'Unknown User'));

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.authService.clearUser();
                this.router.navigate(['/auth/sign-in']);
            }
        });
    }

}