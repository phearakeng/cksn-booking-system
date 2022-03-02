import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingModel } from '../../../model/booking.model';
import { CriterialFilter } from '../../../model/filter/criterialFilter';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { Criterial } from '../../../services/predata/criterial';
import { StatusCode } from '../../../utilities/StatusCode';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { PredataService } from '../../../services/predata/predata.service';
import { Router, NavigationExtras } from '@angular/router';
import { MessageBusService, Channel } from '../../../services/notification/notification.service';
import { UserModel } from '../../../model/user.model';
import { BaseComponent } from '../../baseComponent';
import { ContainerService } from '../../../services/container/container.service';
import { PreData } from '../../../model/pre.data';
import { TruckModel } from '../../../model/truck.model';
import { Observable } from 'rxjs';
import { TruckService } from '../../../services/truck/truck.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ContainerModel } from '../../../model/container.model';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { UserService } from '../../../services/user/user.service';
import { BookingService } from '../../../services/booking/booking.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MailService } from '../../../services/mail/mail.service';
import { EmailModel } from '../../../model/email.model';
import { MultipleDelivery } from '../../../model/multipleDelivery.model';

import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CSVHelper } from '../../../utilities/csv.helper';
import { data } from 'jquery';
import { NgEventBus } from 'ng-event-bus';


declare const $: any;

export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
    isValid: {
      valid: false
    }
  };
};

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ["tbselect", "CKSNFile", 'containerNo', 'Broker', 'NotifyParty', "demDue", "detDue", "pickUpDate", "deliveryDate", "emptyReturn", "emptyNotifyAgent", "agentPickUpEmpty", 'operation', "Status", "action"];
  public dataSourceContainer: MatTableDataSource<ContainerModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblContainer', { static: true }) tblContainer: MatTable<any>
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  pageEvent: PageEvent;
  filter: CriterialFilter
  criterial = ''
  invisbleLoading = true;
  container: ContainerModel
  selectionContainer = new SelectionModel<ContainerModel>(true, []);
  containerStatuses: PreData[] = []
  containerStatusIDSelected: any
  det_due_warning_day: number
  truck: TruckModel
  truckList: TruckModel[]
  filteredTruck: Observable<TruckModel[]>
  truckFrmControl: FormControl
  deliveryDateFrmControl: FormControl
  CustomerToReceiveFrmControl: FormControl
  CustomerReceivedContactFrmControl: FormControl
  destinationFrmControl: FormControl
  containerStatusFrmControl: FormControl
  DriverPhoneContactFrmControl: FormControl
  detentionFrmControl: FormControl
  dateDetDueFrmControl: FormControl
  detFreeLeftFrmControl: FormControl
  extraFeeChargeFrmControl: FormControl
  dlvFrmControl: FormControl
  emptyNotifyAgentFrmControl: FormControl
  agentPickedEmptyFrmControl: FormControl
  emptyReturnFrmControl: FormControl
  containerFormEditor: FormGroup
  driverList: UserModel[] = []
  filteredDriver: Observable<UserModel[]>;
  driver: UserModel
  driverFrmControl: FormControl = new FormControl()

  // multi drop
  editCacheMultiDelivery: any = {};
  multiDropStatusTypeList: PreData[]

  constructor(
    private datePip: DateFormatPipe,
    private mailService: MailService,
    private predataService: PredataService,
    private truckService: TruckService,
    private userService: UserService,
    public router: Router,
    public bookingService: BookingService,
    private matSnackbar: MatSnackBar,
    private _dateFormatPipe: DateFormatPipe,
    private dialog: MatDialog,
    private containerService: ContainerService,
    private readonly messageBus: MessageBusService,
    private eventBus: NgEventBus) {
    super(router)
  }

  formGroup: FormGroup;
  dateModel: Date = new Date();
  stringDateModel: string = new Date().toString();
  assetOf: any = "CKSN"
  ngOnInit() {
    this.emailSubject = "Empty Container return"
    if (this.session.getLoginSession()) {
      this.init();
    }
    else {
      this.messageBus.getMessage().subscribe(rs => {
        if (rs[0].channel == Channel.login) {
          this.init()
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.loadAllDriver();
    this.loadTruckData();
  }

  onClick_OpenBooking(element: ContainerModel) {
    let isEdit = "1"
    let ID = element.booking.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./booking-form"], navigationExtra)
  }

  init() {

    let user = this.session.getLoginSession() as UserModel
    this.dataSourceContainer.sort = this.sort;
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.containerPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.initFilter();
      this.setUpPagin();
      this.getContainerStatuses()
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
    this.initEditForm()
    this.getPredata()
  }

  initFilter() {
    this.filter = new CriterialFilter()
    this.filter.containerStatusID = 80; // pending
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 40)
    this.filter.fromDate = this.datePip.transform(fromDate)
    // this.filter.fromDate = this._dateFormatPipe.formatdate(this.filter.fromDate,"yyyy-MM-dd")
    this.filter.fromDate = this._dateFormatPipe.formatdate(fromDate, "yyyy-MM-dd")

    let toDate = new Date()
    toDate.setDate(toDate.getDate() + 1)
    //this.filter.toDate = this.datePip.transform(toDate)
    this.filter.toDate = this._dateFormatPipe.formatdate(toDate, "yyyy-MM-dd")
    this.filter.containerStatusID = 0
    this.filter.pageIndex = 0;
    this.filter.pageSize = 50;
    this.getListContainers()

  }

  initEditForm() {
    let user = this.session.getLoginSession() as UserModel
    let groupID = user.group.ID
    this.truckFrmControl = new FormControl()
    this.deliveryDateFrmControl = new FormControl()
    this.CustomerToReceiveFrmControl = new FormControl()
    this.CustomerReceivedContactFrmControl = new FormControl()
    this.destinationFrmControl = new FormControl()
    this.containerStatusFrmControl = new FormControl()
    this.DriverPhoneContactFrmControl = new FormControl()
    this.detentionFrmControl = new FormControl()
    this.dateDetDueFrmControl = new FormControl()
    this.detFreeLeftFrmControl = new FormControl()
    this.emptyReturnFrmControl = new FormControl()
    this.emptyNotifyAgentFrmControl = new FormControl()
    this.agentPickedEmptyFrmControl = new FormControl()
    this.extraFeeChargeFrmControl = new FormControl()
    this.dlvFrmControl = new FormControl()

    this.containerFormEditor = new FormGroup({
      truck: this.truckFrmControl,
      activeEndDate: new FormControl(),
      deliveryDate: this.deliveryDateFrmControl,
      CustomerToReceive: this.CustomerToReceiveFrmControl,
      CustomerReceiveContact: this.CustomerReceivedContactFrmControl,
      destination: this.destinationFrmControl,
      containerStatus: this.containerStatusFrmControl,
      DriverPhoneContact: this.DriverPhoneContactFrmControl,
      detention: this.detentionFrmControl,
      dateDetDue: this.dateDetDueFrmControl,
      detFreeLeft: this.detFreeLeftFrmControl,
      emptyReturn: this.emptyReturnFrmControl,
      emptyNotifyAgent: this.emptyNotifyAgentFrmControl,
      agentPickUpEmpty: this.agentPickedEmptyFrmControl,
      pickUpDate: new FormControl(),
      pickUpFrom: new FormControl(),
      emptyDepo: new FormControl(),
      detDue: new FormControl(),
      dlv: this.dlvFrmControl,
      driver: this.driverFrmControl,
      extraFeeCharge: this.extraFeeChargeFrmControl

    })

    if (groupID == Criterial.group_operation) {
      this.truckFrmControl.disable()
      this.containerStatusFrmControl.disable()
      this.DriverPhoneContactFrmControl.disable()
      this.detentionFrmControl.disable()
      this.dateDetDueFrmControl.disable()
      this.detFreeLeftFrmControl.disable()
      this.emptyReturnFrmControl.disable()
      this.emptyNotifyAgentFrmControl.disable()
      this.agentPickedEmptyFrmControl.disable()
      this.extraFeeChargeFrmControl.disable()
      this.dlvFrmControl.disable()
      this.containerFormEditor.controls['emptyDepo'].disable()
      this.containerFormEditor.controls['detDue'].disable()
      this.containerFormEditor.controls['driver'].disable()
    }
    this.initModel()
  }

  initModel() {
    this.container = new ContainerModel()
    this.truck = new TruckModel()
    this.driver = new UserModel
  }

  onClick_Filter() {
    this.setUpPagin();
    this.getListContainers()
  }

  bookingFile: any
  bookingID: any
  detDue: any
  containerNo: any
  GW: any
  gwType: any
  commodity: any
  containerSize: any
  bizName: any;
  bizTel: any;
  pickupDate: any
  onClick_Edit(element: ContainerModel) {
    Object.assign(this.container, element)

    this.bookingFile = element.booking.CKSNFile
    this.bookingID = element.booking.ID
    this.detDue = element.booking.detDue
    this.containerNo = element.containerNo
    this.containerSize = element.containerSize
    this.GW = element.gw;
    this.commodity = element.booking.commodity

    this.containerService.getContainerByID(this.container.ID).subscribe(res => {
      this.containerStatusFrmControl.setValue(this.container.containerStatus.ID)
      if (res.status == StatusCode.success && res.body.length > 0) {

        this.container = res.body[0]
        this.container.pickUpFrom = this.container.booking.border != null ? this.container.booking.border.value : ""
        this.container.pickUpDate = new Date(this.container.pickUpDate)
        this.container.deliveryDate = new Date(this.container.deliveryDate)
        //   this.container.deliveryDate = new Date("09-20-2019 9:30:30")
        this.gwType = this.container.gwUnitType.value
        if (this.container.truck) {
          this.truck = this.container.truck
          this.assetOf = this.truck.assetOf ? this.truck.assetOf : "CKSN";

          //  console.log(this.truck.bizPartner)
          if (this.assetOf == "BIZ") {
            this.bizName = this.truck.bizPartner != null ? this.truck.bizPartner.name : ''
            this.bizTel = this.truck.bizPartner != null ? this.truck.bizPartner.telephone : ''
          }
          else {

          }
        }
        this.driver = this.container.driver ? this.container.driver : this.driverList[0]

        this.driverFrmControl.setValue(this.container.driver)
        this.truckFrmControl.setValue(this.container.truck)
      }
      //  $("#editorModal").modal('toggle');
      $('#editorModal').modal('toggle', function () {
        $(document).off('focusin.modal');
      });
    })

  }

  onClick_save() {
    this.container.containerStatus = this.containerStatuses.filter(res => res.ID == this.container.containerStatusID)[0]
    this.container.modify_by = this.session.getUID();
    this.container.modify_date = this.datePip.formatdate(new Date(), "dd/MM/yyyy hh:mm");
    console.log(this.container.modify_date)
    this.containerService.saveTheContainer(this.container).subscribe(res => {
      if (res.status == StatusCode.success) {
        let datatable = this.dataSourceContainer.data.filter(res => res.ID == this.container.ID)
        datatable[0].pickUpDate = this.datePip.formatdate(this.container.pickUpDate, "dd/MM/yy")
        datatable[0].deliveryDate = this.datePip.formatdate(this.container.deliveryDate, "dd/MM/yyyy hh:mm a")
        datatable[0].emptyDepo = this.container.emptyDepo
        datatable[0].emptyNotifyAgent = this.datePip.transform(this.container.emptyNotifyAgent, "dd/MM/yyyy")
        datatable[0].emptyReturn = this.datePip.transform(this.container.emptyReturn, "dd/MM/yyyy")
        datatable[0].agentPickUpEmpty = this.datePip.formatdate(this.container.agentPickUpEmpty, "dd/MM/yyyy")
        datatable[0].containerStatus = this.containerStatuses.filter(res => res.ID == this.container.containerStatusID)[0];
        this.tblContainer.renderRows()
        let dataNotDone = this.dataSourceContainer.data.filter(res => res.booking.CKSNFile == this.bookingFile && res.containerStatus.ID != Criterial.containerStatus_DONE)
        if (dataNotDone.length == 0) {
          this.bookingService.updateBookingStatus(this.bookingID, Criterial.booking_status_done).subscribe(res => {
            if (res.status == StatusCode.success) {
              this.matSnackbar.open(res.status, res.status, {
                duration: 2000,
              });
            }
            else {
              this.matSnackbar.open("Update Booking Status", res.status, {
                duration: 2000,
              });
            }
          })
        }

        this.matSnackbar.open("Container", res.status, {
          duration: 2000,
        });
        this.initModel();
        $("#editorModal").modal('toggle');
      }
      else {
        this.matSnackbar.open(res.status, res.status, {
          duration: 2000,
        });
      }
    })
  }

  onClick_remove(element) {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure ?", title: "Remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.containerService.removeContainerByID(element.ID).subscribe(res => {
          if (res.status == StatusCode.success) {

            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
            this.dataSourceContainer.data.splice(this.dataSourceContainer.data.indexOf(element), 1)
            this.dataSourceContainer.sort = this.sort
            this.tblContainer.renderRows()
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


  onTable_filter(value) {
    this.dataSourceContainer.filter = value
    this.dataSourceContainer.sort = this.sort
    this.tblContainer.renderRows()
  }

  setUpPagin() {
    this.filter.isViewAll = this.permission.isViewAll
    this.containerService.getCountContainers(this.filter).subscribe(res => {

      if (res.status == StatusCode.success && res.body.length > 0) {
        console.log("page size");
        console.log(res.body)
        this.pageLength = res.body[0]
        //  this.getListContainers()
      }
    })
  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.filter.pageIndex = pageIndex
    this.filter.pageSize = event.pageSize
    this.getListContainers()

  }

  getListContainers() {
    if (this.filter.fromDate && this.filter.toDate) {
      this.invisbleLoading = false
      this.filter.fromDate = this._dateFormatPipe.formatdate(this.filter.fromDate, "yyyy-MM-dd")
      this.filter.toDate = this._dateFormatPipe.formatdate(this.filter.toDate, "yyyy-MM-dd")
      this.filter.isViewAll = this.permission.isViewAll
      this.containerService.getListCotainters(this.filter)
        .subscribe(res => {
          console.log(res)
          if (res.status == StatusCode.success && res.body.length > 0) {
            console.log(res.body)
            res.body.forEach(el => {
              let con = el as ContainerModel
              // con.containerNo="123456789012345"
              console.log(con.pickUpDate)
              if (con.pickUpDate != null) {
                con.pickUpDate = this.datePip.formatdate(con.pickUpDate, "dd-MM-yyyy")
              }

              if (con.booking != null) {
                con.demDue = con.booking.demDue
                con.booking.demDue = this.datePip.formatdate(con.booking.demDue, "dd-MM-yy")
              }

              if (con.emptyNotifyAgent != null) {
                con.emptyNotifyAgent = this.datePip.formatdate(con.emptyNotifyAgent, "dd-MM-yy")
              }

              if (con.emptyReturn != null) {
                con.emptyReturn = this.datePip.formatdate(con.emptyReturn, "dd-MM-yy")
              }

              if (con.agentPickUpEmpty != null) {
                con.agentPickUpEmpty = this.datePip.formatdate(con.agentPickUpEmpty, "dd-MM-yy")
              }

              if (con.deliveryDate != null) {
                con.deliveryDate = this.datePip.formatdate(con.deliveryDate, "dd-MM-yyyy hh:mm aa")
              }

              if (con.booking != null) {
                con.booking.detDue = this.datePip.formatdate(con.booking.detDue, "dd-MM-yy")
              }

              con.bookingFile = con.booking != null ? con.booking.CKSNFile : '';


              el = con
            });
            this.dataSourceContainer = new MatTableDataSource(res.body)
            // this.dataSourceContainer.data = res.body
          }
          this.invisbleLoading = true
        })
      setTimeout(() => {
        this.dataSourceContainer.sort = this.sort
        // console.log("sorted started")
      }, 3000);
    }
  }

  // ==========|CLEARE VALUE SEARCH AND GET AGAIN|========== //
  onClick_RemoveSearch() {
    this.getListContainers();
  }

  getContainerStatuses() {
    this.predataService.getPreDefinedsByCriterial(Criterial.containerStatus).subscribe(res => {

      if (res.status == StatusCode.success && res.body.length > 0) {
        this.containerStatuses = res.body
        let pre = new PreData()
        pre.ID = Criterial.allValue
        pre.value = Criterial.all
        this.containerStatuses.unshift(pre)
      }
    })
  }

  getPredata() {
    this.predataService.getPreDefinedsByCriterial(Criterial.det_due_warning).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.det_due_warning_day = parseInt(res.body[0].value)
      }
    })

    this.predataService.getPreDefinedsByCriterial(Criterial.multiDropStatus).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.multiDropStatusTypeList = res.body
      }
    })

  }


  //#endregion customter




  onDetentionChange(val) {
  }


  enableEdit: boolean = true
  onDeliveryDate_change(date) {
    try {
      this.container.deliveryDate = new Date(date)
      //  console.log(date)
      if (date) {
        if (this.container.emptyReturn) {
          let emptyDate = new Date(this.datePip.transform(this.container.emptyReturn))
          let deliveryDate = new Date(this.datePip.transform(date))
          if (deliveryDate.getTime() > emptyDate.getTime()) {
            this.enableEdit = false
            this.matSnackbar.open("Delivery Date must smaller then Empty Return", "invalid", { duration: 3000, });
          }
          else {
            this.enableEdit = true
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  onEmptyReturn_change(type, event) {
    let deliveryDate = new Date(this.datePip.transform(this.container.deliveryDate))
    if (deliveryDate) {
      if (this.container.emptyReturn.getTime() < deliveryDate.getTime()) {
        this.matSnackbar.open("Empty Return must greater then Delivery Date", "invalid", { duration: 3000, });
        this.enableEdit = false
      }
      else {
        this.enableEdit = true
      }
    }
    else {
      this.matSnackbar.open("Invalid Delivery Date", "invalid", { duration: 3000, });
      this.container.emptyReturn = null;
    }

  }

  onEmptyNotifyAgent_change(type, event) {
    if (this.container.emptyReturn) {
      let emptyReturn = new Date(this.datePip.transform(this.container.emptyReturn))
      let emptyNotifyAgent = new Date(this.datePip.transform(this.container.emptyNotifyAgent))
      if (emptyReturn.getTime() > emptyNotifyAgent.getTime()) {
        this.matSnackbar.open("Empty Notify Agent must greater then Empty Return Date", "invalid", { duration: 3000, });
        this.enableEdit = false
      }
      else {
        this.enableEdit = true
      }
    }
    else {
      this.matSnackbar.open("Invalid Empty Date", "invalid", { duration: 3000, });
      this.container.emptyReturn = null;
      this.enableEdit = false
    }
  }

  onEmptyAgentPickedUp_change(type, event) {
    if (this.container.emptyNotifyAgent) {
      let agentPickup = new Date(this.datePip.transform(this.container.agentPickUpEmpty))
      let emptyNotifyAgent = new Date(this.datePip.transform(this.container.emptyNotifyAgent))
      if (agentPickup.getTime() < emptyNotifyAgent.getTime()) {
        this.matSnackbar.open("Empty Notify Agent must smaller then Agent picked up Date", "invalid", { duration: 3000, });
        this.enableEdit = false
      }
      else {
        this.enableEdit = true
      }
    }
    else {
      this.matSnackbar.open("Invalid Empty Notify Agent Date", "invalid", { duration: 3000, });
      this.container.emptyReturn = null;
      this.enableEdit = false
    }
  }

  /**
   * load driver
   */
  loadTruckData() {

    this.truckService.getAllTruck().subscribe(res => {
      //  console.log(res)
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.truckList = res.body

        try {
          this.filteredTruck = this.truckFrmControl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value ? value.plateNo : ''),
            map(name => name ? this.onfilteredTruck(name) : this.truckList.slice())
          )
        } catch (error) {
          console.log("invalid filter truck")
        }
      }
    })
  }

  onfilteredTruck(value: String): TruckModel[] {
    // console.log(value)
    return this.truckList.filter(us => (us.plateNo + "" + us.model).toLowerCase().includes("" + value.toLowerCase()) == true)
  }

  displayFnTruck(truck: TruckModel) {
    return truck ? truck.plateNo : undefined;
  }


  onSelectionTruckChanged(event) {
    if (event.option.value) {
      this.truck = event.option.value
      this.assetOf = this.truck.assetOf
      this.container.truck = this.truck
      this.container.truckID = this.truck.ID
      if (this.assetOf == 'BIZ') {
        this.bizName = this.truck.bizPartner != null ? this.truck.bizPartner.name : ''
        this.bizTel = this.truck.bizPartner != null ? this.truck.bizPartner.telephone : ''
        this.container.driver = null;
        this.container.driverID = null;
      }

    }
  }
  //#endregion loadTruckData

  //#region load drive


  onFilterDriver(name: String): UserModel[] { return this.driverList.filter(d => (d.firstName + d.lastName).toLowerCase().includes(name.toLowerCase()) == true) }
  displayFnDriver(driver: UserModel) { return driver ? (driver.lastName + driver.firstName) : undefined }
  onSelectionDriverChanged(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      this.driver = event.option.value as UserModel
      this.container.driver = this.driver
      this.container.driverID = this.driver.ID
    }
  }


  /**
   *  load shipper , seller ,exporter , customer  
   */
  loadAllDriver() {
    this.userService.getListUserByPosition(Criterial.driver).subscribe(res => {
      // console.log(res)
      if (res.status == StatusCode.success && res.body.length > 0) {
        try {
          this.driverList = res.body
          this.filteredDriver = this.driverFrmControl.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value ? value.name : ''),
            map(name => name ? this.onFilterDriver(name) : this.driverList.slice())
          )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }



  /**
   * option : email
   */

  isAllSelected() {
    const numSelected = this.selectionContainer.selected.length;
    const numRows = this.dataSourceContainer.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionContainer.clear() :
      this.dataSourceContainer.data.forEach(row => {
        this.selectionContainer.select(row)
      });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ContainerModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionContainer.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1}`;
  }


  emailText: String
  emailTo: String
  emailSubject: String
  emptyDepo: String
  emailReferrence: any[] = [];

  onClick_OpenMailDialog() {
    this.emailReferrence = []
    if (this.selectionContainer.selected.length > 0) {
      let isEqual = true;
      // check if user select the cotainer in the file

      this.selectionContainer.selected.forEach(row => {
        if (this.selectionContainer.selected[0].booking.CKSNFile != row.booking.CKSNFile) {
          isEqual = false;
          return;
        }
      })

      if (isEqual == true) {

        let containerDescription = '';
        let nullDepo = null;
        this.emailTo = this.selectionContainer.selected[0].booking.businessPartner ? this.selectionContainer.selected[0].booking.businessPartner.email : null

        if (this.emailTo != null) {
          this.selectionContainer.selected.forEach(row => {
            if (row.emptyDepo == undefined) {
              nullDepo = "File : " + row.booking.CKSNFile + " container no : " + row.containerNo;
            }
            this.emailReferrence.push({ "containerID": row.ID })
            containerDescription = containerDescription + "\t\tContainer No: " + row.containerNo + " Container Size: " + row.containerSize + ", Empty Depo: " + row.emptyDepo + "\n"
          })

          let isNullEmptyDepo: any
          let listEmptyDepo: ContainerModel[] = this.selectionContainer.selected.filter(res => (res.emptyDepo == null || res.emptyDepo == undefined || res.emptyDepo == ''))
          let descritpionErr = '';

          listEmptyDepo.forEach(element => {
            descritpionErr = element.containerNo + "\n"
            ComponentUtilities.showNotification("Empty Depo is not defined (" + nullDepo + ") in container no " + descritpionErr, Criterial.dangerNotify)
            isNullEmptyDepo = true;
          });
          if (isNullEmptyDepo == true) {
            return;
          }

          this.emailText = "The below containers are already return back to you \n" + containerDescription

          $("#myModalEmail").modal('toggle');
        }
        else {
          this.matSnackbar.open("The agent email is not defined", "invalid", { duration: 2000, });
        }

      }
      else {
        this.matSnackbar.open("You can't select container with different file number", "invalid", { duration: 2000, });
      }
    }
    else {
      this.matSnackbar.open("Please select container", "invalid", { duration: 2000, });
    }

  }

  // onSendEmail
  onClick_SendEmail() {
    let emailModel = new EmailModel()
    try {
      emailModel.to = [this.emailTo]
      emailModel.text = [this.emailText]
      emailModel.subject = this.emailSubject
      emailModel.byUser = Number(this.session.getUID());
      emailModel.reference = JSON.stringify(this.emailReferrence);
      if (emailModel.subject == undefined) {
        this.matSnackbar.open("Subject Required", "required", { duration: 2000, });
        return;
      }
    } catch (error) {
      this.matSnackbar.open("Somthing wrong", "Failed", { duration: 2000, });
    }


    this.mailService.sendEmail(emailModel).subscribe(res => {
      if (res.status == StatusCode.success) {
        let notifyDate = new Date(res.body[0])
        this.emailReferrence.forEach(ele => {
          if (ele.containerID) {
            this.containerService.saveContainer({ "ID": ele.containerID, "emptyNotifyAgent": notifyDate }).subscribe(res => {
              //  console.log(res)
              if (res.status == StatusCode.success) {
                this.matSnackbar.open("Update container notify date  ", res.status, { duration: 2000, });
              }
              else {
                this.matSnackbar.open("Update container notify date  ", res.status, { duration: 2000, });
              }

            })
          }
          this.dataSourceContainer.data.filter(fil => fil.ID == Number(ele.containerID))[0].emptyNotifyAgent = this.datePip.transform(notifyDate)
          this.tblContainer.renderRows();
        })



        $("#myModalEmail").modal('toggle');
      }
      this.matSnackbar.open("Email sent", res.status, { duration: 2000, });
    })

  }


  /**
 * add multi deliver
 */

  multiDeliverys: MultipleDelivery[] = []
  refCon: any
  onClick_opernMultiDelivery(container: ContainerModel) {
    this.multiDeliverys = []

    this.refCon = { ID: container.ID, key: container.key }
    this.container.multiDelivery = []
    this.containerNo = container.containerNo
    $("#multiDropDialog").modal('toggle');
    if (container.ID != undefined) {
      this.containerService.getMultiDropByContainers(container.ID, '1').subscribe(res => {
        if (res.status == StatusCode.success) {
          if (res.body.length > 0) {
            // console.log(res.body)
            res.body.forEach(ele => {
              ele.key = ComponentUtilities.UUID()
              try { ele.deliveryStatus = this.multiDropStatusTypeList.filter(ite => ite.ID == ele.deliveryStatusID)[0] } catch (ex) { console.log(ex.message) }
              ele.deliveryDate = new Date(ele.deliveryDate)
              this.container.multiDelivery.push(ele)
              this.multiDeliverys.push(ele)
            })
            this.updateEditCacheMultiDelivery('')
          }

        }
        else {
          let mulTil = this.container.multiDelivery;
          if (mulTil != undefined) {
            Object.assign(this.multiDeliverys, this.container.multiDelivery)
          }
          else {
            this.container.multiDelivery = []
          }
        }

      });

    }
    else {
      //   this.booking.container[index].multiDelivery = this.multiDeliverys;
      Object.assign(this.container.multiDelivery, this.multiDeliverys)
    }
  }


  editDeliveryDate: any
  startEditMultiDelivery(key) {
    this.editCacheMultiDelivery[key].edit = true;
    this.editDeliveryDate = this.editCacheMultiDelivery[key].data.deliveryDate
    //this.editCacheMultiDelivery[key].data.deliveryDate = this._dateFormatPipe.formatdate(this.editCacheMultiDelivery[key].data.deliveryDate,"ddMM-yyyy") 
    // this.multiDeliverys[key].deliveryDate = this._dateFormatPipe.formatdate(this.editCacheMultiDelivery[key].deliveryDate,"dd-MM-yyyy")

  }

  onClick_saveEditMultiDelivery(key) {
    const index = this.multiDeliverys.findIndex(item => item.key == key);
    this.container.multiDelivery[index] = this.editCacheMultiDelivery[key].data;
    this.container.multiDelivery[index].deliveryStatus = this.multiDropStatusTypeList.filter(ele => ele.ID == this.container.multiDelivery[index].deliveryStatusID)[0]
    this.editCacheMultiDelivery[key].edit = false;
    //this.editCacheMultiDelivery[key].data.deliveryDate = this._dateFormatPipe.formatdate(this.editCacheMultiDelivery[key].data.deliveryDate,"dd-MM-yyyy") 
  }

  onClick_cancelEditMultiDelivery(key) {
    const index = this.multiDeliverys.findIndex(item => item.key == key);
    this.container.multiDelivery[index] = this.editCacheMultiDelivery[key].data;
    this.editCacheMultiDelivery[key].edit = false;
  }

  updateEditCacheMultiDelivery(mKey): void {
    this.container.multiDelivery.forEach(item => {
      if (!this.editCacheMultiDelivery[item.key]) {
        this.editCacheMultiDelivery[item.key] = {
          edit: false,
          data: item
        };
      }
    });

    //Object.assign(this.booking.container[index].multiDelivery,this.multiDeliverys)
  }

  onClick_deleteMultiDelivery(row: MultipleDelivery) {
    //let indexArray = this.booking.container.multiDelivery.indexOf(row)
    this.multiDeliverys.splice(this.multiDeliverys.indexOf(row), 1)
    this.container.multiDelivery.filter(res => {
      if (res.ID == undefined) {
        this.container.multiDelivery.splice(this.container.multiDelivery.indexOf(row), 1)
      }
      else {
        row.isActive = 0
        if (res.key == row.key) {
          res.isActive = 0
        }
        //   this.booking.container[indexCon].multiDelivery = this.booking.container[indexCon].multiDelivery.filter(rs=>rs.isActive==1)
      }
    })
  }


  onClick_savePostMultiDrop() {
    this.containerService.saveMultiDrop(this.container.multiDelivery).subscribe(res => {
      if (res.status == StatusCode.success) {
        ComponentUtilities.showNotification("Saved Multi Delivery", Criterial.primaryNotify)
      }
      else {
        ComponentUtilities.showNotification("Multi Delivery Save failed", Criterial.warningNotify)
      }
    })
  }

  openModal() {
    $("#importDropDialog").modal('toggle');
    this.eventBus.cast('app:modelopen', '1');
  }
}
