import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { Api } from '../../utilities/api';
import { ResponseBody } from '../../utilities/responsebody';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {
  constructor(private http: HttpClient, router: Router) { super(router); }
  getCountDataInMonth() {
    return this.http.post<ResponseBody<any>>(Api.getCountDataInMonth, {})
  }
  getCountBookingStatusInMonth() {
    return this.http.post<ResponseBody<any>>(Api.getCountBookingStatusInMonth, {})
  }
  getCountMonthlyBooking() {
    return this.http.post<ResponseBody<any>>(Api.getCountMonthlyBooking, {})
  }
}