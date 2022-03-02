import { Routes } from '@angular/router';
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
export const CustomerRoutes:Routes  = [
    {
        path:'',
        children:[
            {
                path:'customers',
                component:CustomerHomeComponent
            },
            {
                path:'customer-form',
                component:CustomerFormComponent
            }

        ]
    }
]