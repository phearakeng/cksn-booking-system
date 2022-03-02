import { NgModule } from "@angular/core";
import { PredataRoutes } from "./predata.routing";
import { PredataComponent } from "./predata.component";
import { PredataService } from '../../services/predata/predata.service';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { AddPredataDialogComponent } from './add-predata-dialog/add-predata-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../../app.module';
import { PortComponent } from '../port/port.component';
import { PortFormComponent } from '../port/port-form/port-form.component';
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(PredataRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        MatMenuModule,
        TagInputModule,
        MaterialModule
    ],
    declarations:[
        PredataComponent,
        AddPredataDialogComponent
    ],
    providers:[
        PredataService,
        DateFormatPipe
    ],
    entryComponents:[
        AddPredataDialogComponent
    ]
})
export class PredataModule{}