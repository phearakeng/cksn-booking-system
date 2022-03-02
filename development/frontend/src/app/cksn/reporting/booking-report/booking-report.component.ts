import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2, ViewEncapsulation } from '@angular/core';
import { CustomerModel } from 'src/app/model/customer.model';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StatusCode } from 'src/app/utilities/StatusCode';
import { Criterial } from 'src/app/services/predata/criterial';
import { map, startWith } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BusinessPartnerModel } from 'src/app/model/businesspartner.model';
import { BusinessPartnerService } from 'src/app/services/business/business-partner.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserModel } from 'src/app/model/user.model';
import { PreData } from 'src/app/model/pre.data';
import { PredataService } from 'src/app/services/predata/predata.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { DateFormatPipe } from 'src/app/utilities/DateFormatPipe';
import * as XLSX from 'xlsx';
import { ReportService } from '../../../services/report-service.service';

export class FilterReportModel {
  customerID: number
  fromDate: Date
  toDate: Date
  selectionDate: String
  bizPartnerID: number
  userOperationID: number
  bookingStatusID: number
}


export interface DateFilter {
  val: String
  label: String
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit, AfterViewInit {
  public stage = 1;
  displayedEmptyReportColumns: string[] = ['cksnfile', 'name', 'containerNo', 'broker'];
  dateFilter: DateFilter[] = [{ label: "Create date", val: "create_date" },
  { label: "Pickup Date", val: "pick_date" },
  { label: "ETA Border", val: "eta_border" },
  { label: "Clearance Date", val: "clearance" }
  ]

  reportType: any = 'Booking_Report';
  invisbleLoading = true;
  customersList: CustomerModel[]
  filteredCustomer: Observable<CustomerModel[]>
  customer: CustomerModel

  businessPartnerList: BusinessPartnerModel[]
  filteredbusinessPartner: Observable<BusinessPartnerModel[]>

  userOperationList: UserModel[]
  filteredUserOperation: Observable<UserModel[]>

  bookingStatusList: PreData[] = []

  reportingDatas: any[]
  reportingEmptyDatas: any[]
  reportingConsoleDatas: any[]

  @ViewChild('consoleReport', { static: true }) consoleReport: ElementRef;
  @ViewChild('bookingReport', { static: true }) bookingReport: ElementRef;
  @ViewChild('emptyReport', { static: true }) emptyReport: ElementRef;



  filterForm = new FormGroup({
    customer: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    bizPartner: new FormControl(),
    userOperation: new FormControl(),
    bookingStatus: new FormControl(),
    selectionDate: new FormControl()
  });

  filterReportMode = new FilterReportModel()

  constructor(private customerService: CustomerService,
    private buesinessPartnerService: BusinessPartnerService,
    private userService: UserService,
    private predataService: PredataService,
    private bookingService: BookingService,
    private reportService: ReportService,
    private _dateFormatPipe: DateFormatPipe,
    private render: Renderer2
  ) { }

  ngOnInit() {
    this.loadListCustomers(Criterial.type_of_customer);
    this.loadBusinessPartners()
    this.loadOperationUser()
    this.getBookingStatusList()


  }

  ngAfterViewInit(): void {
    let fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 1)
    this.filterForm.get("fromDate").setValue(fromDate)
    this.filterForm.get("toDate").setValue(new Date().toISOString())
    this.filterForm.get("selectionDate").setValue(this.dateFilter[0].val)
  }


  onClick_filter() {
    this.invisbleLoading = false;
    this.filterReportMode.fromDate = this._dateFormatPipe.transform(this.filterForm.get("fromDate").value)
    this.filterReportMode.toDate = this._dateFormatPipe.transform(this.filterForm.get("toDate").value);
    this.filterReportMode.bookingStatusID = this.filterForm.get("bookingStatus").value;

    let bizMode = this.filterForm.get("bizPartner").value as BusinessPartnerModel
    this.filterReportMode.bizPartnerID = bizMode.ID;

    let usOp = this.filterForm.get("userOperation").value as UserModel
    this.filterReportMode.userOperationID = usOp.ID

    let cus = this.filterForm.get("customer").value as CustomerModel
    this.filterReportMode.customerID = cus.ID

    let bStID = this.filterForm.get("bookingStatus").value
    this.filterReportMode.bookingStatusID = bStID

    let selectionDate = this.filterForm.get("selectionDate").value;
    this.filterReportMode.selectionDate = selectionDate;

    console.log(this.reportType)
    if (this.reportType == 'Booking_Report') {
      this.bookingService.getBookingsReport(this.filterReportMode).subscribe(res => {
        console.log(res)
        this.reportingDatas = res.body
        this.invisbleLoading = true
        this.buildHtmlTable(this.bookingReport, res.body)
        // console.log(this.bookingReport.nativeElement.tBodies)
      })
    }
    else if (this.reportType == 'Empty_Return_Report') {
      this.reportService.getEmptyReport(this.filterReportMode).subscribe(res => {
        this.reportingEmptyDatas = res.body
        this.buildHtmlTable(this.emptyReport, res.body)
        this.invisbleLoading = true
      })
    }
    else if (this.reportType == 'Console_Report') {
      this.reportService.getConsoleReport(this.filterReportMode).subscribe(res => {
        this.reportingConsoleDatas = res.body
        console.log(res.body)
        this.buildHtmlTable(this.consoleReport, this.reportingConsoleDatas)
        this.invisbleLoading = true
      })
    }

  }

  reportSelection($event) {
    this.reportType = $event
  }


  onClick_export() {
    let data: any
    let fileNameReport = "";

    if (this.reportType == 'Booking_Report') {
      fileNameReport = "Booking_Report";
      data = this.reportingDatas
    }
    else if (this.reportType == 'Empty_Return_Report') {
      data = this.reportingEmptyDatas
      fileNameReport = "Empty_Return_Report";
    }
    else if (this.reportType == 'Console_Report') {
      data = this.reportingConsoleDatas
      fileNameReport = "Console_Report"
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let fileName = fileNameReport + this._dateFormatPipe.transform(new Date())
    XLSX.writeFile(wb, fileName + '.xlsx');
  }


  //#region customer
  /**
   *  Customer Control
   * 
   */
  displayCustomer(customer: CustomerModel) {
    return customer ? (customer.name) : undefined
  }
  onSelectionCustomerChanged(event: MatAutocompleteSelectedEvent) {
    if (event.option.value) {
      let cust = event.option.value as CustomerModel
      this.filterReportMode.customerID = cust.ID
    }
  }
  onfilteredCustomers(name: String): CustomerModel[] { return this.customersList.filter(cust => (cust.name).toLowerCase().includes(name.toLowerCase()) == true) }


  /**
   *  load shipper , seller ,exporter , customer  
   */
  loadListCustomers(customerType) {
    this.customerService.getCustomerByType(customerType).subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        if (customerType == Criterial.type_of_customer) {
          try {
            this.customersList = res.body
            let pre = new CustomerModel()
            pre.ID = Criterial.allValue
            pre.name = Criterial.all
            this.customersList.unshift(pre)
            this.filteredCustomer = this.filterForm.get("customer").valueChanges.pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value ? value.name : ''),
              map(name => name ? this.onfilteredCustomers(name) : this.customersList.slice())
            )
            this.filterForm.get("customer").setValue(this.customersList[0])
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  }
  //#endregion customter


  //#region loadBusiness
  /**
   * @ load Agent 
   */
  loadBusinessPartners() {
    this.buesinessPartnerService.getAllBusinessPartners().subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.businessPartnerList = res.body
        let pre = new BusinessPartnerModel()
        pre.ID = Criterial.allValue
        pre.name = Criterial.all
        pre.company = Criterial.all
        this.businessPartnerList.unshift(pre)
        this.filteredbusinessPartner = this.filterForm.get("bizPartner").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredBusinessPartner(name) : this.businessPartnerList.slice())
        )

        this.filterForm.get("bizPartner").setValue(this.businessPartnerList[0])

      }
    })
  }

  onfilteredBusinessPartner(val: string): BusinessPartnerModel[] {
    return this.businessPartnerList.filter(biz => biz.name.toLowerCase().includes(val.toLowerCase()))
  }

  displayFnBizPartner(business: BusinessPartnerModel) {
    if (business) {
      if (business.ID == Criterial.allValue) {
        return business.name + ' - Companys ALL ';
      }
      else {
        return business.name + ' - Companys ' + business.company
      }
    }
    else {
      return undefined
    }

  }
  onSelectionBizPartnerChanged(event) {
    if (event.option.value) {
      let biz = event.option.value
      this.filterReportMode.bizPartnerID = biz.ID
      //  this.filterForm.get("bizPartner").setValue(biz.ID)
    }
  }
  //#endregion loadBusiness


  /**
   * @UserList 
   * @param val 
   */
  //#region  operation
  onfilteredUserOperation(val: string): UserModel[] {
    return this.userOperationList.filter(us => (us.firstName.toLowerCase() + "" + us.lastName.toLowerCase()).includes(val.toLowerCase()))

  }

  displayFNUserOperation(us: UserModel) {
    if (us == undefined || us.firstName == Criterial.all) {
      return Criterial.all
    }
    else {
      return us ? us.lastName + ' ' + us.firstName : undefined
    }

  }
  onSelectionUserOperationChanged(event) {
    if (event.option.value) {
      let us = event.option.value
      this.filterReportMode.userOperationID = us.ID
      //   this.filterForm.get("userOperation").setValue(us.ID)
    }
  }

  loadOperationUser() {
    this.userService.getListUserOperation().subscribe(res => {
      if (res.status == StatusCode.success) {
        this.userOperationList = res.body
        let pre = new UserModel()
        pre.ID = Criterial.allValue
        pre.firstName = Criterial.all
        this.userOperationList.unshift(pre)
        this.filteredUserOperation = this.filterForm.get("userOperation").valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value ? value.name : ''),
          map(name => name ? this.onfilteredUserOperation(name) : this.userOperationList.slice())
        )
        this.filterForm.get("userOperation").setValue(this.userOperationList[0])

      }
    })
  }

  //#endregion


  getBookingStatusList() {
    this.predataService.getPreDefinedsByCriterial(Criterial.booking_status).subscribe(res => {

      if (res.status == StatusCode.success && res.body.length > 0) {
        this.bookingStatusList = res.body
        let pre = new PreData()
        pre.ID = Criterial.allValue
        pre.value = Criterial.all
        this.bookingStatusList.unshift(pre)
        this.filterForm.get("bookingStatus").setValue(this.bookingStatusList[0].ID)
      }
    })
  }



  buildHtmlTable(selector: ElementRef, data) {
    var columns = this.addAllColumnHeaders(selector, data);
    try {
      var tbl = document.getElementById(selector.nativeElement.id)
      tbl.removeChild(tbl.getElementsByTagName("tbody")[0]);
    } catch (error) {
      console.log(error)
    }

    var tbody = document.createElement("tbody")

    for (var i = 0; i < data.length; i++) {
      let row = document.createElement("tr");
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var col = columns[colIndex];
        var cellValue = data[i][col];
        if (cellValue == null) {
          cellValue = '';
        }
        let td = document.createElement("td")
        td.className = "colwidth"
        let text = document.createTextNode(cellValue)
        td.appendChild(text)
        row.appendChild(td)

      }
      tbody.appendChild(row)
    }
    this.render.appendChild(selector.nativeElement, tbody);
  }
  //   // Adds a header row to the table and returns the set of columns.
  //   // Need to do union of keys from all records as some records may not contain
  //   // all records.
  addAllColumnHeaders(selector: ElementRef, myList) {
    var columnSet = [];
    var newhThead = document.createElement("thead")
    var headerTr = document.createElement("tr");
    newhThead.className = "thead-dark"

    for (var i = 0; i < myList.length; i++) {
      var rowHash = myList[i];
      for (var key in rowHash) {
        if (columnSet.indexOf(key) == -1) {
          columnSet.push(key);
          let th = document.createElement("th")
          let text = document.createTextNode(key)
          th.appendChild(text)
          headerTr.append(th)
        }
      }
    }
    newhThead.appendChild(headerTr)
    if (selector.nativeElement.tHead != null) {
      this.render.removeChild(selector.nativeElement, selector.nativeElement.tHead)
    }
    this.render.appendChild(selector.nativeElement, newhThead);

    return columnSet;
  }
}