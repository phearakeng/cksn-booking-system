import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
//import { FilterDialogComponent } from './booking-home/filter-dialog/filter-dialog.component';
import { NgxPicaModule } from 'ngx-pica';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../utilities/format-datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateTimePickerComponent } from '../date-time-picker/date-time-picker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { ReportRoutes } from './report.routing';


fontLibrary.add(
    faCalendar,
    faClock
);

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReportRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule,
        FontAwesomeModule,
        NgxPicaModule,
        NgbModule,
        PdfViewerModule
    ],
    declarations: [
        BookingReportComponent
    ],
    providers: [
        DateFormatPipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class ReportingsModule {

}