import { NgModule } from "@angular/core";
import { PredataService } from '../../services/predata/predata.service';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { BusinessHomeComponent } from './business-home/business-home.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { BusinessRoutes } from "./business.routing";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(BusinessRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        BusinessHomeComponent,
        BusinessFormComponent
    ]
    // providers:[
    //     PredataService,
    //     DateFormatPipe
    // ]
})
export class BusinessModule{}