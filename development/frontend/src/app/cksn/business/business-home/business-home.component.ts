import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessPartnerModel } from '../../../model/businesspartner.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CriterialFilter } from '../../../model/filter/criterialFilter';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { Router, NavigationExtras } from '@angular/router';
import { BusinessPartnerService } from '../../../services/business/business-partner.service';
import { StatusCode } from '../../../utilities/StatusCode';
import { filter } from 'rxjs/operators';
import { Permission } from '../../../model/permission.model';
import { SessionManagement } from '../../../utilities/session_management';
import { Criterial } from '../../../services/predata/criterial';
import { UserModel } from '../../../model/user.model';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { BaseComponent } from '../../baseComponent';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-business-home',
  templateUrl: './business-home.component.html',
  styleUrls: ['./business-home.component.scss']
})
export class BusinessHomeComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ["NAME", 'COMPANY', 'TELEPHONE', "EMAIL", "action"];
  businessPartnerList: BusinessPartnerModel[] = []
  public dataSourceBusinessPartner: MatTableDataSource<BusinessPartnerModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblBusinessPartner', { static: false }) tblBusinessPartner: MatTable<any>

  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  // MatPaginator Output
  pageEvent: PageEvent;
  filter: CriterialFilter
  criterial = ''
  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(private dialog: MatDialog, private matSnackbar: MatSnackBar, private datePip: DateFormatPipe, public router: Router, private businessPartnerService: BusinessPartnerService) {
    super(router)
  }


  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.businessPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.initFilter()
      this.setUpPagin()
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  initFilter() {
    this.filter = new CriterialFilter()
  }

  setUpPagin() {
    this.businessPartnerService.getCountBusinessPartner().subscribe(res => {
      if (res.status == StatusCode.success && res.body.length > 0) {
        this.pageLength = res.body[0]
        this.getListBusinessPartner()
      }
    })
  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.filter.pageIndex = pageIndex
    this.filter.pageSize = event.pageSize
    this.getListBusinessPartner()

  }

  getListBusinessPartner() {
    this.businessPartnerService.getListBusinessPartner(this.filter)
      .subscribe(res => {
        console.log(res)
        this.dataSourceBusinessPartner.data = []
        this.tblBusinessPartner.renderRows()
        if (res.status == StatusCode.success && res.body.length > 0) {
          this.dataSourceBusinessPartner.data = res.body
        }

      })
  }

  onClick_new() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./business-form"], navigationExtra)
  }

  onClick_Edit(element) {
    let isEdit = "1"
    let ID = element.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./business-form"], navigationExtra)
  }

  onClick_remove(element) {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure to remove this?", title: "Remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.businessPartnerService.removeBusinessPartnerByID(element.ID).subscribe(res => {
          if (res.status == StatusCode.success) {

            ComponentUtilities.showNotification("YOU are removed, Successfully.", Criterial.dangerNotify)
            this.dataSourceBusinessPartner.data.splice(this.dataSourceBusinessPartner.data.indexOf(element), 1)
            this.tblBusinessPartner.renderRows()
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

  // =====|SEARCH|===== //
  applyFilter(value) {
    this.dataSourceBusinessPartner.filter = value
  }

  onClick_Clear_Value_Of_Search() {
    let bizPartner = '';
    this.applyFilter(bizPartner);
  }
}
