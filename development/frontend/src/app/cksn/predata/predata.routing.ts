import { Routes } from '@angular/router';
import { PredataComponent } from './predata.component';
export const PredataRoutes:Routes  = [
    {
        path:'',
        children:[
            {
                path:'predatas',
                component:PredataComponent
            }
        ]
    }
]