import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { extend } from 'webdriver-js-extender';
import { BaseService } from '../base.service';
import { DocumentModel } from '../../model/document.model';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  addDocuments(doc:DocumentModel[]){
     return this.http.post<ResponseBody<any>>(Api.addDocuments,doc)
  }

  getListDocuments(bookingID){
    let json = {"bookingID":bookingID}
      return  this.http.post<ResponseBody<DocumentModel>>(Api.getListDocuments,json)
  }

  deleteDocument(IDGenerate){
    let json = {"IDGenerate":IDGenerate}
      return  this.http.post<ResponseBody<DocumentModel>>(Api.deleteDocument,json)
  }

}
