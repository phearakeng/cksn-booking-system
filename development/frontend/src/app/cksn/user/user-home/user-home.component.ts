import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserModel } from '../../../model/user.model';
import { UserService } from '../../../services/user/user.service';
import { StatusCode } from '../../../utilities/StatusCode';
import { SessionManagement } from '../../../utilities/session_management';
import { Permission } from '../../../model/permission.model';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { Criterial } from '../../../services/predata/criterial';
import { BaseComponent } from '../../baseComponent';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ["ID", 'Name', 'Username', "Telephone1", "Telephone2", "action"];
  userList: UserModel[] = []
  public dataSourceUser: MatTableDataSource<UserModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblUser', { static: false }) tblUser: MatTable<any>
  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''
  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(public router: Router,
    private userService: UserService,
    private matSnackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    super(router)
  }

  ngOnInit() {
    this.dataSourceUser.data = []
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.usersPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.userService.getCountUsers().subscribe(res => {
        if (res.status == StatusCode.success) {
          this.pageLength = res.body[0]
        }
      })
      this.userService.getListUsers(0, 50).subscribe(x => {
        if (x.status == StatusCode.success) {
          this.dataSourceUser.data = x.body
        }
      })
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    console.log(pageIndex + " page index and page size " + event.pageSize)
    this.userService.getListUsers(pageIndex, event.pageSize).subscribe(res => {
      if (res.status == StatusCode.success) {
        this.dataSourceUser.data = res.body
      }
    })
  }

  onClick_New() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./user-form"], navigationExtra)
  }

  onClick_edit(element: UserModel) {
    let isEdit = "1"
    let ID = element.ID
    let body = JSON.stringify({ "ID": ID, "isEdit": isEdit })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.router.navigate(["./user-form"], navigationExtra)
  }

  onClick_remove(element) {
    let askForConfirmationDialogComponent = AskForConfirmationDialogComponent
    const dialogRef = this.dialog.open(askForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are you sure ?", title: "Remove" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.userService.removeUserByID(element.ID).subscribe(res => {
          if (res.status == StatusCode.success) {
            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
            this.dataSourceUser.data.splice(this.dataSourceUser.data.indexOf(element), 1)
            this.tblUser.renderRows()
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

  applyFilter(filterValue: string) {
    this.dataSourceUser.filter = filterValue.trim().toLowerCase();
  }

  // ==========|CLEARE VALUE SEARCH AND GET AGAIN|========== //
  onClick_RemoveSearch() {
    let value = '';
    this.applyFilter(value);
  }
}