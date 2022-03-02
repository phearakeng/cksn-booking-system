import { Routes } from '@angular/router';
import { BookingReportComponent } from './booking-report/booking-report.component';
export const ReportRoutes:Routes = [
  
    {
        path : '',
        children:[
             {
                 path:'booking-report',
                 component:BookingReportComponent
             }
        ]
    }
]