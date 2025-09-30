import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AdminComponent } from './components/admin/admin.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AppLayoutComponent } from './layout/app-layout.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { ActivityCategoriesComponent } from './components/activity-categories/activity-categories.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent,  },
      { path: 'roles', component: AdminComponent,  },
      // Placeholder routes for activities (create stub components later if needed)
      { path: 'activities', component: ActivitiesComponent,  },
      { path: 'activity-categories', component: ActivityCategoriesComponent,  },
      { path: 'admin', component: AdminComponent,  },
    ]
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];
