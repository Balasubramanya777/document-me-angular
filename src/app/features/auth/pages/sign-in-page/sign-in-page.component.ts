import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SignInRequest } from "../../models/auth.models";
import { Router } from "@angular/router";

@Component({
    selector: 'sign-in-page',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['sign-in-page.component.scss']
})
export class SignInPage {

    form!: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

        this.form = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    signIn() {
        if (this.form.invalid) return;

        const credentials: SignInRequest = this.form.value;
        this.authService.signIn(credentials).subscribe({
            next: (response) => {
                this.router.navigate(['/documents']);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}