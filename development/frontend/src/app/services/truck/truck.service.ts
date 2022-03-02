import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResponseBody } from '../../utilities/responsebody';
import { TruckModel } from '../../model/truck.model';
import { Api } from '../../utilities/api';

@Injectable({
  providedIn: 'root'
})
export class TruckService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  /**
   * method : getListTruckByDriver
   */
  getListTruckByDriver(groupID:any){
    // let session = new SessionManagement();
    // session.getUID()
     let json = {groupID:groupID}
      return  this.http.post<ResponseBody<TruckModel>>(Api.getListTruckByDriver,json)
  }

  /**
   * method : getListTruck
   */

  getAllTruck()
  {
    let json = {}
    return  this.http.post<ResponseBody<TruckModel>>(Api.getAllTruck,json)
  }


  getAllTrucks(pageSize,pageIndex)
  {
    let json = {pageSize:pageSize,pageIndex:pageIndex}
    return  this.http.post<ResponseBody<TruckModel>>(Api.getAllTrucks,json)
  }

  getCountTrucks() 
  {
    let json = {}
    return  this.http.post<ResponseBody<any>>(Api.getCountTrucks,json)
  }

  saveTruck(json:TruckModel) 
  {
    return  this.http.post<ResponseBody<TruckModel>>(Api.saveTruck,json)
  }


}
