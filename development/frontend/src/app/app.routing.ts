import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        //  component:HomeComponent,
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            }
            ,
            {
                path: '',
                loadChildren: () => import('./cksn/booking/booking.module').then(m => m.BookingModule) 
            },
            {
                path: '',
                loadChildren: () => import('./cksn/predata/predata.module').then(m => m.PredataModule)  
            },
            {
                path: '',
                loadChildren: () => import('./cksn/business/business.module').then(m => m.BusinessModule) 
            },
            {
                path: '',
                loadChildren: () => import( './cksn/customer/customer.module').then(m => m.CustomerModule)
            },
            {
                path: '',
                loadChildren:  () => import( './cksn/user/user.module').then(m => m.UserModule)
            },
            {
                path: '',
                loadChildren: () => import('./cksn/group/group.module').then(m => m.GroupModule)
            },
            {
                path: '',
                loadChildren: () => import('./cksn/reporting/reportings.module').then(m => m.ReportingsModule) 
            }
            , {
                path: '',
                loadChildren: () => import('./cksn/port/port.module').then(m => m.PortModule) 
            },
            {
                path: '',
                loadChildren: () => import('./cksn/truck/truck.module').then(m => m.TruckModule) 
            }
            , {
                path: 'components',
                loadChildren:  () => import('./components/components.module').then(m => m.ComponentsModule)
            }, {
                path: 'forms',
                loadChildren: () => import('./forms/forms.module').then(m => m.Forms)
            }, {
                path: 'tables',
                loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
            }, {
                path: 'maps',
                loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
            }, {
                path: 'widgets',
                loadChildren:  () => import('./widgets/widgets.module').then(m => m.WidgetsModule)
            }, {
                path: 'charts',
                loadChildren:  () => import('./charts/charts.module').then(m => m.ChartsModule)
            },  {
                path: '',
                loadChildren:  () => import('./userpage/user.module').then(m => m.UserModule)
            }, {
                path: '',
                loadChildren: () => import( './timeline/timeline.module').then(m => m.TimelineModule)
            }


        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren:  () => import('./pages/pages.module').then(m => m.PagesModule)
        }]
    }
];
