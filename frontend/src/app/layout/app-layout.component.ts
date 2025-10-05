import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

interface NavItem { label: string; route: string; permission?: string; role?: string; }
interface NavGroup { label: string; open: boolean; items: NavItem[]; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="h-screen w-full grid grid-cols-[250px_1fr] grid-rows-[60px_1fr] dark bg-[#0e0e0e] text-zinc-200 md:[grid-template-areas:'header_header''sidebar_main']" [class.md:grid-cols-[220px_1fr]]="true">
      <!-- HEADER -->
      <header class="col-span-2 flex items-center justify-between px-4 border-b border-zinc-800 bg-[#141414] md:[grid-area:header]">
        <div class="flex items-center gap-3 cursor-pointer select-none" (click)="goDashboard()">
          <img class="h-10 w-auto" src="https://midichlorians.it/wp-content/uploads/2022/06/Midichlorians-Lightsaber-Academy.png" alt="Logo" />
          <span class="font-semibold tracking-widest text-sm text-amber-400">MATRIX</span>
        </div>
        <div class="flex items-center gap-4">
          <span *ngIf="userName() as name" class="text-xs text-zinc-400">{{ name }}</span>
          <button (click)="toggleSidebar()" class="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors" aria-label="Toggle sidebar">
            <span class="i-lucide-menu text-lg">≡</span>
          </button>
          <button (click)="logout()" class="hidden md:inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-medium border border-amber-400 transition-colors">Logout</button>
        </div>
      </header>

      <!-- SIDEBAR -->
      <aside class="hidden md:flex flex-col overflow-y-auto border-r border-zinc-800 bg-[#121212] p-3 gap-4 text-sm" [class.md:[grid-area:sidebar]]="true">
        <div data-kt-menu="true" class="menu menu-column w-full">
          <!-- GROUP -->
          <div class="menu-item menu-accordion" *ngFor="let group of groups(); let gi = index" [class.show]="group.open">
            <div class="menu-link cursor-pointer select-none" (click)="toggleGroup(group)" data-kt-menu-trigger="click">
              <span class="menu-title text-[11px] font-semibold tracking-wide text-zinc-400">{{ group.label }}</span>
              <span class="menu-arrow"></span>
            </div>
            <div class="menu-sub menu-sub-accordion pl-2 pt-1" *ngIf="group.open">
              <div class="menu-item" *ngFor="let item of group.items">
                <a class="menu-link rounded-md px-2 py-1.5 text-xs hover:bg-zinc-800/70 hover:text-zinc-100 transition-colors"
                   routerLink="{{item.route}}"
                   routerLinkActive="!bg-zinc-800 !text-zinc-100"
                   [class.opacity-40]="!canShow(item)"
                   (click)="onNavigate(item)">
                  <span class="menu-title">{{ item.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto pt-4 border-t border-zinc-800">
          <button (click)="logout()" class="w-full inline-flex items-center justify-center h-9 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold border border-amber-400 transition-colors md:mt-2">Logout</button>
        </div>
      </aside>

      <!-- MOBILE SIDEBAR OVERLAY -->
      <div *ngIf="mobileSidebar()" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" (click)="toggleSidebar()"></div>
      <aside *ngIf="mobileSidebar()" class="fixed z-50 top-0 left-0 h-full w-64 bg-[#121212] border-r border-zinc-800 flex flex-col p-4 gap-4 md:hidden">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold tracking-widest text-amber-400">MATRIX</span>
          <button (click)="toggleSidebar()" class="h-8 w-8 inline-flex items-center justify-center rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800">✕</button>
        </div>
        <div data-kt-menu="true" class="menu menu-column w-full">
          <div class="menu-item menu-accordion" *ngFor="let group of groups()" [class.show]="group.open">
            <div class="menu-link" (click)="toggleGroup(group)" data-kt-menu-trigger="click">
              <span class="menu-title text-[11px] font-semibold tracking-wide text-zinc-400">{{ group.label }}</span>
              <span class="menu-arrow"></span>
            </div>
            <div class="menu-sub menu-sub-accordion pl-2" *ngIf="group.open">
              <div class="menu-item" *ngFor="let item of group.items">
                <a class="menu-link rounded-md px-2 py-1.5 text-xs hover:bg-zinc-800/70 hover:text-zinc-100 transition-colors"
                   routerLink="{{item.route}}"
                   routerLinkActive="!bg-zinc-800 !text-zinc-100"
                   [class.opacity-40]="!canShow(item)"
                   (click)="onNavigate(item)">
                  <span class="menu-title">{{ item.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto pt-4 border-t border-zinc-800">
          <button (click)="logout()" class="w-full inline-flex items-center justify-center h-9 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold border border-amber-400 transition-colors">Logout</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="overflow-y-auto p-6 md:p-8 bg-[#0e0e0e]" [class.md:[grid-area:main]]="true">
        <router-outlet />
      </main>
    </div>
  `,
  styles: []
})
export class AppLayoutComponent {
  groups = signal<NavGroup[]>([
    {
      label: 'UTENTI', open: true, items: [
        { label: 'Gestione utenze', route: '/users', permission: 'view users' },
        { label: 'Gestione ruoli', route: '/users/roles', permission: 'view roles' }
      ]
    }
  ]);

  mobileSidebar = signal(false);
  userName = computed(() => this.authService.currentUser?.name || null);

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      // Auto close mobile on navigation
      if (this.mobileSidebar()) this.mobileSidebar.set(false);
    });
  }

  toggleSidebar() { this.mobileSidebar.update(v => !v); }
  toggleGroup(group: NavGroup) { group.open = !group.open; this.groups.update(g => [...g]); }
  canShow(item: NavItem): boolean {
    if (item.permission && !this.authService.hasPermission(item.permission)) return false;
    if (item.role && !this.authService.hasRole(item.role)) return false;
    return true;
  }
  onNavigate(item: NavItem) { if (!this.canShow(item)) return; }
  goDashboard() { this.router.navigate(['/dashboard']); }
  logout() { this.authService.logout().subscribe(); }
}
