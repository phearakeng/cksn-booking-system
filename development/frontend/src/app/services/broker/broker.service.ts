import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { Api } from '../../utilities/api';
import { ResponseBody } from '../../utilities/responsebody';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BrokerService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  getAllBrokers(){
     return this.http.post<ResponseBody<any>>(Api.getAllBrokers,{})
  }
  
}
