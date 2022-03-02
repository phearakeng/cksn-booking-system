import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../utilities/api';
import { ResponseBody } from '../../utilities/responsebody';
import { BusinessPartnerModel } from '../../model/businesspartner.model';
import { CriterialFilter } from '../../model/filter/criterialFilter';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }


  getAllBusinessPartners(){
      return this.http.post<ResponseBody<any>>(Api.getAllBusinessPartners,{})
  }

  getCountBusinessPartner(){
    return this.http.post<ResponseBody<any>>(Api.getCountBusinessPartner,{})
  }

  getListBusinessPartner(filter:CriterialFilter){
    return this.http.post<ResponseBody<BusinessPartnerModel>>(Api.getListBusinessPartner,{})
  }

  getBusinessPartnerByID(ID){
    return this.http.post<ResponseBody<BusinessPartnerModel>>(Api.getBusinessPartnerByID,{ID:ID})
  }

  saveBusinessPartner(business:BusinessPartnerModel){
    return this.http.post<ResponseBody<any>>(Api.saveBusinessPartner,business)
  }

  removeBusinessPartnerByID(ID){
      return this.http.post<ResponseBody<BusinessPartnerModel>>(Api.removeBusinessPartnerByID,{ID:ID})
  }

}
