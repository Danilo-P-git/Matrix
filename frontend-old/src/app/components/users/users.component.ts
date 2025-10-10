import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="users-page">
      <header class="page-header">
        <div class="header-content">
          <h1>👥 User Management</h1>
          <nav class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a> / Users
          </nav>
        </div>
        <div class="header-actions">
          <button *ngIf="hasPermission('create users')" class="btn btn-primary">
            ➕ Add User
          </button>
        </div>
      </header>

      <main class="page-content">
        <!-- Stats cards -->
        <section class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-details">
              <h3>{{ mockUsers.length }}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-details">
              <h3>{{ getActiveUsers() }}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👑</div>
            <div class="stat-details">
              <h3>{{ getAdminCount() }}</h3>
              <p>Admins</p>
            </div>
          </div>
        </section>

        <!-- Users table -->
        <section class="users-section">
          <div class="section-header">
            <h2>All Users</h2>
            <div class="search-filters">
              <input type="text" placeholder="Search users..." class="search-input">
              <select class="filter-select">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div class="users-table">
            <div class="table-header">
              <div class="col-avatar">Avatar</div>
              <div class="col-name">Name</div>
              <div class="col-email">Email</div>
              <div class="col-role">Role</div>
              <div class="col-status">Status</div>
              <div class="col-actions">Actions</div>
            </div>

            <div *ngFor="let user of mockUsers" class="table-row">
              <div class="col-avatar">
                <div class="user-avatar">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="col-name">
                <strong>{{ user.name }}</strong>
              </div>
              <div class="col-email">
                {{ user.email }}
              </div>
              <div class="col-role">
                <span class="role-badge" [ngClass]="getRoleBadgeClass(getUserRole(user))">
                  {{ getUserRole(user) }}
                </span>
              </div>
              <div class="col-status">
                <span class="status-badge active">Active</span>
              </div>
              <div class="col-actions">
                <button *ngIf="hasPermission('edit users')" class="btn-icon" title="Edit">
                  ✏️
                </button>
                <button *ngIf="hasPermission('delete users')" class="btn-icon danger" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .users-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .page-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .header-actions .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .page-content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-details h3 {
      margin: 0;
      font-size: 1.8rem;
      color: #2c3e50;
    }

    .stat-details p {
      margin: 0;
      color: #6c757d;
    }

    .users-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .section-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .search-filters {
      display: flex;
      gap: 1rem;
    }

    .search-input, .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .users-table {
      display: grid;
      grid-template-columns: 60px 2fr 2fr 1fr 1fr 120px;
      gap: 0;
    }

    .table-header {
      display: contents;
    }

    .table-header > div {
      background: #f8f9fa;
      padding: 1rem;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    .table-row {
      display: contents;
    }

    .table-row > div {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
    }

    .table-row:hover > div {
      background: rgba(0,123,255,0.05);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .role-badge.admin {
      background: #dc3545;
      color: white;
    }

    .role-badge.moderator {
      background: #fd7e14;
      color: white;
    }

    .role-badge.user {
      background: #28a745;
      color: white;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .col-actions {
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 0.25rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-icon:hover {
      background: rgba(0,0,0,0.1);
    }

    .btn-icon.danger:hover {
      background: rgba(220, 53, 69, 0.1);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .users-table {
        display: block;
      }

      .table-header {
        display: none;
      }

      .table-row {
        display: block;
        background: white;
        margin-bottom: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 1rem;
      }

      .table-row > div {
        padding: 0.5rem 0;
        border: none;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  mockUsers: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@matrix.com',
      created_at: '2025-09-01T00:00:00Z',
      updated_at: '2025-09-30T00:00:00Z',
      roles: [{ id: 1, name: 'admin', guard_name: 'web' }]
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@matrix.com',
      created_at: '2025-09-15T00:00:00Z',
      updated_at: '2025-09-30T00:00:00Z',
      roles: [{ id: 2, name: 'user', guard_name: 'web' }]
    },
    {
      id: 3,
      name: 'John Moderator',
      email: 'mod@matrix.com',
      created_at: '2025-09-20T00:00:00Z',
      updated_at: '2025-09-30T00:00:00Z',
      roles: [{ id: 3, name: 'moderator', guard_name: 'web' }]
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // In a real app, load users from API
    // this.loadUsers();
  }

  getUserRole(user: User): string {
    return user.roles && user.roles.length > 0 ? user.roles[0].name : 'user';
  }

  getRoleBadgeClass(roleName: string): string {
    return roleName.toLowerCase();
  }

  getActiveUsers(): number {
    return this.mockUsers.length; // Mock: all users are active
  }

  getAdminCount(): number {
    return this.mockUsers.filter(user =>
      user.roles?.some(role => role.name === 'admin')
    ).length;
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
