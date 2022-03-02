import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerModel } from 'src/app/model/customer.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { BookingModel } from '../../../model/booking.model';
import { CriterialFilter } from '../../../model/filter/criterialFilter';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { StatusCode } from '../../../utilities/StatusCode';
import { BookingService } from '../../../services/booking/booking.service';
import { MessageBusService, Messages, Channel } from '../../../services/notification/notification.service';
import { Criterial } from '../../../services/predata/criterial';
import { PredataService } from '../../../services/predata/predata.service';
import { UserModel } from '../../../model/user.model';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { BaseComponent } from '../../baseComponent';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { PreData } from '../../../model/pre.data';
import { filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { info } from 'console';

// ===== [ CHANGE ] ===== //
import * as XLSX from 'xlsx';
import { BusinessPartnerModel } from 'src/app/model/businesspartner.model';
import { BusinessPartnerService } from 'src/app/services/business/business-partner.service';
import { UserService } from 'src/app/services/user/user.service';


// export class FilterReportModel {
//   customerID: number
//   fromDate: Date
//   toDate: Date
//   selectionDate: String
//   bizPartnerID: number
//   userOperationID: number
//   bookingStatusID: number
// }



@Component({
  selector: 'app-booking-home',
  templateUrl: './booking-home.component.html',
  styleUrls: ['./booking-home.component.scss']
})
export class BookingsComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ["CKSNFile", 'Client', 'MBL', "Commodity", "ETD_POL", "ETAPOD", "Operation", "action"];
  bookingList: BookingModel[] = []
  public dataSourceBooking: MatTableDataSource<BookingModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblBooking', { static: false }) tblBooking: MatTable<any>
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // ===== [] ===== //
  filterForm = new FormGroup({});
  // filterReportMode = new FilterReportModel()


  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  pageEvent: PageEvent;
  filter: CriterialFilter
  criterial = ''
  invisbleLoading = true;
  dem_due_warning_day: number
  det_due_warning_day: number
  bookingStatuses: PreData[] = []
  bookingStatusIDSelected: any


  constructor(
    private datePip: DateFormatPipe,
    private predataService: PredataService,
    public router: Router,
    private bookingService: BookingService,
    private matSnackbar: MatSnackBar,
    private dialog: MatDialog,
    private readonly messageBus: MessageBusService) {
    super(router);
  }

  ngOnInit() {
    this.init();
  }
  ngAfterViewInit(): void {
    this.initNotification()
    this.dataSourceBooking.sort = this.sort
  }

  ngOnDestroy(): void { }

  init() {
    if (this.session.getLoginSession()) {
      let user = this.session.getLoginSession() as UserModel
      this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.bookingsPageID)[0]
      if (this.permission && this.permission.isView == true) {
        this.getBookingStatuses();
        this.loadPredata();
        this.initFilter()
        this.setUpPagin()
      }
      else {
        ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
      }
    }
  }

  initFilter() {
    this.filter = new CriterialFilter()
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 48)
    this.filter.fromDate = this.datePip.formatdate(fromDate, "yyyy-MM-dd")
    let toDate = new Date()
    toDate.setDate(toDate.getDate() + 1)
    this.filter.toDate = this.datePip.formatdate(toDate, "yyyy-MM-dd")
    this.filter.bookingStatusID = Criterial.booking_status_new
    this.filter.userID = parseInt(this.session.getUID());
    this.filter.pageIndex = 0
    this.filter.pageSize = 50
    this.filter.isViewAll = this.permission.isViewAll
    this.getListBookings(this.filter)
  }

  setUpPagin() {
    this.filter.isViewAll = this.permission.isViewAll
    this.bookingService.getCountBookings(this.filter).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.pageLength = res.body[0]
      }
    })
  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize) //((event.pageIndex) * event.pageSize )
    this.filter.pageIndex = pageIndex
    this.filter.pageSize = event.pageSize
    this.filter.userID = parseInt(this.session.getUID());
    this.filter.isViewAll = this.permission.isViewAll
    this.getListBookings(this.filter)
  }

  getListBookings(datafilter: CriterialFilter) {
    datafilter.fromDate = this.datePip.formatdate(datafilter.fromDate, "yyyy-MM-dd")
    datafilter.toDate = this.datePip.formatdate(datafilter.toDate, "yyyy-MM-dd")
    if (datafilter.fromDate && datafilter.toDate) {
      this.invisbleLoading = false
      this.bookingService.getListBookings(datafilter)
        .subscribe(res => {
          this.dataSourceBooking.data = []
          this.tblBooking.renderRows()
          if (res.status == StatusCode.success && res.body.length > 0) {
            let books: BookingModel[] = res.body
            books.forEach(ele => {
              ele.clientName = ele.customer.name
            })
            this.dataSourceBooking.data = res.body

          }
          this.invisbleLoading = true
        })
    }
  }

  onClick_new() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./booking-form"], navigationExtra)
  }

  onClick_edit(element) {
    let isEdit = "1"
    let ID = element.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./booking-form"], navigationExtra)
  }

  onClick_remove(element) {
    let askForConfirmationDialogComponent = AskForConfirmationDialogComponent
    const dialogRef = this.dialog.open(askForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure ?", title: "Remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.bookingService.removeBooking(element.ID).subscribe(res => {
          if (res.status == StatusCode.success) {

            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
            this.dataSourceBooking.data.splice(this.dataSourceBooking.data.indexOf(element), 1)
            this.dataSourceBooking.sort = this.sort
            this.tblBooking.renderRows()
          }
          else {
            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
          }
        })
      }
    });
  }

  // =====[ ON FILTER ]===== //
  onFilter() {
    if (this.filter) {
      let user = this.session.getLoginSession() as UserModel
      this.filter.userID = parseInt(this.session.getUID());
      this.filter.groupID = user.group.ID
      this.filter.isViewAll = this.permission.isViewAll
      this.setUpPagin()
      this.getListBookings(this.filter)
    }
  }

  // =====[ FILTER ]===== //
  applyFilter(value) {
    this.dataSourceBooking.filter = value
  }

  // =====[ CANCEL FILTER ]===== //
  onCancleFilter() {
    let inFilter = '';
    this.applyFilter(inFilter)
  }

  onTable_filter(value) {
    this.dataSourceBooking.filter = value
    this.dataSourceBooking.sort = this.sort
    this.tblBooking.renderRows();
  }


  // ============================================================================

  initNotification() {
    let cirterial = new CriterialFilter()
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 30)

    cirterial.fromDate = this.datePip.formatdate(fromDate, "yyyy-MM-dd")
    cirterial.isViewAll = this.permission.isViewAll

    let toDate = new Date()
    toDate.setDate(toDate.getDate() + 1)
    cirterial.toDate = this.datePip.formatdate(toDate, "yyyy-MM-dd")
    cirterial.bookingStatusID = 36
    cirterial.userID = parseInt(this.session.getUID())

    // call web service
    this.bookingService.getListBookings(cirterial)
      .subscribe(res => {
        if (res.status == StatusCode.success && res.body.length > 0) {
          let messages: Messages[] = [];
          let data = res.body.filter(filter => filter.dem != undefined || filter.det != undefined)
          data.forEach(res => {
            let currentDate = new Date()
            let detDue = new Date(res.detDue)
            let demDue = new Date(res.demDue)
            let detFreeLeft = this.datePip.dateDiff(currentDate, detDue)
            let demFreeLeft = this.datePip.dateDiff(currentDate, demDue)

            if ((this.det_due_warning_day >= detFreeLeft) || (currentDate > detDue)) {
              let message = new Messages();
              let msg = "The Detention is nearly over due " + res.CKSNFile;
              message.title = msg;
              messages.push(message)
            }
            if ((this.dem_due_warning_day >= demFreeLeft) || (currentDate > demDue)) {
              let message = new Messages();
              let msg = "The Demurrage is nearly over due " + res.CKSNFile;
              message.title = msg;
              messages.push(message)
            }
          })
          this.messageBus.sendMessage(messages)
        }
      });
  }

  loadPredata() {
    this.predataService.getPreDefinedsByCriterial(Criterial.dem_due_warning).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.dem_due_warning_day = parseInt(res.body[0].value)
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.det_due_warning).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.det_due_warning_day = parseInt(res.body[0].value)
      }
    })
  }

  onClick_OpenBooking(element: BookingModel) {
    let isEdit = "1"
    let ID = element.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./booking-form"], navigationExtra)
  }

  // ==========|CLEARE VALUE SEARCH AND GET AGAIN|========== //
  onClick_RemoveSearch() {
    let value = '';
    this.applyFilter(value);
  }

  getBookingStatuses() {
    this.predataService.getPreDefinedsByCriterial(Criterial.booking_status).subscribe(res => {
      console.log(res)
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.bookingStatuses = res.body
        let pre = new PreData()
        pre.ID = Criterial.allValue
        pre.value = Criterial.all
        this.bookingStatuses.unshift(pre)
      }
    })
  }
}