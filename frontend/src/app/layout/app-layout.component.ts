import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

interface NavGroup {
  label: string;
  icon?: string;
  open: boolean;
  children: { label: string; route: string; permission?: string; role?: string; }[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="layout-root">
      <header class="app-header">
        <div class="brand" (click)="goDashboard()">
          <img src="https://midichlorians.it/wp-content/uploads/2022/06/Midichlorians-Lightsaber-Academy.png" alt="Logo" class="logo" />
          <span class="title">MATRIX</span>
        </div>
        <div class="header-actions">
          <span class="user-name" *ngIf="userName() as name">{{ name }}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </header>

      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <nav>
          <div class="nav-group" *ngFor="let group of nav()">
            <button class="group-toggle" (click)="toggleGroup(group)" [class.open]="group.open">
              <span class="chevron" [class.open]="group.open">›</span>
              <span class="label">{{ group.label }}</span>
            </button>
            <div class="group-children" *ngIf="group.open">
              <a *ngFor="let child of group.children"
                 routerLink="{{child.route}}"
                 routerLinkActive="active"
                 [class.disabled]="!canShow(child)"
                 (click)="onNav(child)">
                 {{ child.label }}
              </a>
            </div>
          </div>
        </nav>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout-root { display: grid; grid-template-columns: 260px 1fr; grid-template-rows: 60px 1fr; grid-template-areas: 'header header' 'sidebar main'; height: 100vh; background: #0c0c0c; color: #e5e5e5; }
    .app-header { grid-area: header; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid #262626; background: #121212; }
    .brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .logo { height: 42px; width: auto; object-fit: contain; }
    .title { font-weight: 600; letter-spacing: 1px; font-size: 18px; }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    .user-name { font-size: 14px; color: #b5b5b5; }
    .logout-btn { background: #c49a00; color: #000; border: 1px solid #d8b63d; padding: 6px 14px; font-size: 13px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background .2s ease; }
    .logout-btn:hover { background: #e4b300; }

    .sidebar { grid-area: sidebar; border-right: 1px solid #262626; background: #141414; padding: 12px 12px 24px; overflow-y: auto; }
    nav { display: flex; flex-direction: column; gap: 10px; }
  .nav-group { padding: 4px 0 6px; border-radius: 8px; background: transparent; position: relative; }
  .nav-group + .nav-group { margin-top: 2px; }
  .nav-group::before { content: ''; position: absolute; left: 12px; right: 12px; top: 0; height: 1px; background: #1d1d1d; }
  .nav-group:first-child::before { display: none; }
  .group-toggle { all: unset; cursor: pointer; display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 14px; font-size: 13px; font-weight: 500; color: #c8c8c8; transition: background .18s ease, color .18s ease; border-radius: 6px; }
    .group-toggle:hover { background: #1c1c1c; color: #ffffff; }
    .group-toggle.open { color: #f5f5f5; }
    .chevron { display: inline-block; transform: rotate(90deg); transition: transform .25s ease; font-size: 18px; line-height: 1; }
    .chevron.open { transform: rotate(270deg); }
  .group-children { display: flex; flex-direction: column; padding: 4px 4px 8px 28px; gap: 2px; }
  .group-children a { text-decoration: none; font-size: 12.5px; padding: 6px 10px; border-radius: 5px; color: #a7a7a7; transition: background .18s ease, color .18s ease; position: relative; }
  .group-children a::before { content: ''; position: absolute; left: -14px; top: 50%; width: 8px; height: 1px; background: #262626; transform: translateY(-50%); }
    .group-children a:hover { background: #1f1f1f; color: #ffffff; }
    .group-children a.active { background: #262626; color: #ffffff; }
    .group-children a.disabled { opacity: .35; cursor: not-allowed; }

    .main-content { grid-area: main; padding: 24px 32px; overflow-y: auto; }

    /* Scrollbar subtle */
    .sidebar::-webkit-scrollbar { width: 10px; }
    .sidebar::-webkit-scrollbar-track { background: #101010; }
    .sidebar::-webkit-scrollbar-thumb { background: #262626; border-radius: 20px; border: 2px solid #101010; }
    .sidebar::-webkit-scrollbar-thumb:hover { background: #2e2e2e; }

    @media (max-width: 1100px) {
      .layout-root { grid-template-columns: 220px 1fr; }
    }
    @media (max-width: 880px) {
      .layout-root { grid-template-columns: 1fr; grid-template-rows: 60px auto auto; grid-template-areas: 'header' 'main' 'sidebar'; }
      .sidebar { order: 3; }
    }
  `]
})
export class AppLayoutComponent {
  nav = signal<NavGroup[]>([
    {
      label: 'UTENTI', open: true, children: [
        { label: 'Gestione utenze', route: '/users', permission: 'view users' },
        { label: 'Gestione ruoli', route: '/roles', permission: 'view roles' }
      ]
    },
    {
      label: 'ATTIVITA', open: true, children: [
        { label: 'Gestisci attività', route: '/activities', permission: 'manage activities' },
        { label: 'Gestisci categorie', route: '/activity-categories', permission: 'manage activity categories' }
      ]
    }
  ]);
  sidebarCollapsed = signal(false);

  userName = computed(() => this.authService.currentUser?.name || null);

  constructor(private authService: AuthService, private router: Router) {
    // Close groups or handle active route highlight if needed
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      // potential future logic
    });
  }

  toggleGroup(group: NavGroup) { group.open = !group.open; this.nav.update(v => [...v]); }

  canShow(child: NavGroup['children'][number]): boolean {
    if (child.permission && !this.authService.hasPermission(child.permission)) return false;
    if (child.role && !this.authService.hasRole(child.role)) return false;
    return true;
  }

  onNav(child: NavGroup['children'][number]) {
    if (!this.canShow(child)) return;
  }

  goDashboard() { this.router.navigate(['/dashboard']); }
  logout() { this.authService.logout().subscribe(); }
}
