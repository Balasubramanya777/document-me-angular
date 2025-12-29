import { Component } from "@angular/core";

@Component({
    selector: 'nav-bar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBar {

    fullName = "N Balasubramanya";
    initials = "";

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
}