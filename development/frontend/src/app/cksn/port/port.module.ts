import { NgModule } from "@angular/core";
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { PortComponent } from './port.component';
import { PortFormComponent } from './port-form/port-form.component';
import {  MatIconModule } from "@angular/material/icon";
import { PortService } from '../../services/port/port.service';
import { PortRoutes } from "./port.routing";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(PortRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        PortComponent,
        PortFormComponent
    ],
    providers:[
        PortService,
        DateFormatPipe
    ]
})
export class PortModule{}