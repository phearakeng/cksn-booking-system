import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { CriterialFilter } from '../../model/filter/criterialFilter';
import { MultipleDelivery } from '../../model/multipleDelivery.model';
import { SessionManagement } from '../../utilities/session_management';
import { UserModel } from '../../model/user.model';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContainerService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }


  saveContainer(container){
    return this.http.post<ResponseBody<any>>(Api.saveContainer,container)
  }

  saveTheContainer(container){
    return this.http.post<ResponseBody<any>>(Api.saveTheContainer,container)
  }

  saveMultiDrop(multiDelivery){
    return this.http.post<ResponseBody<any>>(Api.saveMultiDelivery,multiDelivery)
  }

  getCountContainers(filter:CriterialFilter){
    let user = new SessionManagement().getLoginSession() as UserModel

    return this.http.post<ResponseBody<any>>(Api.getCountContainers,{containerStatusID:filter.containerStatusID,
                                                                  fromDate:filter.fromDate,
                                                                  toDate:filter.toDate,
                                                                  userID:user.ID,
                                                                  groupID:user.group.ID,
                                                                  isViewAll:filter.isViewAll,
                                                                })
  }

  getListCotainters(filter:CriterialFilter){

    let user = new SessionManagement().getLoginSession() as UserModel
    filter.groupID = user.group.ID
    filter.userID = user.ID
    return this.http.post<ResponseBody<any>>(Api.getListCotainters,filter)
  }

  getContainerByID(containerID){
    return this.http.post<ResponseBody<any>>(Api.getContainerByID,{"containerID":containerID})
  }

  removeContainerByID(containerID){
    return this.http.post<ResponseBody<any>>(Api.removeContainerByID,{"containerID":containerID})
  }


  getMultiDropByContainers(containerID,isActive){
    return this.http.post<ResponseBody<MultipleDelivery>>(Api.getMultiDropByContainers,{"containerID":containerID,"isActive":isActive})
  }

  saveDataImport(dataImport){
    return this.http.post<ResponseBody<MultipleDelivery>>(Api.saveDataImport,dataImport);
  }

}
