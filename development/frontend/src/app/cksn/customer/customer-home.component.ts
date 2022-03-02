import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerModel } from '../../model/customer.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';
import { CustomerService } from '../../services/customer/customer.service';
import { StatusCode } from '../../utilities/StatusCode';
import { UserModel } from '../../model/user.model';
import { Criterial } from '../../services/predata/criterial';
import { ComponentUtilities } from '../../utilities/componentUtilities';
import { BaseComponent } from '../baseComponent';
import { AskForConfirmationDialogComponent } from '../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss']
})
export class CustomerHomeComponent extends BaseComponent implements OnInit {


  displayedColumns: string[] = ["Customer", 'Phone1', 'Phone2', "Email", "Address", "action"];
  bookingList: CustomerModel[] = []
  public dataSourceCustomer: MatTableDataSource<CustomerModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblCustomer', { static: false }) tblBooking: MatTable<any>
  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''
  // session:SessionManagement = new SessionManagement()
  // permission : Permission

  constructor(public router: Router, private customerService: CustomerService, private matSnackbar: MatSnackBar, private dialog: MatDialog) {
    super(router)
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.customersPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.setUpPagin();
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  setUpPagin() {
    this.customerService.getCountCustomers().subscribe(res => {
      if (res.status == StatusCode.success) {
        this.pageLength = res.body[0]
        this.getListCustomers(0, 50)
      }
    })

  }

  // ===============|GET ALL CUSTOMER|=============== //
  getListCustomers(pageIndex, pageSize) {
    this.customerService.getListCustomers(pageIndex, pageSize).subscribe(res => {
      this.dataSourceCustomer.data = res.status == StatusCode.success ? res.body : null;
    })
  }

  // ===============|PAGINATOR|=============== //
  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.getListCustomers(pageIndex, event.pageSize)
  }

  // ===============|CREATE NEW CUSTOMER|=============== //
  onClick_New() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["/customer-form"], navigationExtra)
  }

  // ===============|EDIT CUSTOMER|=============== //
  onClick_edit(element) {
    let isEdit = "1"
    let ID = element.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./customer-form"], navigationExtra)
  }


  // ===============|FILTER CUSTOMER|=============== //
  applyFilter(value) {
    this.dataSourceCustomer.filter = value
  }

  // ==========|CLEARE VALUE SEARCH AND GET AGAIN|========== //
  onClick_RemoveSearch() {
    let value = '';
    this.applyFilter(value);
  }


  // ===============|REMOVE CUSTOMER|=============== //
  onClick_remove(element) {
    let askForConfirmationDialogComponent = AskForConfirmationDialogComponent
    const dialogRef = this.dialog.open(askForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure to remove this?", title: "Remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.customerService.removeCustomer(element.ID).subscribe(res => {
          if (res.status == StatusCode.success) {

            // this.matSnackbar.open(res.body[0].toString(), res.status, {
            //   duration: 2000,
            // });
            ComponentUtilities.showNotification("You are removed!! Successfully", Criterial.dangerNotify)

            this.dataSourceCustomer.data.splice(this.dataSourceCustomer.data.indexOf(element), 1)
            this.tblBooking.renderRows()
          }
          else {
            // this.matSnackbar.open(res.body[0].toString(), res.status, {
            //   duration: 2000,
            // });
            ComponentUtilities.showNotification("Something rong!!", Criterial.dangerNotify)
          }

        })
      }
    });
  }
}
