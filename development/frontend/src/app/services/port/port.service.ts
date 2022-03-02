import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { extend } from 'webdriver-js-extender';
import { BaseService } from '../base.service';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { PortModel } from '../../model/port.model';

@Injectable({
  providedIn: 'root'
})
export class PortService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }


  getPortList(portType){
    const options = {
      headers: this.getHeader()
    };
      return this.http.post<ResponseBody<PortModel>>(Api.getPortList,{"portType":portType},options)
  }

  getPortListWithSize(pageIndex,pageSize){
    return this.http.post<ResponseBody<PortModel>>(Api.getPortListWithSize,{"pageSize":pageSize,"pageIndex":pageIndex})
  }

  getPortByID(ID){
    return this.http.post<ResponseBody<PortModel>>(Api.getPortByID,{"ID":ID})
  }

  addPort(port:PortModel){
    return this.http.post<ResponseBody<PortModel>>(Api.addPort,port)
  }

  getCountPorts(){
    return this.http.post<ResponseBody<any>>(Api.getCountPorts,{})
  }

}
