import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;
  loading: boolean = false;

  // On submit
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;

      this.authService.login(this.loginForm.value as {email: string, password: string}).subscribe({
          next: (res) => {
            let route: string = this.authService.getRoleRoute(res);
            this.router.navigate([route])
              .then(r => {
                return r;
              });
          },
          error: (error) => {
            this.loading = false;

            if (error.error && error.error.status === "error") {
              error = error.error;
              this.errorMessage = error.message;

              if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: { field: string; message: string }) => {
                  const control = this.loginForm.get(err.field);
                  if (control) {
                    control.setErrors({ serverError: err.message });
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

  // Getters for form controls
  public get email() {
    return this.loginForm.get('email');
  }

  public get password() {
    return this.loginForm.get('password');
  }
}
