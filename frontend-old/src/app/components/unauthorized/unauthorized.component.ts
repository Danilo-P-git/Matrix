import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-content">
        <h1>❌ Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <a routerLink="/dashboard" class="return-btn">Return to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .unauthorized-content {
      text-align: center;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      max-width: 400px;
    }

    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    p {
      color: #6c757d;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .return-btn {
      background: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background 0.3s ease;
    }

    .return-btn:hover {
      background: #0056b3;
    }
  `]
})
export class UnauthorizedComponent {}
