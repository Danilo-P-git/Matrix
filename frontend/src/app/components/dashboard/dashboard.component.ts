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
<div class="space-y-5">
  <div class="kt-alert kt-alert-light kt-alert-primary" id="alert_1">
    <div class="kt-alert-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-info"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </div>
    <div class="kt-alert-title">This is a primary alert</div>
    <div class="kt-alert-toolbar">
      <div class="kt-alert-actions">
        <button class="kt-link kt-link-xs kt-link-underlined text-mono">
          Upgrade</button
        ><button class="kt-alert-close" data-kt-dismiss="#alert_1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="kt-alert kt-alert-light kt-alert-success" id="alert_2">
    <div class="kt-alert-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-info"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </div>
    <div class="kt-alert-title">This is a success alert</div>
    <div class="kt-alert-toolbar">
      <div class="kt-alert-actions">
        <button class="kt-link kt-link-xs kt-link-underlined text-mono">
          Upgrade</button
        ><button class="kt-alert-close" data-kt-dismiss="#alert_2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="kt-alert kt-alert-light kt-alert-info" id="alert_3">
    <div class="kt-alert-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-info"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </div>
    <div class="kt-alert-title">This is an info alert</div>
    <div class="kt-alert-toolbar">
      <div class="kt-alert-actions">
        <button class="kt-link kt-link-xs kt-link-underlined text-mono">
          Upgrade</button
        ><button class="kt-alert-close" data-kt-dismiss="#alert_3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="kt-alert kt-alert-light kt-alert-destructive" id="alert_4">
    <div class="kt-alert-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-info"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </div>
    <div class="kt-alert-title">This is a destructive alert</div>
    <div class="kt-alert-toolbar">
      <div class="kt-alert-actions">
        <button class="kt-link kt-link-xs kt-link-underlined text-mono">
          Upgrade</button
        ><button class="kt-alert-close" data-kt-dismiss="#alert_4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="kt-alert kt-alert-light kt-alert-warning" id="alert_5">
    <div class="kt-alert-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-info"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    </div>
    <div class="kt-alert-title">This is a warning alert</div>
    <div class="kt-alert-toolbar">
      <div class="kt-alert-actions">
        <button class="kt-link kt-link-xs kt-link-underlined text-mono">
          Upgrade</button
        ><button class="kt-alert-close" data-kt-dismiss="#alert_5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`

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
