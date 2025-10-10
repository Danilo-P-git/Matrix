import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTES } from './dashboard.routes';

@NgModule({
  declarations: [],
  imports: [
    DashboardComponent,
    CommonModule,
    RouterModule.forChild(DASHBOARD_ROUTES)
  ]
})
export class DashboardModule {}

