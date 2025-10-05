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
    <div class="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-[#0d0d0d]">
      <mat-card class="w-full max-w-sm relative border border-zinc-800 bg-[#161616] rounded-xl px-6 pt-6 pb-4 flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
          <img class="h-20 w-auto object-contain" src="https://midichlorians.it/wp-content/uploads/2022/06/Midichlorians-Lightsaber-Academy.png" alt="Matrix Logo" />
          <h1 class="text-amber-400 tracking-widest font-semibold text-sm">MATRIX</h1>
        </div>
        <form class="flex flex-col gap-5" [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
          <!-- Email -->
          <mat-form-field appearance="fill" class="w-full text-sm">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" placeholder="nome@dominio.com" class="text-sm">
            <button mat-icon-button matSuffix type="button" disabled class="!text-zinc-500">
              <mat-icon>mail</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email obbligatoria</mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Email non valida</mat-error>
          </mat-form-field>

          <!-- Password -->
          <mat-form-field appearance="fill" class="w-full text-sm">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" autocomplete="current-password" class="text-sm">
            <button mat-icon-button matSuffix type="button" (click)="togglePassword()" [attr.aria-label]="showPassword ? 'Nascondi password' : 'Mostra password'" class="!text-zinc-500 hover:!text-amber-400 transition-colors">
              <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password obbligatoria</mat-error>
          </mat-form-field>

          <!-- Error -->
          <div *ngIf="errorMessage" class="flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            <mat-icon class="!text-red-400 !w-4 !h-4 !text-base">error</mat-icon>
            <span class="leading-snug">{{ errorMessage }}</span>
          </div>

          <!-- Submit -->
            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="w-full h-11 font-medium tracking-wide flex items-center justify-center gap-2 text-sm">
              <mat-spinner *ngIf="isLoading" diameter="18"></mat-spinner>
              <span>{{ isLoading ? 'Accesso...' : 'Entra' }}</span>
            </button>

          <!-- Link register -->
          <div class="pt-1 text-center text-[11px] text-zinc-500">
            Non hai un account?
            <a routerLink="/register" class="text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-400/50">Registrati</a>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: []
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
