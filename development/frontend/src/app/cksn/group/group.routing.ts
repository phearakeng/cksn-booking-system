import { Routes } from '@angular/router';
import { GroupComponent } from './group.component';
import { GroupFormComponent } from './group-form/group-form';
import { DepartmentComponent } from '../department/department.component';

export const PredataRoutes:Routes  = [
    {
        path:'',
        children:[
            {
                path:'groups',
                component:GroupComponent
            },
            {
                path:'group-form',
                component:GroupFormComponent
            }
            , 
            {
                path:'department',
                component:DepartmentComponent
            }
        ]
    }
]