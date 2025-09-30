import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeTokens: number;
}

interface Activity {
  type: string;
  description: string;
  created_at: string;
  user?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Dashboard</h1>
        <div class="user-info">
          <span *ngIf="user">Welcome, {{ user.name }}!</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </header>

      <main class="content">
        <div class="user-card" *ngIf="user">
          <h2>User Information</h2>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>

          <div *ngIf="user.roles && user.roles.length > 0">
            <h3>Roles:</h3>
            <ul>
              <li *ngFor="let role of user.roles">{{ role.name }}</li>
            </ul>
          </div>

          <ng-container *ngIf="user.all_permissions && user.all_permissions.length > 0; else elseTemplate">
            <h3>Permissions:</h3>
            <ul>
              <li *ngFor="let permission of user.all_permissions">{{ permission?.name }}</li>
            </ul>
          </ng-container>
          <ng-template #elseTemplate>
            <p>No permissions found.</p>
          </ng-template>


          </div>

        <div class="actions">
          <h2>Available Actions</h2>
          <div class="action-buttons">
            <a
              *ngIf="hasRole('admin')"
              routerLink="/admin"
              class="action-btn admin-btn"
            >
              Admin Panel
            </a>

            <a
              *ngIf="hasPermission('view users')"
              routerLink="/users"
              class="action-btn"
            >
              View Users
            </a>

            <button
              (click)="logout()"
              class="action-btn danger-btn"
            >
              Logout All Devices
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .user-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .actions {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
    }

    .admin-btn {
      background-color: #28a745;
    }

    .danger-btn {
      background-color: #dc3545;
    }

    .action-btn:hover {
      opacity: 0.9;
    }

    ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  stats: DashboardStats = {
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    activeTokens: 0
  };
  recentActivity: Activity[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardStats();
  }

  private loadUserData(): void {
    // this.authService.user$.subscribe(user => {
    //   this.user = user;
    // });

    // Refresh user data to get latest roles/permissions
    this.authService.getCurrentUser().subscribe({
      next: (res) => { this.user = res; },
      error: (error) => {
        if (!/401|Non autenticato/i.test(error.message)) {
          console.error('Error loading user data:', error);
        }
      }
    });
  }

  private loadDashboardStats(): void {
    // Mock data - replace with real API calls
    this.stats = {
      totalUsers: 156,
      totalRoles: 5,
      totalPermissions: 12,
      activeTokens: 3
    };
  }

  private loadRecentActivity(): void {
    // Mock data - replace with real API calls
    if (this.hasPermission('view users')) {
      this.recentActivity = [
        {
          type: 'user_login',
          description: 'John Doe logged in',
          created_at: '2025-09-30T10:30:00Z'
        },
        {
          type: 'user_created',
          description: 'New user registered: jane@example.com',
          created_at: '2025-09-30T09:15:00Z'
        },
        {
          type: 'role_assigned',
          description: 'Admin role assigned to Mike Wilson',
          created_at: '2025-09-30T08:45:00Z'
        }
      ];
    }
  }

  getUserPrimaryRole(): string {
    if (!this.user?.roles || this.user.roles.length === 0) return 'User';
    const roleHierarchy = ['admin', 'moderator', 'user'];
    for (const role of roleHierarchy) {
      if (this.user.roles.some(r => r.name === role)) {
        return role.charAt(0).toUpperCase() + role.slice(1);
      }
    }
    return this.user.roles[0].name;
  }

  getRoleBadgeClass(roleName: string): string {
    return roleName.toLowerCase();
  }

  hasRole(roleName: string): boolean {
    return this.authService.hasRole(roleName);
  }

  hasPermission(permissionName: string): boolean {
    return this.authService.hasPermission(permissionName);
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'user_login': '🔐',
      'user_created': '👤',
      'role_assigned': '🛡️',
      'permission_granted': '🔑',
      'system_update': '⚙️'
    };
    return icons[type] || '📝';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  }

  // Navigation methods
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToRoles(): void {
    this.router.navigate(['/roles']);
  }

  viewSystemLogs(): void {
    alert('System logs feature coming soon!');
  }

  systemSettings(): void {
    alert('System settings feature coming soon!');
  }

  viewReports(): void {
    alert('Reports feature coming soon!');
  }

  moderateContent(): void {
    alert('Content moderation feature coming soon!');
  }

  editProfile(): void {
    alert('Edit profile feature coming soon!');
  }

  changePassword(): void {
    alert('Change password feature coming soon!');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // AuthService handles navigation
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }


}
