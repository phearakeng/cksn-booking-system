import { Request, Response } from "express";
import { baseController } from './base.controller';
import { getCustomRepository } from 'typeorm';
import { BookingRepository } from '../orm/repository/booking.repository';
import { Port } from '../orm/entity/port.entity';



export class BookingController extends baseController {

  constructor() {
    super()
    this.controllerName = "/Booking/"
  }


  /**
  * @method saveBooking
  * @param app 
  */
  public saveBooking(app): void {
    app
      .post(this.controllerName + "saveBooking",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let booking = req.body
          getCustomRepository(BookingRepository).saveBooking(booking).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
   * @method updateBookingStatus
   * @param app 
   */
  public updateBookingStatus(app): void {
    app
      .post(this.controllerName + "updateBookingStatus",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let bookingID = req.body.bookingID
          let statusID = req.body.statusID
          getCustomRepository(BookingRepository).updateBookingStatus(bookingID, statusID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
  * @method getListBookings
  * @param app 
  */
  public getListBookings(app): void {
    app
      .post(this.controllerName + "getListBookings",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let pageIndex = req.body.pageIndex
          let pageSize = req.body.pageSize
          let bookingStatusID = req.body.bookingStatusID
          let fromDate = req.body.fromDate
          let toDate = req.body.toDate
          let userID = req.body.userID
          let groupID = req.body.groupID
          let isViewAll = req.body.isViewAll
          getCustomRepository(BookingRepository).getListBookings(pageIndex, pageSize, bookingStatusID, fromDate, toDate, userID, groupID, isViewAll)
            .then(
              qb => { res.send(qb) }
            )
        })
  }

  getBookingByCKSNNo(app): void {
    app
      .post(this.controllerName + "getBookingByCKSNNo",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let CKSNFile = req.body.CKSNFile
          let operationID = req.body.userID
          let groupID = req.body.groupID
          getCustomRepository(BookingRepository).getBookingByCKSNNo(CKSNFile, operationID, groupID)
            .then(
              qb => { res.send(qb) }
            )
        })
  }

  /**
   * @method getCountBookings
   * @param app 
   */
  public getCountBookings(app): void {
    app
      .post(this.controllerName + "getCountBookings",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let bookingStatusID = req.body.bookingStatusID
          let userID = req.body.userID
          let groupID = req.body.groupID
          let fromDate = req.body.fromDate
          let toDate = req.body.toDate
          let isViewAll = req.body.isViewAll
          getCustomRepository(BookingRepository).getCountBookings(bookingStatusID, userID, groupID, fromDate, toDate, isViewAll).then(
            qb => { res.send(qb) }
          )
        })
  }

  //    /**
  //     * @method getGenerateCKSNCode
  //     * @param app 
  //     */
  //    public getGenerateCKSNCode(app):void{
  //     app
  //     .post(this.controllerName+"getGenerateCKSNCode",
  //         (req: Request, res: Response) => {  

  //         let   ext = req.body.ext

  //         getCustomRepository(BookingRepository).getGenerateCKSNCode(ext).then(
  //             qb =>{res.send(qb)}
  //         ) 
  //      })
  //    }


  /**
   * @method remove booking
   */
  removeBooking(app): void {
    app
      .post(this.controllerName + "removeBooking",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {

          let bookingID = req.body.bookingID
          let userID = req.body.userID
          getCustomRepository(BookingRepository).removeBooking(bookingID).then(
            qb => { res.send(qb) }
          )
        })
  }


  /**
  * @method getBookingsByID
  * @param app 
  */
  public getBookingByID(app): void {
    app
      .post(this.controllerName + "getBookingByID",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let bookingID = req.body.bookingID
          getCustomRepository(BookingRepository).getBookingByID(bookingID).then(
            qb => { res.send(qb) }
          )
        })
  }

  /**
 * @method getBookingsByID
 * @param app 
 */
  public getBookingsReport(app): void {
    app
      .post(this.controllerName + "getBookingsReport",
        (req, res, next) => {
          this.mddileWare.authori_attr(req, res, next, [this.roles_all],)
        },
        (req: Request, res: Response) => {
          let filterModel = req.body as FilterReportModel
          getCustomRepository(BookingRepository).getBookingsReport(filterModel).then(
            qb => { res.send(qb) }
          )
        })
  }

}