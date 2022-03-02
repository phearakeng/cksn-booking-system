import { NgModule } from "@angular/core";
import { PredataRoutes } from "./group.routing";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { GroupComponent } from './group.component';
import { GroupFormComponent } from "./group-form/group-form";
import { DepartmentComponent } from "../department/department.component";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(PredataRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        GroupComponent,
        GroupFormComponent,
        DepartmentComponent
    ]
})
export class GroupModule{}