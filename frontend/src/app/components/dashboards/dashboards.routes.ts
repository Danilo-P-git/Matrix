import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../shared/guards/auth.guard';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkFlatpickr } from '../../@spk/spk-reusable-plugins/spk-flatpickr/spk-flatpickr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const admin: Routes = [
 {path:'dashboards', canActivate: [authGuard], children:[
  {path: 'sales', loadComponent: () => import('./sales/sales').then((m) => m.Sales),},
  {path: 'years', loadComponent: () => import('./years/years.component').then((m) => m.YearsComponent),},
  {path:'', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),}

], }
];
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NgbModule,
    RouterModule,
    SpkFlatpickr,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}
