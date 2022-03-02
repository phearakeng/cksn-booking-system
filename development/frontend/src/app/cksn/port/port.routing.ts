import { Routes } from '@angular/router';
import { PortComponent } from './port.component';
import { PortFormComponent } from './port-form/port-form.component';

export const PortRoutes:Routes  = [
    {
        path:'',
        children:[
        
            {
                path:'port',
                component:PortComponent
            },
            {
                path:'port-form',
                component:PortFormComponent
            }
        ]
    }
]