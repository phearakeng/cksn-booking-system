import { Routes } from '@angular/router';
import { BookingsComponent } from './booking-home/booking-home.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ContainerComponent } from './containers/container.component';
import { HomeComponent } from './home/home.component';
export const BookingRoutes:Routes = [
  
    {
        path : '',
        children:[
             {
                 path:'home',
                 component:HomeComponent
             }
        ]
    },
    {
       path : '',
       children:[
            {
                path:'bookings',
                component:BookingsComponent
            }
       ]
   },
   {
    path : '',
    children:[
         {
             path:'booking-form',
             component:BookingFormComponent
         }
    ]
    },
    {
        path : '',
        children:[
             {
                 path:'containers',
                 component:ContainerComponent
             }
        ]
    }
]