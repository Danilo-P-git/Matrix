import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';
import { MatCardModule } from '@angular/material/card';

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
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="dashboard-shell">
      <div class="page-head">
        <h1 class="page-title">Dashboard</h1>
        <p class="subtitle" *ngIf="user">Bentornato <strong>{{ user.name }}</strong></p>
      </div>

      <div class="cards-grid">
        <mat-card class="dash-card">
          <div class="card-body">
            <h2>Stato Sistema</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque facilisis elit a dolor tempor.</p>
            <ul class="meta-list">
              <li><span>Utenti:</span> {{ stats.totalUsers }}</li>
              <li><span>Ruoli:</span> {{ stats.totalRoles }}</li>
              <li><span>Permessi:</span> {{ stats.totalPermissions }}</li>
            </ul>
          </div>
        </mat-card>
        <mat-card class="dash-card">
          <div class="card-body">
            <h2>Attività Recenti</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, animi.</p>
            <div class="placeholder-block">Integrazione attività in arrivo...</div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-shell { display: flex; flex-direction: column; gap: 32px; }
    .page-head { display: flex; flex-direction: column; gap: 4px; }
    .page-title { font-size: 22px; font-weight: 600; letter-spacing: .5px; margin: 0; }
    .subtitle { margin: 0; font-size: 13px; color: #a3a3a3; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; }
    .dash-card { padding: 0; }
    .card-body { padding: 24px 24px 26px; display: flex; flex-direction: column; gap: 18px; }
    h2 { font-size: 16px; font-weight: 500; margin: 0; letter-spacing: .5px; }
    p { margin: 0; font-size: 13.5px; line-height: 1.55; color: #c8c8c8; }
    .meta-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
    .meta-list li { display: flex; gap: 6px; color: #d5d5d5; }
    .meta-list span { color: #9b9b9b; }
    .placeholder-block { background: #1c1c1c; border: 1px dashed #303030; padding: 14px 16px; font-size: 12.5px; color: #8d8d8d; border-radius: 8px; }
    @media (max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } }
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
  next: (res: User | null) => { this.user = res; },
  error: (error: Error) => {
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
  error: (error: Error) => {
        console.error('Logout error:', error);
      }
    });
  }


}
