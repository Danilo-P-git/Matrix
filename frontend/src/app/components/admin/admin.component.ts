import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>🔧 Admin Panel</h1>
          <nav class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a> / Admin
          </nav>
        </div>
      </header>

      <main class="admin-content">
        <!-- System Overview -->
        <section class="overview-section">
          <h2>System Overview</h2>
          <div class="overview-grid">
            <div class="overview-card">
              <div class="card-icon">🖥️</div>
              <div class="card-content">
                <h3>Server Status</h3>
                <p class="status online">● Online</p>
                <small>Uptime: 15 days, 3 hours</small>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">💾</div>
              <div class="card-content">
                <h3>Database</h3>
                <p class="status online">● Connected</p>
                <small>Response: 12ms</small>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">🔄</div>
              <div class="card-content">
                <h3>Cache</h3>
                <p class="status online">● Active</p>
                <small>Hit Rate: 94.2%</small>
              </div>
            </div>
            <div class="overview-card">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <h3>Queue Jobs</h3>
                <p class="status">{{ queueJobs }} pending</p>
                <small>Processing normally</small>
              </div>
            </div>
          </div>
        </section>

        <!-- Management Sections -->
        <div class="management-grid">
          <!-- User Management -->
          <section class="management-section">
            <h3>👥 User Management</h3>
            <div class="management-actions">
              <button routerLink="/users" class="action-btn primary">
                <span class="btn-icon">👥</span>
                View All Users
              </button>
              <button (click)="createUser()" class="action-btn secondary">
                <span class="btn-icon">➕</span>
                Create User
              </button>
              <button (click)="exportUsers()" class="action-btn info">
                <span class="btn-icon">📤</span>
                Export Users
              </button>
            </div>
            <div class="quick-stats">
              <div class="stat-item">
                <strong>156</strong> Total Users
              </div>
              <div class="stat-item">
                <strong>12</strong> New this week
              </div>
            </div>
          </section>

          <!-- Role & Permission Management -->
          <section class="management-section">
            <h3>🛡️ Roles & Permissions</h3>
            <div class="management-actions">
              <button (click)="manageRoles()" class="action-btn primary">
                <span class="btn-icon">🛡️</span>
                Manage Roles
              </button>
              <button (click)="managePermissions()" class="action-btn secondary">
                <span class="btn-icon">🔑</span>
                Permissions
              </button>
              <button (click)="auditLog()" class="action-btn warning">
                <span class="btn-icon">📋</span>
                Audit Log
              </button>
            </div>
            <div class="quick-stats">
              <div class="stat-item">
                <strong>5</strong> Active Roles
              </div>
              <div class="stat-item">
                <strong>12</strong> Permissions
              </div>
            </div>
          </section>

          <!-- System Settings -->
          <section class="management-section">
            <h3>⚙️ System Settings</h3>
            <div class="management-actions">
              <button (click)="systemConfig()" class="action-btn primary">
                <span class="btn-icon">⚙️</span>
                Configuration
              </button>
              <button (click)="backupSystem()" class="action-btn info">
                <span class="btn-icon">💾</span>
                Backup
              </button>
              <button (click)="clearCache()" class="action-btn warning">
                <span class="btn-icon">🗑️</span>
                Clear Cache
              </button>
            </div>
            <div class="quick-stats">
              <div class="stat-item">
                <strong>Last Backup:</strong> 2 hours ago
              </div>
            </div>
          </section>

          <!-- Monitoring -->
          <section class="management-section">
            <h3>📊 Monitoring</h3>
            <div class="management-actions">
              <button (click)="viewLogs()" class="action-btn primary">
                <span class="btn-icon">📋</span>
                System Logs
              </button>
              <button (click)="performance()" class="action-btn info">
                <span class="btn-icon">📈</span>
                Performance
              </button>
              <button (click)="security()" class="action-btn danger">
                <span class="btn-icon">🔐</span>
                Security
              </button>
            </div>
            <div class="quick-stats">
              <div class="stat-item">
                <strong>3</strong> Active sessions
              </div>
              <div class="stat-item">
                <strong>0</strong> Errors today
              </div>
            </div>
          </section>
        </div>

        <!-- Recent Activity -->
        <section class="activity-section">
          <h2>Recent Admin Activity</h2>
          <div class="activity-list">
            <div *ngFor="let activity of recentActivity" class="activity-item">
              <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
              <div class="activity-content">
                <p class="activity-description">{{ activity.description }}</p>
                <div class="activity-meta">
                  <span class="activity-user">by {{ activity.user }}</span>
                  <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                </div>
              </div>
              <div class="activity-status" [ngClass]="activity.status">
                {{ activity.status }}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .breadcrumb {
      font-size: 0.9rem;
      color: #6c757d;
    }

    .breadcrumb a {
      text-decoration: none;
      color: #007bff;
    }

    .admin-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .overview-section {
      margin-bottom: 3rem;
    }

    .overview-section h2 {
      color: white;
      text-align: center;
      margin-bottom: 2rem;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .overview-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .card-icon {
      font-size: 2.5rem;
    }

    .card-content h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .status {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
    }

    .status.online {
      color: #28a745;
    }

    .card-content small {
      color: #6c757d;
      font-size: 0.85rem;
    }

    .management-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .management-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .management-section h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.5rem;
    }

    .management-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      text-align: left;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    .action-btn.primary {
      background: #007bff;
      color: white;
    }

    .action-btn.secondary {
      background: #6c757d;
      color: white;
    }

    .action-btn.info {
      background: #17a2b8;
      color: white;
    }

    .action-btn.warning {
      background: #ffc107;
      color: #212529;
    }

    .action-btn.danger {
      background: #dc3545;
      color: white;
    }

    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-item {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .stat-item strong {
      color: #2c3e50;
    }

    .activity-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .activity-section h2 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .activity-item:hover {
      background: rgba(0,123,255,0.05);
      border-color: #007bff;
    }

    .activity-icon {
      font-size: 1.5rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-description {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .activity-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: #6c757d;
    }

    .activity-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .activity-status.success {
      background: #d4edda;
      color: #155724;
    }

    .activity-status.warning {
      background: #fff3cd;
      color: #856404;
    }

    .activity-status.error {
      background: #f8d7da;
      color: #721c24;
    }

    @media (max-width: 768px) {
      .admin-content {
        padding: 1rem;
      }

      .overview-grid, .management-grid {
        grid-template-columns: 1fr;
      }

      .management-actions {
        gap: 0.5rem;
      }

      .activity-item {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  queueJobs = 3;

  recentActivity = [
    {
      type: 'user_created',
      description: 'New user account created for jane.doe@example.com',
      user: 'System',
      timestamp: '2025-09-30T10:30:00Z',
      status: 'success'
    },
    {
      type: 'role_updated',
      description: 'Role permissions updated for Moderator role',
      user: 'Admin User',
      timestamp: '2025-09-30T09:15:00Z',
      status: 'success'
    },
    {
      type: 'backup',
      description: 'System backup completed successfully',
      user: 'System',
      timestamp: '2025-09-30T08:00:00Z',
      status: 'success'
    },
    {
      type: 'login_failed',
      description: 'Multiple failed login attempts detected',
      user: 'Security Monitor',
      timestamp: '2025-09-30T07:45:00Z',
      status: 'warning'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Load admin dashboard data
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'user_created': '👤',
      'role_updated': '🛡️',
      'backup': '💾',
      'login_failed': '⚠️',
      'system_update': '🔄'
    };
    return icons[type] || '📝';
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  }

  // Action methods
  createUser(): void {
    alert('Create user functionality coming soon!');
  }

  exportUsers(): void {
    alert('Export users functionality coming soon!');
  }

  manageRoles(): void {
    alert('Role management functionality coming soon!');
  }

  managePermissions(): void {
    alert('Permission management functionality coming soon!');
  }

  auditLog(): void {
    alert('Audit log functionality coming soon!');
  }

  systemConfig(): void {
    alert('System configuration functionality coming soon!');
  }

  backupSystem(): void {
    alert('System backup functionality coming soon!');
  }

  clearCache(): void {
    if (confirm('Are you sure you want to clear the system cache?')) {
      alert('Cache cleared successfully!');
    }
  }

  viewLogs(): void {
    alert('System logs functionality coming soon!');
  }

  performance(): void {
    alert('Performance monitoring functionality coming soon!');
  }

  security(): void {
    alert('Security monitoring functionality coming soon!');
  }
}
