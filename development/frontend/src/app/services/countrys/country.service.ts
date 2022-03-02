import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CountryResponse } from '../../model/country.response';
import { Api } from '../../utilities/api';
import { ResponseBody } from '../../utilities/responsebody';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService {

  constructor(private http:HttpClient,router: Router) { super(router); }

  getListCountrys(){
      return  this.http.get<ResponseBody<CountryResponse>>(Api.getListCountrys)
  }
}
