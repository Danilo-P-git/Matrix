import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
  {path:'pages',children:[
    {
      path: 'error/error404',
      loadComponent: () =>
        import('./error404/error404').then((m) => m.Error404),
    },
  ]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class errorRoutingModule {
  static routes = admin;
}
