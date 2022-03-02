import { Routes } from '@angular/router';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserFormComponent } from './user-form/user-form.component';

export const UserRoutes:Routes  = [
    {
        path:'',
        children:[
            {
                path:'users',
                component:UserHomeComponent
            },
            {
                path:'user-form',
                component:UserFormComponent
            }

        ]
    }
]