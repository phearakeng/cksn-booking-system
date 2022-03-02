import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../utilities/format-datepicker';
import { TruckComponent } from './truck/truck.component';
import { TruckFormComponent } from './truck-form/truck-form/truck-form.component';
import { TruckRoute } from "./truck.route";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(TruckRoute),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        TruckComponent,
        TruckFormComponent
    ],
    providers:[  {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS} ]
})
export class TruckModule{}