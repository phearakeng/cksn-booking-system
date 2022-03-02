import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { DepartmentModel } from '../../model/department.model';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class DepartmentService  extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }
   

   getListDepartments(){
     return this.http.post<ResponseBody<DepartmentModel>>(Api.getListDepartments,{})
   }

   getListDepartmentsPagin(pageIndex,pageSize){
    return this.http.post<ResponseBody<DepartmentModel>>(Api.getListDepartmentsPagin,{"pageIndex":pageIndex,"pageSize":pageSize})
  }

  getCountDepartments(){
    return this.http.post<ResponseBody<DepartmentModel>>(Api.getCountDepartments,{})
  }

//delete, update and save departmnet

  addDepartment(dep:DepartmentModel){
    return this.http.post<ResponseBody<DepartmentModel>>(Api.addDepartment,dep)
  }

   

}
