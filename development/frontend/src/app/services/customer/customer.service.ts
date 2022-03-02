import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { CustomerModel } from '../../model/customer.model';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { SessionManagement } from '../../utilities/session_management';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  addCustomers(customer:CustomerModel){
     return this.http.post<ResponseBody<any>>(Api.addCustomers,customer)
  }

  getListCustomers(pageIndex:any,pageSize:any){
    let json = {"pageIndex":pageIndex,"pageSize":pageSize}
      return  this.http.post<ResponseBody<CustomerModel>>(Api.getListCustomers,json)
  }

  getCustomerByType(customerType){
    let json = {customerType:customerType}
      return  this.http.post<ResponseBody<CustomerModel>>(Api.getCustomerByType,json)
  }

  removeCustomer(customerID){
      let session= new SessionManagement()
      let json = {customerID:customerID,userID:session.getUID()}
      return  this.http.post<ResponseBody<any>>(Api.removeCustomer,json)
  }

  getCountCustomers(){
    return  this.http.post<ResponseBody<any>>(Api.getCountCustomers,{})
  }

  /**
   * method : findCustomerByID
   * @param ID 
   */
  findCustomerByID(ID:any){
    // let session = new SessionManagement();
    // session.getUID()
     let json = {customerID:ID}
      return  this.http.post<ResponseBody<CustomerModel>>(Api.findCustomerByID,json)
  }


}
