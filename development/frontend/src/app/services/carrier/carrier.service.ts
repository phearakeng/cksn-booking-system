import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';

@Injectable({
  providedIn: 'root'
})
export class CarrierService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }


  getAllCarriers(){
      return this.http.post<ResponseBody<any>>(Api.getAllCarriers,{})
  }
}
