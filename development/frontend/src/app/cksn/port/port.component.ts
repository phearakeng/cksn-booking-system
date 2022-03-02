import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PortModel } from 'src/app/model/port.model';
import { StatusCode } from '../../utilities/StatusCode';
import { Criterial } from '../../services/predata/criterial';
import { ComponentUtilities } from '../../utilities/componentUtilities';
import { SessionManagement } from '../../utilities/session_management';
import { Permission } from '../../model/permission.model';
import { PortService } from '../../services/port/port.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserModel } from '../../model/user.model';
import { BaseComponent } from '../baseComponent';
import { AskForConfirmationDialogComponent } from '../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.css']
})
export class PortComponent extends BaseComponent implements OnInit {


  displayedColumns: String[] = ["Port", "Code", "Country", "action"]
  public dataSourcePort: MatTableDataSource<PortModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblPort', { static: false }) tblPort: MatTable<any>
  port: PortModel
  pageLength = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [300, 600, 900];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''

  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(public route: Router,
    private portService: PortService,
    private dialog: MatDialog,
    private matSnackbar: MatSnackBar) {
    super(route)
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.portSummary)[0]
    if (this.permission && this.permission.isView == true) {
      this.getCountPort();
      this.getListPorts(0, 300)
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  getCountPort() {
    this.portService.getCountPorts().subscribe(
      res => {
        if (res.status == StatusCode.success) {
          this.pageLength = res.body[0]
        }
      }
    )
  }

  getListPorts(pageIndex, pageSize) {
    this.portService.
      getPortListWithSize(pageIndex, pageSize)
      .subscribe(res => {
        console.log(res)
        if (res.status == StatusCode.success && res.body.length > 0) {
          this.dataSourcePort.data = res.body
        }
      })

  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.getListPorts(pageIndex, event.pageSize)
  }

  // =====|SEARCH|===== //
  applyFilter(filterValue: string) {
    this.dataSourcePort.filter = filterValue.trim().toLowerCase();
  }

  // =====|CLEAR VALUE SEARCH|===== //
  onClick_Clear_Value_Of_Search() {
    let searchValue = '';
    this.applyFilter(searchValue);
  }

  onClick_New() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/port-form"], navigationExtra)
  }

  // =====|EDIT|===== //
  onClick_edit(port: PortModel) {
    let body = JSON.stringify({ "isEdit": 1, "data": port })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/port-form"], navigationExtra)
  }

  // =====|REMOVE|===== //
  onClick_remove(element: PortModel) {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are YOU sure to remove this ?", title: "An REMOVE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        element.isActive = 0

        this.portService.addPort(element).subscribe(res => {

          if (res.status == StatusCode.success) {
            this.dataSourcePort.data.splice(this.dataSourcePort.data.indexOf(element), 1)
            this.tblPort.renderRows();
            ComponentUtilities.showNotification("YOU are removed, Successfully", Criterial.dangerNotify)

            this.router.navigate(["/port"])
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



}
