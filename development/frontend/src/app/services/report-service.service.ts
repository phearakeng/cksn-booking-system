import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { ResponseBody } from '../utilities/responsebody';
import { Api } from '../utilities/api';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }


  getBookingsReport(filter:any){
    return this.http.post<ResponseBody<any>>(Api.getBookingsReport,filter);
  }

  getEmptyReport(filter:any){
    return this.http.post<ResponseBody<any>>(Api.getEmptyReport,filter);
  }


  getConsoleReport(filter:any){
    return this.http.post<ResponseBody<any>>(Api.getConsoleReport,filter);
  }

  // getGenerateCKSNCode(ext){

  //   return this.http.post<ResponseBody<any>>(Api.getGenerateCKSNCode,{"ext":ext})
  // }
  
}
