import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ResponseBody } from '../../utilities/responsebody';
import { Api } from '../../utilities/api';
import { BookingModel } from '../../model/booking.model';
import { CriterialFilter } from '../../model/filter/criterialFilter';
import { BookingModelRequest } from '../../model/request/booking.request';
import { SessionManagement } from '../../utilities/session_management';
import { UserModel } from '../../model/user.model';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {

  constructor(private http: HttpClient, router: Router) { super(router); }


  // saveBooking(booking:BookingModelRequest){
  saveBooking(booking: any) {
    return this.http.post<ResponseBody<any>>(Api.saveBooking, booking)
  }

  updateBookingStatus(bookingID, statusID) {
    return this.http.post<ResponseBody<any>>(Api.updateBookingStatus, { bookingID: bookingID, statusID: statusID })
  }

  getCountBookings(filter: CriterialFilter) {
    let user = new SessionManagement().getLoginSession() as UserModel

    return this.http.post<ResponseBody<any>>(Api.getCountBookings, {
      bookingStatusID: filter.bookingStatusID,
      userID: user.ID,
      groupID: user.group.ID,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      isViewAll: filter.isViewAll
    })
  }

  getListBookings(filter: CriterialFilter) {

    let user = new SessionManagement().getLoginSession() as UserModel
    filter.groupID = user.group.ID
    console.log("getListBookings ", filter)
    return this.http.post<ResponseBody<BookingModel>>(Api.getListBookings, filter)
  }

  getBookingByCKSNNo(filter: CriterialFilter) {
    let user = new SessionManagement().getLoginSession() as UserModel
    filter.groupID = user.group.ID
    return this.http.post<ResponseBody<BookingModel>>(Api.getBookingByCKSNNo, filter)
  }

  getBookingByID(bookingID) {
    return this.http.post<ResponseBody<any>>(Api.getBookingByID, { bookingID: bookingID })
  }

  removeBooking(bookingID) {
    let session = new SessionManagement()
    return this.http.post<ResponseBody<any>>(Api.removeBooking, { bookingID: bookingID, userID: session.getUID() })
  }

  getBookingsReport(filter: any) {
    return this.http.post<ResponseBody<any>>(Api.getBookingsReport, filter);
  }

  // getGenerateCKSNCode(ext){

  //   return this.http.post<ResponseBody<any>>(Api.getGenerateCKSNCode,{"ext":ext})
  // }

}
