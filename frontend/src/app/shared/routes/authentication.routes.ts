import { Routes } from "@angular/router";

export const Authentication_ROUTES:Routes = [{

   path: '', children: [
      {
        path: '',
        loadChildren: () => import('../../../app/components/pages/error/error.route').then(r => r.errorRoutingModule)
      },
]
}]
