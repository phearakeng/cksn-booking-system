import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { GroupModel } from '../../model/group.model';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GroupService  extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

   getGroupByDepartmentID(departmentID:any){
     return this.http.post<ResponseBody<GroupModel>>(Api.getGroupByDepartmentID,{departmentID:departmentID})
   }

   getPermissionByGroupID(groupID){
    return this.http.post<ResponseBody<GroupModel>>(Api.getPermissionByGroupID,{groupID:groupID})
  }

  getListGroup(pageIndex,pageSize){
    let json = {"pageIndex":pageIndex,"pageSize":pageSize}
    return  this.http.post<ResponseBody<GroupModel >>(Api.getListGroups,json)
  }

  getCountGroups(){
    return  this.http.post<ResponseBody<any>>(Api.getCountGroups,{})
  }

  addGroup(group:GroupModel){
    return  this.http.post<ResponseBody<any>>(Api.addGroup,group)
  }

  getAllPages(){
    let json = {}
    return  this.http.post<ResponseBody<any>>(Api.getAllPages,json)
  }

}
