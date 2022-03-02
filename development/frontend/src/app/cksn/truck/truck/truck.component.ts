import { Component, OnInit, ViewChild } from '@angular/core';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { TruckModel } from '../../../model/truck.model';
import { StatusCode } from '../../../utilities/StatusCode';
import { NavigationExtras, Router } from '@angular/router';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { Criterial } from '../../../services/predata/criterial';
import { UserModel } from '../../../model/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PortService } from '../../../services/port/port.service';
import { Permission } from '../../../model/permission.model';
import { SessionManagement } from '../../../utilities/session_management';
import { BaseComponent } from '../../baseComponent';
import { TruckService } from '../../../services/truck/truck.service';

@Component({
  selector: 'app-truck',
  templateUrl: './truck.component.html',
  styleUrls: ['./truck.component.css']
})
export class TruckComponent extends BaseComponent implements OnInit {

  displayedColumns: String[] = ["Model", 'AssetOf', 'Name', "Weight", "PlateNo", "action"]
  public dataSourceTruck: MatTableDataSource<TruckModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblTruck', { static: false }) tblTruck: MatTable<any>
  truck: TruckModel
  pageLength = 0;
  pageSize = 0;
  pageSizeOptions: number[] = [300, 600, 900];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''

  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(public route: Router,
    private truckService: TruckService,
    private dialog: MatDialog,
    private matSnackbar: MatSnackBar) {
    super(route)
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.truckSummary)[0]
    if (this.permission && this.permission.isView == true) {
      this.getCountPort();
      this.getListPorts(0, 300)
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  getCountPort() {
    this.truckService.getCountTrucks().subscribe(
      res => {
        if (res.status == StatusCode.success) {
          this.pageLength = res.body[0]
        }
      }
    )
  }

  getListPorts(pageIndex, pageSize) {
    this.truckService.
      getAllTrucks(pageSize, pageIndex)
      .subscribe(res => {
        console.log(res.body)
        if (res.status == StatusCode.success && res.body.length > 0) {
          this.dataSourceTruck.data = res.body
        }
      })
  }
  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.getListPorts(pageIndex, event.pageSize)
  }

  // =====|SEARCH|===== //
  applyFilter(filterValue: string) {
    this.dataSourceTruck.filter = filterValue.trim().toLowerCase();
  }

  // =====|CLEAR VALUE SEARCH|===== //
  onClick_Clear_Value_Search() {
    let valueSearch = '';
    this.applyFilter(valueSearch);
  }
  onClick_New() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/truck-form"], navigationExtra)
  }
  onClick_edit(truck: TruckModel) {
    let body = JSON.stringify({ "isEdit": 1, "data": truck })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/truck-form"], navigationExtra)
  }
  onClick_remove(element: TruckModel) {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure to REMOVE ?", title: "An REMOVE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        element.status = 0
        this.truckService.saveTruck(element).subscribe(res => {
          if (res.status == StatusCode.success) {
            this.dataSourceTruck.data.splice(this.dataSourceTruck.data.indexOf(element), 1)
            this.tblTruck.renderRows();

            ComponentUtilities.showNotification("YOU are REMOVED, Successfully", Criterial.dangerNotify)

            this.router.navigate(["/truck"])
          }
          else {
            ComponentUtilities.showNotification("Something Wrong!!", Criterial.warningNotify)
          }
        })
      }
    });
  }
}
