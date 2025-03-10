import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    registerForm = inject(FormBuilder).group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(3)]],
            username: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
            city: ['', [Validators.required]],
            address: ['', [Validators.required, Validators.minLength(10)]],
        },
        {validators: this.passwordMatchValidator});

    private authService = inject(AuthService);
    private router = inject(Router);
    errorMessage: string | null = null;
    loading: boolean = false;

    // On submit
    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.authService.register(this.registerForm.value).subscribe({
                next: (res) => {
                    let route: string = this.authService.getRoleRoute(res)
                    this.router.navigate([route])
                        .then(r => {
                            return r;
                        });
                },
                error: (error) => {
                    this.loading = false;
                    if (error.error.status === "error") {
                        error = error.error;
                        this.errorMessage = error.message;

                        if (error.errors && Array.isArray(error.errors)) {
                            error.errors.forEach((err: { field: string; message: string }) => {
                                const control = this.registerForm.get(err.field);
                                if (control) {
                                    control.setErrors({serverError: err.message});
                                }
                            });
                        }
                    } else {
                        this.errorMessage = error.message || 'An unexpected error occurred';
                    }
                }
            });
        }
    }

    private passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : {passwordMismatch: true};
    }


    // Getters for form controls
    get firstName() {
        return this.registerForm.get('firstName');
    }

    get lastName() {
        return this.registerForm.get('lastName');
    }

    get username() {
        return this.registerForm.get('username');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    get confirmPassword() {
        return this.registerForm.get('confirmPassword');
    }

    get phoneNumber() {
        return this.registerForm.get('phoneNumber');
    }

    get address() {
        return this.registerForm.get('address');
    }

    get city() {
        return this.registerForm.get('city');
    }
}
