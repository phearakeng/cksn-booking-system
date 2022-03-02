import { Component, OnInit, Inject, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GroupService } from '../../../services/group/group.service';
import { GroupModel } from '../../../model/group.model';
import { DepartmentModel } from '../../../model/department.model';
import { StatusCode } from '../../../utilities/StatusCode';
import { DepartmentService } from '../../../services/department/department.service';
import { PreData } from '../../../model/pre.data';
import { Permission } from '../../../model/permission.model';
import { PredataService } from '../../../services/predata/predata.service';
import { Criterial } from '../../../services/predata/criterial';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { UserModel } from '../../../model/user.model';
import { SessionManagement } from '../../../utilities/session_management';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent extends BaseComponent implements OnInit {
  groupController = new FormControl()
  onAddGroup = new EventEmitter()
  departmentList: DepartmentModel[]
  group: GroupModel = new GroupModel();
  isEdit = "0"
  displayedColumns: string[] = ['Page', 'View', 'Add', 'Edit', 'Remove', 'ViewAll'];
  public dataSourcePermission: MatTableDataSource<Permission> = new MatTableDataSource()
  @ViewChild('tblPagePermion', { static: false }) tblPagePermion: MatTable<any>

  // session:SessionManagement = new SessionManagement()
  // permission : Permission

  constructor(
    private activateRoute: ActivatedRoute,
    private groupService: GroupService,
    //  private predata:PredataService,
    private departmentService: DepartmentService,
    private matSnackbar: MatSnackBar,
    private dialog: MatDialog,
    public route: Router
  ) {
    super(route)
  }

  ngOnInit() {

    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.groupFormPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.getListDepartments();
      this.onLoadData()
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
    this.getPageList();
  }

  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"] ? param["element"] : null)
        if (element && element.isEdit == "1") {
          this.group = element.data as GroupModel
          this.groupService.getPermissionByGroupID(this.group.ID).subscribe(res => {
            console.log(res)
            if (res.status == StatusCode.success && res.body.length > 0) {
              this.dataSourcePermission.data = res.body[0].groupPermission
            }
            this.tblPagePermion.renderRows();
            this.getPageList();
          })
        }
        else {
          this.getListDepartments();
          this.getPageList();
        }
      }
    })
  }

  onClick_Save() {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '270px',
      data: { message: "Are you sure ?", title: "Save" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.group.groupPermission = this.dataSourcePermission.data
        this.groupService.addGroup(this.group).subscribe(res => {
          if (res.status == StatusCode.success) {
            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
            this.onAddGroup.emit(res);
            this.route.navigate(["/groups"])
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

  /**
   * @method 
   */
  getListDepartments() {
    this.departmentService.getListDepartments().subscribe(res => {
      if (res.status == StatusCode.success && res.status.length > 0) {
        this.departmentList = res.body
      }
    })
  }

  /**
   * function for add new
   */
  getPageList() {
    this.groupService.getAllPages()
      .subscribe(res => {
        console.log(res)
        if (res.status == StatusCode.success && res.body.length > 0) {
          res.body.forEach(ele => {
            let p = new Permission()
            p.pageID = ele.ID
            p.page = ele
            let filter = this.dataSourcePermission.data.filter(res => res.pageID == p.pageID)
            if (filter.length == 0) {
              this.dataSourcePermission.data.push(p)
            }
          })
          this.tblPagePermion.renderRows();
        }
      })
  }
  onDepartmentSelectChanged() {}
}
