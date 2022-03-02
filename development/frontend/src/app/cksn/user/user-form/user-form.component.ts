import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { UserModel } from '../../../model/user.model';
import { DateFormatPipe } from '../../../utilities/DateFormatPipe';
import { UserService } from '../../../services/user/user.service';
import { StatusCode } from '../../../utilities/StatusCode';
import { PredataService } from '../../../services/predata/predata.service';
import { PreData } from '../../../model/pre.data';
import { Criterial } from '../../../services/predata/criterial';
import { FormGroup } from '@angular/forms';
import { GroupService } from '../../../services/group/group.service';
import { DepartmentService } from '../../../services/department/department.service';
import { GroupModel } from '../../../model/group.model';
import { DepartmentModel } from '../../../model/department.model';
import { AskForConfirmationDialogComponent } from '../../ask-for-confirmation-dialog/ask-for-confirmation-dialog.component';
import { ComponentUtilities } from '../../../utilities/componentUtilities';
import { SessionManagement } from '../../../utilities/session_management';
import { Permission } from '../../../model/permission.model';
import { BaseComponent } from '../../baseComponent';
import { CryptoHelper } from 'src/app/utilities/crypto.helper';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent extends BaseComponent implements OnInit {

  // form attribute
  hide = true;

  userEditor: UserModel
  departmentID: number
  isEdit: String // user for check comming request is edit or save data
  groupList: GroupModel[]
  departmentList: DepartmentModel[]
  positionTypeList: PreData[]
  user = new UserModel();
  positionID: any

  session: SessionManagement = new SessionManagement()
  permission: Permission

  constructor(private datePip: DateFormatPipe,
    private userService: UserService,
    private predataService: PredataService,
    private groupService: GroupService,
    private departmentService: DepartmentService,
    private activateRoute: ActivatedRoute,
    public router: Router,
    private matSnackbar: MatSnackBar,
    public dialog: MatDialog) {
    super(router)
  }

  ngOnInit() {

    let user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res => res.pageID == Criterial.userFormPageID)[0]
    if (this.permission && this.permission.isView == true) {
      this.isEdit = "0"
      this.userEditor = null
      this.getStaffPosition()
      this.getListDepartments()
      this.onLoadData()
    }
    else {
      ComponentUtilities.showNotification("Permission Denied", Criterial.warningNotify)
    }
  }

  onClick_Save(): void {
    const dialogRef = this.dialog.open(AskForConfirmationDialogComponent, {
      width: '400px',
      data: { message: "Are YOU sure to create?", title: "AN CREATE" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        try {
          this.user.group = this.groupList.filter(g => g.ID.toString().includes(this.user.groupID.toString()))[0]
        }
        catch (ex) {
          ComponentUtilities.showNotification("Invalid!, Input Can't Be NULL!", Criterial.dangerNotify)
          return;
        }
        this.user.dob = this.datePip.transform(this.user.dob)
        this.user.dateJoined = this.datePip.transform(this.user.dateJoined)
        let pwd = JSON.stringify(this.user.password)
        this.user.password = CryptoHelper.encrypt_req(this.user.password)

        this.userService.addUsers(this.user).subscribe(res => {
          this.user.password = pwd
          if (res.status == StatusCode.success) {
            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
            this.router.navigate(["/users"])
          }
          else {
            if (this.user.dob != undefined) {
              this.user.dob = new Date(this.user.dob)
            }

            if (this.user.dateJoined != undefined) {
              this.user.dateJoined = new Date(this.user.dateJoined)
            }

            this.matSnackbar.open(res.body[0].toString(), res.status, {
              duration: 2000,
            });
          }
        })
      }
      else {
        console.log("Data is cancel")
      }
    });
  }
  onLoadData() {
    this.activateRoute.queryParams.subscribe(param => {
      if (param["element"]) {
        let element = JSON.parse(param["element"])
        if (element.isEdit == "1") {
          this.isEdit = "1"
          this.userService.findUserByID(element.ID)
            .subscribe(res => {

              if (res.status == StatusCode.success && res.body.length > 0) {
                this.user = res.body[0] as UserModel
                this.onDateJoinChange()
                this.departmentID = this.user.group.departmentID
                this.getGroupByDeparmentID(this.departmentID)
              }
            })
        }
      }
    })
  }

  // ** event
  userTypeSelectionChanged(event) {
    console.log(event)
  }

  onDepartmentSelectChanged() {
    this.getGroupByDeparmentID(this.departmentID)
  }

  /**
   * @method of pre data
   */
  getStaffPosition() {
    this.predataService.getPreDefinedsByCriterial(Criterial.staff_position).subscribe(
      rs => {
        if (rs.status == StatusCode.success && rs.body.length > 0) {
          this.positionTypeList = rs.body
        }
      }
    )
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

  getGroupByDeparmentID(departmentID) {
    this.groupService.getGroupByDepartmentID(departmentID).subscribe(res => {
      if (res.status == StatusCode.success && res.status.length > 0) {
        this.groupList = res.body

        if (this.user.group) {
          this.user.group = this.groupList.filter(q => q.ID.toString().includes(this.user.groupID.toString()))[0]
          this.user.groupID = this.user.group.ID
        }
        else {
          this.user.groupID = this.groupList[0].ID
        }
      }
    })
  }

  onDateJoinChange() {
    try {

      if (new Date().getTime() > new Date(this.user.dateJoined).getTime()) {
        let val = this.datePip.dateDiff(new Date(this.user.dateJoined), new Date())
        if (val >= 365) {
          let year = Math.floor(val / 365)
          let month = new Date().getMonth() - this.user.dateJoined.getMonth();
          this.user.lengthOfService = year + "years " + Math.floor(month) + " months ";
        }
        else {
          val = val / 30;
          if (val < 1) {
            this.user.lengthOfService = "" + val * 30 + " days";
          }
          else {
            this.user.lengthOfService = "" + Math.round(val) + " months";
          }
        }
      }
    } catch (error) {
      console.log(error)
      this.user.lengthOfService = "invalid length of service"
    }


  }

}
