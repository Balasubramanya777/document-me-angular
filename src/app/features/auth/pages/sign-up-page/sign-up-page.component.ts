import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { SignUpRequest } from "../../models/auth.models";
import { ApiResponse } from "../../models/api.response.model";
import { UserDto } from "../../models/user.model";

@Component({
    selector: 'sign-up-page',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './sign-up-page.component.html',
    styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPage {

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    form: FormGroup = this.fb.group({
        username: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    signUp() {
        if (this.form.invalid) return;

        const credentials: SignUpRequest = this.form.value;
        this.authService.signUp(credentials).subscribe({
            next: (response: ApiResponse<boolean>) => {
                this.router.navigate(['/auth/sign-in']);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}