import { Routes } from '@angular/router';
import { TruckComponent } from './truck/truck.component';
import { TruckFormComponent } from './truck-form/truck-form/truck-form.component';

export const TruckRoute:Routes  = [
    {
        path:'',
        children:[
            {
                path:'truck',
                component:TruckComponent
            },
            {
                path:'truck-form',
                component:TruckFormComponent
            }

        ]
    }
]