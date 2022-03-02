import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentModel } from '../../model/department.model';
import { NavigationExtras, Router } from '@angular/router';
import { StatusCode } from '../../utilities/StatusCode';
import { ComponentUtilities } from '../../utilities/componentUtilities';
import { Criterial } from '../../services/predata/criterial';
import { UserModel } from '../../model/user.model';
import { DepartmentService } from '../../services/department/department.service';
import { Permission } from '../../model/permission.model';
import { SessionManagement } from '../../utilities/session_management';
import { MatTableDataSource} from '@angular/material/table';
import { MatTable} from '@angular/material/table';
import { PageEvent} from '@angular/material/paginator';
import { BaseComponent } from '../baseComponent';

declare const $: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent extends BaseComponent implements OnInit {

  
  displayedColumns: String[] =  ["Name","Status","action"]
  public dataSourceDepartment:MatTableDataSource<DepartmentModel>=new MatTableDataSource() // data source product to buy
  @ViewChild('tblDepartment',{static: false}) tblUser: MatTable<any>
  department:DepartmentModel
  pageLength=0;
  pageSize;
  pageSizeOptions: number[] = [50,100,300];
  // MatPaginator Output
  pageEvent: PageEvent;
  criterial = ''

  session:SessionManagement = new SessionManagement()
  permission : Permission

  departmentField:any

  constructor(public route:Router,private depService:DepartmentService) {
      super(route)
   }

  ngOnInit() {
    let  user = this.session.getLoginSession() as UserModel
    this.permission = user.group.groupPermission.filter(res=>res.pageID==Criterial.groupsPageID)[0]  
    if(this.permission && this.permission.isView==true)
    {
      this.getCountDepartment();
      this.getListDepartment(0,50)
    }
    else{
         ComponentUtilities.showNotification("Permission Denied",Criterial.warningNotify)
    }
  }

  getCountDepartment(){
      // this.depService.getCoungetDepartment().subscribe(
      //   res=>{
      //        if(res.status==StatusCode.success){
      //          this.pageLength = res.body[0]
      //        }
      //   }
      // )
  }

  getListDepartment(pageIndex,pageSize){
      this.depService.
      getListDepartmentsPagin(pageIndex,pageSize)
      .subscribe(res=>{
          console.log(res)
          if(res.status==StatusCode.success && res.body.length > 0){
            this.dataSourceDepartment.data = res.body
          }
      })

  }


  paginatorEvent(event){
    let pageIndex = ((event.pageIndex) * event.pageSize )
    this.getListDepartment(pageIndex,event.pageSize)
}

  applyFilter(filterValue: string) {
    this.dataSourceDepartment.filter = filterValue.trim().toLowerCase();
  }

   newDepartment  = new DepartmentModel()
  addDepartment(){
        this.newDepartment.name = this.departmentField
        this.departmentField = undefined
      this.depService.addDepartment(this.newDepartment).subscribe(res=>{
          if(res.status==StatusCode.success){
              $("#modalAdding").modal('toggle');
              this.newDepartment  = new DepartmentModel()
              this.getListDepartment(0,50)
          }
      })
  }

  onClick_edit(dep:DepartmentModel){
    // this.openAddGroupDialog(group)
     this.newDepartment = JSON.parse(JSON.stringify(dep))
     this.departmentField = dep.name
     $("#modalAdding").modal('toggle');
  }

  change(event){
    this.newDepartment.status = event.checked==true?1:0;
 }    



}
