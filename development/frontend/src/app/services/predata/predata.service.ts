import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseBody } from '../../utilities/responsebody';
import { PreData } from '../../model/pre.data';
import { Api } from '../../utilities/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PredataService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

   getPreDefinedsByCriterial(criterial:any){
     return this.http.post<ResponseBody<PreData>>(Api.getPredataByCriterial,{"criterial":criterial})
   }

   addPreData(predata:PreData[]){
    return this.http.post<ResponseBody<PreData>>(Api.addPreData,{"predata":predata})
  }
   
  getListPredatas(criterial,pageIndex,pageSize){
    if(!criterial){criterial="all"}
    return this.http.post<ResponseBody<PreData>>(Api.getListPredatas,{"criterial":criterial,"pageIndex":pageIndex,"pageSize":pageSize})
  }

  getListCriterial(){
    return this.http.post<ResponseBody<PreData>>(Api.getListCriterial,{})
  }

  getCountPredatas(criterial){
    return this.http.post<ResponseBody<any>>(Api.getCountPredatas,{"criterial":criterial})
  }

}
