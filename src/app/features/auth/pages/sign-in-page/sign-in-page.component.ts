import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { SignInRequest } from "../../models/auth.models";
import { Router } from "@angular/router";
import { ApiResponse } from "../../models/api.response.model";
import { UserDto } from "../../models/user.model";

@Component({
    selector: 'sign-in-page',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['sign-in-page.component.scss']
})
export class SignInPage {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    form: FormGroup = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    signIn() {
        if (this.form.invalid) return;

        const credentials: SignInRequest = this.form.value;
        this.authService.signIn(credentials).subscribe({
            next: (response: ApiResponse<UserDto>) => {
                this.authService.setUser(response.data);
                this.router.navigate(['/documents']);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}