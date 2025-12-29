import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavBar } from "../../../shared/components/navbar/navbar.component";

@Component({
    selector: 'main-layout',
    standalone: true,
    imports: [RouterOutlet, NavBar],
    templateUrl: './main-layout.component.html',
})
export class MainLayout { }