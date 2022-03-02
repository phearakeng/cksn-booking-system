import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BookingRoutes } from './booking.routing';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingsComponent } from './booking-home/booking-home.component';
import { MaterialModule } from '../../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { UserService } from '../../services/user/user.service';
import { DateFormatPipe } from '../../utilities/DateFormatPipe';
import { FilterDialogComponent } from './booking-home/filter-dialog/filter-dialog.component';
import { NgxPicaModule } from 'ngx-pica';
import { ContainerComponent } from './containers/container.component';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../utilities/format-datepicker';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateTimePickerComponent } from '../date-time-picker/date-time-picker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule
import { faCalendar,  faClock } from '@fortawesome/free-regular-svg-icons';
import { DateTimeAdapter, OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { NumberDirective } from '../../utilities/NumberDirective';
import { DateFilterPipe } from '../../utilities/DateFilterPipe';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomerComponent } from '../customer/customer-component/customer.tag';
import { ContainerTag } from './booking-form/container-tag/container.tag';
import { CellCursorDirective } from './booking-form/container-tag/cellCursor';
import { FleetImportModalComponent } from './containers/fleet-import-modal/fleet-import-modal.component';
import { NgEventBus } from 'ng-event-bus';
export const MY_NATIVE_FORMATS = {
    fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
    datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
    timePickerInput: {hour: 'numeric', minute: 'numeric'},
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
};
    
    
fontLibrary.add(
    faCalendar,
    faClock
);

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(BookingRoutes),
        FormsModule,
        ReactiveFormsModule,
        NouisliderModule,
        TagInputModule,
        MaterialModule,
        FontAwesomeModule,
        NgxPicaModule,
        NgbModule,
        PdfViewerModule,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule

    ],
    declarations:[
        BookingsComponent,
        BookingFormComponent,
        ContainerComponent,
        HomeComponent,
        CustomerComponent,
        ContainerTag,
        FilterDialogComponent,
        DateTimePickerComponent,
        NumberDirective,
        CellCursorDirective,
        DateFilterPipe,
        FleetImportModalComponent
    ],
    entryComponents:[FilterDialogComponent],
    providers:[
        UserService,
        DateFormatPipe,
        DatePipe,
        NgEventBus,
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS} ,
        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
    ]
})
export class BookingModule{

}