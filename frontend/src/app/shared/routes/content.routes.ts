import { Routes } from '@angular/router';


export const Full_Content_Routes: Routes  = [
    { path:'',
        loadChildren: () => import('../../components/dashboards/dashboards.routes').then(r => r.dashboardRoutingModule)
    },

 ];
