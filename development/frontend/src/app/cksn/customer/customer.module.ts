import { NgModule } from "@angular/core";
import { PredataService } from '../../services/predata/predata.service';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { CustomerRoutes } from "./customer.routing";
import { CustomerHomeComponent } from './customer-home.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(CustomerRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        CustomerHomeComponent,
        CustomerFormComponent
    ]
    // providers:[
    //     PredataService,
    //     DateFormatPipe
    // ]
})
export class CustomerModule{}