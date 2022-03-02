import { Routes } from '@angular/router';
import { BusinessHomeComponent } from './business-home/business-home.component';
import { BusinessFormComponent } from './business-form/business-form.component';

export const BusinessRoutes:Routes  = [
    {
        path:'',
        children:[
            {
                path:'business',
                component:BusinessHomeComponent
            },
            {
                path:'business-form',
                component:BusinessFormComponent
            }

        ]
    }
]