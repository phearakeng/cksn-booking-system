import { Component, OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GroupModel } from '../../model/group.model';
import { GroupService } from '../../services/group/group.service';
import { StatusCode } from '../../utilities/StatusCode';
import { NavigationExtras, Router } from '@angular/router';
import { Criterial } from '../../services/predata/criterial';
import { UserModel } from '../../model/user.model';
import { ComponentUtilities } from '../../utilities/componentUtilities';
import { SessionManagement } from '../../utilities/session_management';
import { Permission } from '../../model/permission.model';
import { BaseComponent } from '../baseComponent';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent extends BaseComponent implements OnInit {

  displayedColumns: String[] = ["ID", "Group", "Status", "action"]
  public dataSourceGroup: MatTableDataSource<GroupModel> = new MatTableDataSource() // data source product to buy
  @ViewChild('tblGroup', { static: false }) tblUser: MatTable<any>
  group: GroupModel
  pageLength = 0;
  pageSize;
  pageSizeOptions: number[] = [50, 100, 300];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''

  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(public route: Router, private groupService: GroupService) {
    super(route)
  }

  ngOnInit() {
    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.groupsPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.getCountGroup();
      this.getListGroups(0, 50)
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  getCountGroup() {
    this.groupService.getCountGroups().subscribe(
      res => {
        if (res.status == StatusCode.success) {
          this.pageLength = res.body[0]
        }
      }
    )
  }

  getListGroups(pageIndex, pageSize) {
    this.groupService.
      getListGroup(pageIndex, pageSize)
      .subscribe(res => {
        if (res.status == StatusCode.success && res.body.length > 0) {
          this.dataSourceGroup.data = res.body
        }
      })

  }

  paginatorEvent(event) {
    let pageIndex = ((event.pageIndex) * event.pageSize)
    this.getListGroups(pageIndex, event.pageSize)
  }

  applyFilter(filterValue: string) {
    this.dataSourceGroup.filter = filterValue.trim().toLowerCase();
  }

  onClick_New() {
    let body = JSON.stringify({ "isEdit": 0 })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/group-form"], navigationExtra)
  }

  onClick_edit(group: GroupModel) {
    let body = JSON.stringify({ "isEdit": 1, "data": group })
    let navigationExtra: NavigationExtras = {
      queryParams: {
        "element": body
      }
    }
    this.route.navigate(["/group-form"], navigationExtra)
  }

  openAddGroupDialog(group: GroupModel) { }

  // ==========|CLEARE VALUE SEARCH AND GET AGAIN|========== //
  onClick_RemoveSearch() {
    let value = '';
    this.applyFilter(value);
  }
}

