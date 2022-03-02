import { NgModule } from "@angular/core";
import { PredataService } from '../../services/predata/predata.service';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { UserHomeComponent } from "./user-home/user-home.component";
import { UserFormComponent } from './user-form/user-form.component';
import { UserRoutes } from './user.routing';
import { DateAdapter } from '@angular/material/core';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../utilities/format-datepicker';
         
@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        UserHomeComponent,
        UserFormComponent
    ],
    providers:[  {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS} ]
})
export class UserModule{}