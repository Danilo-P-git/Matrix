import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <img mat-card-image width="100%" height="100%" src="https://midichlorians.it/wp-content/uploads/2022/06/Midichlorians-Lightsaber-Academy.png" alt="Matrix Logo">
          <mat-card-title>MATRIX</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="nome@dominio.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email obbligatoria</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Email non valida</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
              <mat-icon matSuffix (click)="togglePassword()" class="password-toggle">
                {{showPassword ? 'visibility_off' : 'visibility'}}
              </mat-icon>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password obbligatoria</mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-alert">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              {{ isLoading ? 'Accesso...' : 'Entra' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <span>Non hai un account? <a routerLink="/register">Registrati</a></span>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    }

    .login-card {
      max-width: 420px;
      width: 100%;
      position: relative;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      height: 52px;
      margin-top: 8px;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 8px;
      color: #ff6b6b;
      font-size: 14px;

      mat-icon {
        color: #ff6b6b;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .password-toggle {
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: #c49a00 !important;
    }

    mat-card-actions {
      text-align: center;
    }

    mat-card-actions span {
      font-size: 14px;
    }

    a {
      color: #c49a00;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border-bottom: 1px solid transparent;
    }

    a:hover {
      color: #e4b300;
      border-bottom-color: #e4b300;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        ...this.loginForm.value,
        device_name: 'web-app'
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirect to return URL or dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message;
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
